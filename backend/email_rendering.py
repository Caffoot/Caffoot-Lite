"""Render editable email wording and protected details as HTML and plain text."""
from collections import Counter
from html import escape
from html.parser import HTMLParser
import ipaddress
import re
from urllib.parse import urlsplit

_PLACEHOLDER = re.compile(r'{{([^{}]*)}}')
_FORMAT = {'b': 'strong', 'strong': 'strong', 'i': 'em', 'em': 'em', 'u': 'u',
           'p': 'p', 'div': 'div', 'ul': 'ul', 'li': 'li', 'a': 'a'}
_DISCARD = {'script', 'style', 'iframe', 'object', 'svg', 'math', 'template', 'textarea', 'form'}
_BREAKS = {'p', 'div', 'ul', 'li'}


def safe_email_url(value):
    """Accept absolute HTTPS links with a host and no embedded credentials."""
    if (not value or len(value) > 2048
            or any(char.isspace() or ord(char) < 32 or char in '<>"\\{}' for char in value)):
        return False
    try:
        url = urlsplit(value)
        if (url.scheme != 'https' or not url.hostname or url.username is not None
                or url.password is not None or url.netloc.endswith(':') or url.port == 0):
            return False
        host = url.hostname.encode('idna').decode('ascii')
        if ':' in host:
            ipaddress.IPv6Address(host)
            return url.netloc.startswith('[')
        return all(re.fullmatch(r'[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?', label)
                   for label in host.rstrip('.').split('.'))
    except (ValueError, UnicodeError):
        return False


def replace_email_variables(value, variables):
    """Replace each approved token once so supplied values remain literal text."""
    return _PLACEHOLDER.sub(lambda match: variables.get(match[1], '') or '', value)


class EmailBody(HTMLParser):
    """Rebuild the editor's small set of tags from text and approved links."""
    def __init__(self, variables=None, *, preview=False):
        super().__init__(convert_charrefs=True)
        self.variables = variables
        self.preview = preview
        self.html = []
        self.text = []
        self.tags = []
        self.discarded = []
        self.unsupported_link = False
        self.variables_in_text = Counter()

    def handle_starttag(self, tag, attrs):
        if self.discarded or tag in _DISCARD:
            if tag in _DISCARD:
                self.discarded.append(tag)
            return
        if tag == 'br':
            self.html.append('<br>')
            self.text.append('\n')
            return
        if tag not in _FORMAT:
            return
        name = _FORMAT[tag]
        url = None
        if tag == 'a':
            href = dict(attrs).get('href')
            if safe_email_url(href):
                url = href
            elif href == '{{ticket_link}}' and (self.variables is None or 'ticket_link' in self.variables):
                url = href if self.variables is None else self.variables['ticket_link']
                if url and url != href and not safe_email_url(url):
                    url = None
            else:
                self.unsupported_link = True
            if not url:
                name = None
        if tag in _BREAKS:
            self.text.append('\n• ' if tag == 'li' else '\n')
        if name == 'a':
            href = '' if self.preview else f' href="{escape(url, quote=True)}"'
            self.html.append(f'<a{href}>')
        elif name:
            self.html.append(f'<{name}>')
        self.tags.append((tag, name, url))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if self.discarded:
            if tag == self.discarded[-1]:
                self.discarded.pop()
            return
        for index in range(len(self.tags) - 1, -1, -1):
            if self.tags[index][0] == tag:
                self.close_tags(index)
                break

    def handle_data(self, data):
        if self.discarded:
            return
        self.variables_in_text.update(_PLACEHOLDER.findall(data))
        if self.variables is not None:
            data = replace_email_variables(data, self.variables)
        self.html.append(escape(data, quote=False).replace('\n', '<br>') if self.variables is not None
                         else escape(data, quote=False))
        self.text.append(data)

    def close_tags(self, start):
        for tag, name, url in reversed(self.tags[start:]):
            if name:
                self.html.append(f'</{name}>')
            if tag in _BREAKS:
                self.text.append('\n')
            if url:
                self.text.append(f' ({url})')
        del self.tags[start:]


def parse_email_body(value, variables=None, *, preview=False):
    body = EmailBody(variables, preview=preview)
    body.feed(value)
    body.close()
    body.close_tags(0)
    return body


def email_placeholders(value):
    return {match[1] for match in _PLACEHOLDER.finditer(value)}


