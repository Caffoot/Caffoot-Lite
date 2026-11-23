"""Validate ticket files and keep the retained limit inside the ticket transaction."""
import base64
import binascii
from io import BytesIO
import re
import struct
import unicodedata
import xml.etree.ElementTree as ET
import zipfile
import zlib

MAX_TICKET_ATTACHMENT_BYTES = 10_000_000
MAX_RETAINED_TICKET_BYTES = 100_000_000
OFFICE_DOCUMENTS = {
    '.docx': ('word/document.xml', 'wordprocessingml.document.main+xml', 'document'),
    '.xlsx': ('xl/workbook.xml', 'spreadsheetml.sheet.main+xml', 'workbook'),
}
CONTENT_TYPES_NAMESPACE = 'http://schemas.openxmlformats.org/package/2006/content-types'
RELATIONSHIPS_NAMESPACE = 'http://schemas.openxmlformats.org/package/2006/relationships'
OFFICE_NAMESPACES = ('http://schemas.openxmlformats.org', 'http://purl.oclc.org/ooxml')


def is_ticket_png(contents):
    """Check that the image has valid chunk boundaries, checksums and image data."""
    if not contents.startswith(b'\x89PNG\r\n\x1a\n'):
        return False
    position = 8
    has_image = False
    while position + 12 <= len(contents):
        size, kind = struct.unpack_from('>I4s', contents, position)
        end = position + 8 + size
        if end + 4 > len(contents):
            return False
        if zlib.crc32(contents[position + 4:end]) != struct.unpack_from('>I', contents, end)[0]:
            return False
        if position == 8:
            if kind != b'IHDR' or size != 13:
                return False
            width, height, depth, colour, compression, filtering, interlace = struct.unpack_from(
                '>IIBBBBB', contents, position + 8)
            depths = {0: (1, 2, 4, 8, 16), 2: (8, 16), 3: (1, 2, 4, 8), 4: (8, 16), 6: (8, 16)}
            if (not 0 < width <= 2**31 - 1 or not 0 < height <= 2**31 - 1
                    or depth not in depths.get(colour, ()) or compression or filtering or interlace > 1):
                return False
        elif kind == b'IHDR':
            return False
        if kind == b'IDAT' and size:
            has_image = True
        if kind == b'IEND':
            return has_image and size == 0 and end + 4 == len(contents)
        position = end + 4
    return False


def is_ticket_jpeg(contents):
    """Require a bounded JPEG frame, image scan and end marker."""
    if not contents.startswith(b'\xff\xd8'):
        return False
    position = 2
    has_frame = has_scan = False
    while position < len(contents) and contents[position] == 255:
        while position < len(contents) and contents[position] == 255:
            position += 1
        if position == len(contents):
            return False
        marker = contents[position]
        position += 1
        if marker == 0xD9:
            return has_frame and has_scan and position == len(contents)
        if marker < 0xC0 or 0xD0 <= marker <= 0xD8 or position + 2 > len(contents):
            return False
        size = int.from_bytes(contents[position:position + 2], 'big')
        if size < 2 or position + size > len(contents):
            return False
        if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
            if size < 11:
                return False
            height, width, components = struct.unpack_from('>HHB', contents, position + 3)
            if not width or not height or not components or size != 8 + 3 * components:
                return False
            has_frame = True
        position += size
        if marker == 0xDA:
            if not has_frame or size < 8:
                return False
            scan_end = re.compile(rb'\xff+(?![\xff\x00\xd0-\xd7])(?=[\x01-\xfe])').search(contents, position)
            if scan_end is None or scan_end.start() == position:
                return False
            has_scan = True
            position = scan_end.start()
    return False


def is_ticket_pdf(contents):
    """Check the PDF version, final trailer and referenced cross-reference table."""
    if not re.match(rb'%PDF-(?:1\.[0-7]|2\.0)(?:\r\n|\n|\r)', contents):
        return False
    trailer = re.search(rb'startxref\s+(\d{1,8})\s+%%EOF[\x00\t\n\f\r ]*\Z', contents[-2048:])
    if trailer is None:
        return False
    offset = int(trailer[1])
    if not 9 <= offset < len(contents):
        return False
    table = contents[offset:offset + 4096]
    return bool(re.match(rb'xref\s+\d+\s+\d+\s+\d{10}\s+\d{5}\s+[nf]\b', table)
                or (re.match(rb'\d+\s+\d+\s+obj\b', table)
                    and re.search(rb'/Type\s*/XRef\b', table.split(b'stream', 1)[0])))


