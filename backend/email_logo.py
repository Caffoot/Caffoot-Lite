"""Validate company logos using the application's image-file checks."""
import base64
import binascii
import struct
import zlib

from .profiles import _jpeg_dimensions
from .service_desk_attachments import is_ticket_jpeg, is_ticket_png

MAX_LOGO_BYTES = 2 * 1024 * 1024
MAX_ENCODED_LOGO_BYTES = 4 * ((MAX_LOGO_BYTES + 2) // 3)
MAX_LOGO_PIXELS = 16_777_216


def png_has_valid_pixels(data, width, height):
    """Check the compressed rows, including interlaced images, within the pixel limit."""
    depth, colour, _, _, interlaced = data[24:29]
    channels = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[colour]
    passes = ((0, 0, 8, 8), (4, 0, 8, 8), (0, 4, 4, 8), (2, 0, 4, 4),
              (0, 2, 2, 4), (1, 0, 2, 2), (0, 1, 1, 2)) if interlaced else ((0, 0, 1, 1),)
    rows = []
    for x, y, dx, dy in passes:
        if x < width and y < height:
            columns, count = (width - x + dx - 1) // dx, (height - y + dy - 1) // dy
            rows.append((count, 1 + (columns * channels * depth + 7) // 8))
    expected = sum(count * length for count, length in rows)
    compressed = bytearray()
    position = 8
    while position < len(data):
        size, kind = struct.unpack_from('>I4s', data, position)
        if kind == b'IDAT':
            compressed.extend(data[position + 8:position + 8 + size])
        position += size + 12
    try:
        decoder = zlib.decompressobj()
        pixels = decoder.decompress(compressed, expected + 1)
    except zlib.error:
        return False
    if len(pixels) != expected or not decoder.eof or decoder.unused_data:
        return False
    position = 0
    for count, length in rows:
        end = position + count * length
        if any(filter_type > 4 for filter_type in pixels[position:end:length]):
            return False
        position = end
    return True


def validate_logo(payload):
    """Identify PNG or JPEG from its contents and return dimensions for scaling."""
    if (not isinstance(payload, dict) or payload.keys() != {'mime', 'data'}
            or payload['mime'] not in ('image/png', 'image/jpeg') or not isinstance(payload['data'], str)
            or len(payload['data']) > MAX_ENCODED_LOGO_BYTES):
        raise ValueError('Upload a PNG or JPEG logo up to 2 MB.')
    mime = payload['mime']
    try:
        data = base64.b64decode(payload['data'], validate=True)
    except (ValueError, binascii.Error):
        raise ValueError('The selected logo is not a valid PNG or JPEG.') from None
    if len(data) > MAX_LOGO_BYTES:
        raise ValueError('Choose a logo up to 2 MB.')
    if mime == 'image/png' and is_ticket_png(data):
        width, height = struct.unpack_from('>II', data, 16)
    elif mime == 'image/jpeg' and is_ticket_jpeg(data):
        height, width = _jpeg_dimensions(data)
    else:
        raise ValueError('The selected logo is not a valid PNG or JPEG.')
    if width * height > MAX_LOGO_PIXELS:
        raise ValueError('The logo has too many pixels. Resize the image and try again.')
    if mime == 'image/png' and not png_has_valid_pixels(data, width, height):
        raise ValueError('The selected logo contains invalid PNG image data.')
    return {'mime': mime, 'data': data, 'width': width, 'height': height}