def validate_email_wording(template, subject, body, *, complete):
    if (not isinstance(subject, str) or len(subject) > 240
            or any(ord(char) < 32 or char == '\x7f' or 0xd800 <= ord(char) <= 0xdfff for char in subject)):
        raise ValueError('Enter an email subject of up to 240 characters on one line.')
    if (not isinstance(body, str) or len(body) > 30000
            or any((ord(char) < 32 and char not in '\t\n\r') or 0xd800 <= ord(char) <= 0xdfff for char in body)):
        raise ValueError('Enter an email body of up to 30,000 characters.')
    parsed = parse_email_body(body)
    clean_html = ''.join(parsed.html)
    plain = ''.join(parsed.text).strip()
    if parsed.unsupported_link or ('href="{{ticket_link}}"' in clean_html and 'ticket_link' not in template['variables']):
        raise ValueError('Use a valid HTTPS link or the secure ticket link when available.')
    if Counter(_PLACEHOLDER.findall(plain)) - parsed.variables_in_text:
        raise ValueError('Apply formatting to the whole placeholder, including both pairs of braces.')
    unknown = (email_placeholders(subject) | set(parsed.variables_in_text)) - set(template['variables'])
    if unknown:
        raise ValueError('This template does not support one or more placeholders.')
    if complete and not (subject.strip() and plain):
        raise ValueError('Enter an email subject and body before publishing or sending a test.')
    return {'subject': subject.strip(), 'body': clean_html}


def render_email(template, wording, branding, values, details, *, logo_source=None, preview=False):
    """Use the same branded layout for delivery and the fictional live preview."""
    variables = {key: values.get(key, '') for key in template['variables']}
    subject = replace_email_variables(wording['subject'], variables)
    subject = ' '.join(subject.splitlines()).strip()
    if not subject and not preview:
        subject = replace_email_variables(template['subject'], variables)
    parsed = parse_email_body(wording['body'], variables, preview=preview)
    body_html = ''.join(parsed.html)
    body_text = re.sub(r'\n{3,}', '\n\n', ''.join(parsed.text)).strip()

    name, primary, accent = (branding[key] for key in ('name', 'primary', 'accent'))
    ink = '#ffffff' if sum((.299, .587, .114)[i] * int(primary[i*2+1:i*2+3], 16) for i in range(3)) < 135 else '#142435'
    footer = branding['footer']
    logo = branding.get('logo')
    if logo and logo_source:
        width, height = logo['width'], logo['height']
        scale = min(1, 180 / width, 72 / height)
        width, height = max(1, round(width * scale)), max(1, round(height * scale))
        heading = (f'<img src="{escape(logo_source, quote=True)}" width="{width}" height="{height}" '
                   f'alt="{escape(name)}" style="display:block;margin:0 auto;max-width:100%;height:auto">')
    else:
        heading = f'<div class="mail-brandname" style="font-size:18px;font-weight:800">{escape(name)}</div>'

    if details and details[0][0]:
        rows = []
        for label, value in details:
            text = escape(value).replace('\n', '<br>')
            rows.append(f'<div style="display:table-row"><dt style="display:table-cell;width:78px;'
                        f'padding:3px 6px 3px 0;color:#566d81">{escape(label)}</dt>'
                        f'<dd style="display:table-cell;margin:0;padding:3px 0;font-weight:650">{text}</dd></div>')
        locked = '<dl style="display:table;margin:5px 0 0">' + ''.join(rows) + '</dl>'
    else:
        text = escape(details[0][1]).replace('\n', '<br>') if details else ''
        locked = f'<div style="margin-top:6px">{text}</div>'
    locked_html = (
        '<div class="mail-mandatory" style="margin:0 22px 19px;padding:12px 14px;background:#f3f6f8;'
        f'border:1px solid #e2eaf0;border-radius:8px;font-size:10.6px">'
        f'<strong>Required Notification Details</strong>{locked}</div>'
    )
    safe_footer = escape(footer).replace('\n', '<br>')
    html = (
        '<div style="box-sizing:border-box;background:#fff;color:#294157;font:12px/1.65 Arial,sans-serif;'
        'overflow-wrap:anywhere">'
        f'<div class="mail-hero" style="text-align:center;padding:25px 15px 21px;color:{ink};background:{primary};border-bottom:4px solid {accent}">'
        f'<div style="background:{accent};height:4px;width:45px;border-radius:3px;margin:0 auto 14px"></div>'
        f'{heading}<div style="font-size:10px;margin-top:8px">Caffoot Lite notification</div></div>'
        f'<div class="mail-copy" style="padding:20px 22px 18px">{body_html}</div>{locked_html}'
        '<div style="border-top:1px solid #dbe5ef;background:#f7f9fc;text-align:center;padding:16px 19px;font-size:10px">'
        f'<strong>{escape(name)}</strong><br>{safe_footer}</div></div>'
    )
    required = '\n'.join(f'{label}: {value}' if label else value for label, value in details)
    plain = '\n\n'.join(part for part in (body_text, required, name, footer) if part)
    return {'subject': subject, 'html': html, 'text': plain}