def is_ticket_text(contents):
    """Accept Unicode plain text with ordinary tabs and line endings."""
    encoding = 'utf-16' if contents.startswith((b'\xff\xfe', b'\xfe\xff')) else 'utf-8-sig'
    try:
        text = contents.decode(encoding)
    except UnicodeError:
        return False
    return bool(text) and re.search(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', text) is None


def read_ticket_office_xml(package, name):
    """Read a bounded XML part with document type declarations disabled."""
    entry = package.getinfo(name)
    if entry.file_size > 20_000_000:
        raise ValueError('Office document XML is too large.')
    contents = package.read(entry)
    encoding = 'utf-16' if contents.startswith((b'\xff\xfe', b'\xfe\xff')) else 'utf-8-sig'
    text = contents.decode(encoding)
    if '<!DOCTYPE' in text or '<!ENTITY' in text:
        raise ValueError('Office document XML contains unsupported declarations.')
    return ET.fromstring(text)


def is_ticket_office_document(contents, extension):
    """Distinguish genuine Word and Excel packages from other ZIP files."""
    if not contents.startswith(b'PK\x03\x04'):
        return False
    part, content_type, root = OFFICE_DOCUMENTS[extension]
    try:
        with zipfile.ZipFile(BytesIO(contents)) as package:
            entries = package.infolist()
            if (len(entries) > 5000 or sum(entry.file_size for entry in entries) > MAX_RETAINED_TICKET_BYTES
                    or len({entry.filename.casefold() for entry in entries}) != len(entries)
                    or any(entry.flag_bits & 1 or entry.compress_type not in (0, 8)
                           or '\\' in entry.filename or '..' in entry.filename.split('/')
                           or entry.filename.startswith('/') for entry in entries)):
                return False
            types = read_ticket_office_xml(package, '[Content_Types].xml')
            relationships = read_ticket_office_xml(package, '_rels/.rels')
            if types.tag != f'{{{CONTENT_TYPES_NAMESPACE}}}Types':
                return False
            if relationships.tag != f'{{{RELATIONSHIPS_NAMESPACE}}}Relationships':
                return False
            matching_type = f'application/vnd.openxmlformats-officedocument.{content_type}'
            if not any(element.get('PartName') == '/' + part and element.get('ContentType') == matching_type
                       for element in types.findall(f'{{{CONTENT_TYPES_NAMESPACE}}}Override')):
                return False
            relationship_types = {namespace + '/officeDocument/relationships/officeDocument'
                                  for namespace in OFFICE_NAMESPACES}
            if not any(element.get('Type') in relationship_types and element.get('Target', '').lstrip('/') == part
                       and element.get('TargetMode', 'Internal') == 'Internal'
                       for element in relationships.findall(f'{{{RELATIONSHIPS_NAMESPACE}}}Relationship')):
                return False
            document = read_ticket_office_xml(package, part)
            family = 'wordprocessingml' if extension == '.docx' else 'spreadsheetml'
            return (any(document.tag == f'{{{namespace}/{family}/main}}{root}' for namespace in OFFICE_NAMESPACES)
                    and not any('vbaproject' in entry.filename.lower() for entry in entries)
                    and package.testzip() is None)
    except (KeyError, ET.ParseError, OSError, EOFError, RuntimeError, ValueError,
            NotImplementedError, zipfile.BadZipFile, zlib.error):
        return False


def validate_ticket_attachments(files):
    """Check file names, decoded sizes and contents before saving any ticket changes."""
    if not isinstance(files, list):
        raise ValueError('Send a list of attachments.')
    attachments = []
    total = 0
    for file in files:
        if not isinstance(file, dict) or file.keys() != {'filename', 'contents'}:
            raise ValueError('Invalid attachment fields.')
        name, encoded = file['filename'], file['contents']
        if (not isinstance(name, str) or not 1 <= len(name) <= 200 or name != name.strip()
                or any(character in '/\\:' or unicodedata.category(character).startswith('C') for character in name)
                or name.startswith('.')):
            raise ValueError('Select a file with a valid attachment name.')
        if not isinstance(encoded, str) or not 0 < len(encoded) <= 4 * ((MAX_TICKET_ATTACHMENT_BYTES + 2) // 3):
            raise ValueError('Each attachment must be between 1 byte and 10 MB.')
        try:
            contents = base64.b64decode(encoded, validate=True)
        except (ValueError, binascii.Error):
            raise ValueError('The attachment could not be read.') from None
        if not 0 < len(contents) <= MAX_TICKET_ATTACHMENT_BYTES:
            raise ValueError('Each attachment must be between 1 byte and 10 MB.')
        total += len(contents)
        if total > MAX_RETAINED_TICKET_BYTES:
            raise ValueError('A ticket can retain up to 100 MB of attachments.')
        extension = name[name.rfind('.'):].lower() if '.' in name else ''
        validators = {'.png': is_ticket_png, '.jpg': is_ticket_jpeg, '.jpeg': is_ticket_jpeg,
                      '.pdf': is_ticket_pdf, '.txt': is_ticket_text}
        if extension in OFFICE_DOCUMENTS:
            valid = is_ticket_office_document(contents, extension)
        else:
            validator = validators.get(extension)
            valid = validator is not None and validator(contents)
        if not valid:
            raise ValueError(f'{name} is not a valid PNG, JPEG, PDF, TXT, DOCX or XLSX attachment.')
        attachments.append((name, contents))
    return attachments


def insert_ticket_attachments(connection, ticket_id, message_id, attachments):
    """Check and reserve the retained allowance under the same write lock."""
    retained = connection.execute(
        'SELECT coalesce(sum(length(contents)),0) FROM service_desk_attachments WHERE ticket_id=?',
        (ticket_id,)).fetchone()[0]
    if retained + sum(len(contents) for _, contents in attachments) > MAX_RETAINED_TICKET_BYTES:
        raise ValueError('A ticket can retain up to 100 MB of attachments.')
    # Keep removed download links expired when new files are added to the same ticket.
    last_id = connection.execute("""
        SELECT max(coalesce((SELECT max(id) FROM service_desk_attachments),0),
                   coalesce((SELECT max(json_extract(details,'$.removedAttachmentId'))
                             FROM service_desk_events WHERE ticket_id=?),0))
    """, (ticket_id,)).fetchone()[0]
    connection.executemany("""
        INSERT INTO service_desk_attachments(id,ticket_id,message_id,filename,contents) VALUES(?,?,?,?,?)
    """, ((last_id + index, ticket_id, message_id, name, contents)
          for index, (name, contents) in enumerate(attachments, start=1)))
