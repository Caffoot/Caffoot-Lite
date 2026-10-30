FROM python:3.12-alpine

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    CAFFOOT_DB_PATH=/data/caffoot.sqlite3 \
    CAFFOOT_PORT=8080

RUN apk add --no-cache openssl

WORKDIR /opt/caffoot
COPY next/backend/ ./backend/
COPY next/setup.html ./setup.html
# Published inventory interface and its existing branding assets.
COPY next/inventory.html ./inventory.html
COPY assets/favicon.ico assets/apple-touch-icon.png assets/caffoot-icon-1024.png assets/qrcode.min.js ./assets/
RUN mkdir -p /data && chown -R 10001:10001 /data /opt/caffoot
USER 10001:10001
EXPOSE 8080
CMD ["python", "-m", "backend.server"]
