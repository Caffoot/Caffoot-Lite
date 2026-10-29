FROM python:3.12-alpine

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    CAFFOOT_DB_PATH=/data/caffoot.sqlite3 \
    CAFFOOT_PORT=8080

RUN apk add --no-cache openssl

WORKDIR /opt/caffoot
COPY backend/ ./backend/
COPY setup.html ./setup.html
RUN mkdir -p /data && chown -R 10001:10001 /data /opt/caffoot
USER 10001:10001
EXPOSE 8080
CMD ["python", "-m", "backend.server"]
