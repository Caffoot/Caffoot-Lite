"""Exercise content checks with structurally valid files and wrong declared types."""
import base64
from io import BytesIO
import struct
import unittest
import zipfile
import zlib

from backend.service_desk_attachments import (CONTENT_TYPES_NAMESPACE, MAX_TICKET_ATTACHMENT_BYTES,
    OFFICE_DOCUMENTS, OFFICE_NAMESPACES, RELATIONSHIPS_NAMESPACE, validate_ticket_attachments)


def ticket_file(filename, data):
    return {'filename':filename, 'contents':base64.b64encode(data).decode()}


def ticket_png():
    def chunk(kind, data):
        return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data))
    return (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', 1, 1, 8, 0, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(b'\x00\x01')) + chunk(b'IEND', b''))


def ticket_pdf():
    contents = (b'%PDF-1.4\n1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n'
                b'2 0 obj\n<</Type/Pages/Count 0/Kids[]>>\nendobj\n')
    return contents + (f'xref\n0 3\n0000000000 65535 f \n0000000009 00000 n \n'
                       f'{contents.index(b"2 0 obj"):010d} 00000 n \ntrailer\n<</Size 3/Root 1 0 R>>\n'
                       f'startxref\n{len(contents)}\n%%EOF\n').encode()


def ticket_office_document(extension):
    part, content_type, root = OFFICE_DOCUMENTS[extension]
    namespace = OFFICE_NAMESPACES[0]
    family = 'wordprocessingml' if extension == '.docx' else 'spreadsheetml'
    archive = BytesIO()
    with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED) as package:
        package.writestr('[Content_Types].xml', f'<Types xmlns="{CONTENT_TYPES_NAMESPACE}">'
            f'<Override PartName="/{part}" ContentType="application/vnd.openxmlformats-officedocument.{content_type}"/>'
            '</Types>')
        package.writestr('_rels/.rels', f'<Relationships xmlns="{RELATIONSHIPS_NAMESPACE}">'
            f'<Relationship Id="rId1" Target="{part}" Type="{namespace}/officeDocument/relationships/officeDocument"/>'
            '</Relationships>')
        package.writestr(part, f'<{root} xmlns="{namespace}/{family}/main"/>')
    return archive.getvalue()


class ServiceDeskAttachmentContentTests(unittest.TestCase):
    def test_content_allowlist_and_extension_validation(self):
        png = ticket_png()
        pdf = ticket_pdf()
        docx = ticket_office_document('.docx')
        xlsx = ticket_office_document('.xlsx')
        # A 1 × 1 greyscale JPEG fixture.
        jpeg = base64.b64decode(
            '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwg'
            'JC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAHwAAAQUBAQEBAQEAAAAA'
            'AAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEI'
            'I0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1'
            'dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi'
            '4+Tl5ufo6erx8vP09fb3+Pn6/9oACAEBAAA/APf6/9k=')
        valid = [('proof.png',png), ('proof.JPG',jpeg), ('proof.pdf',pdf),
                 ('équipement.txt','A note with accents é.\n'.encode()), ('proof.docx',docx), ('proof.xlsx',xlsx)]
        self.assertEqual(validate_ticket_attachments([ticket_file(*item) for item in valid]), valid)
        for name, data in (('proof.png', png[:-6]), ('proof.jpg', jpeg[:-2]), ('proof.pdf', b'%PDF-1.4\n'),
                           ('proof.docx', xlsx), ('proof.xlsx', docx), ('proof.txt', b'\x00binary'),
                           ('proof.pdf', png), ('proof.png', b'Plain text'), ('proof.docx', b'PK\x03\x04')):
            with self.subTest(filename=name), self.assertRaises(ValueError):
                validate_ticket_attachments([ticket_file(name, data)])

    def test_file_size_boundary(self):
        contents = b'x' * MAX_TICKET_ATTACHMENT_BYTES
        self.assertEqual(len(validate_ticket_attachments([ticket_file('note.txt', contents)])[0][1]),
                         MAX_TICKET_ATTACHMENT_BYTES)
        for invalid in (b'', contents + b'x'):
            with self.assertRaises(ValueError):
                validate_ticket_attachments([ticket_file('note.txt', invalid)])
