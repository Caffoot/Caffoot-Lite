FROM node:22-alpine AS workspace-builder

# Build the approved v2.1 Svelte workspace into static assets. Node is not
# present in the final application image, and the fictional pilot is excluded.
WORKDIR /build
COPY pilots/svelte-device-details/ ./pilots/svelte-device-details/
COPY assets/caffoot-logo-256.png assets/caffoot-icon-1024.png ./assets/
WORKDIR /build/pilots/svelte-device-details
RUN npm install --no-audit --no-fund && npm run build:workspace && npm run build:signin

FROM python:3.12-alpine

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    CAFFOOT_DB_PATH=/data/caffoot.sqlite3 \
    CAFFOOT_PORT=8080

RUN apk add --no-cache openssl

WORKDIR /opt/caffoot
COPY backend/ ./backend/
COPY setup.html ./setup.html
# Published inventory interface and its existing branding assets.
COPY inventory.html ./inventory.html
# Off-by-default workspace; ordinary /inventory remains fully functional.
COPY --from=workspace-builder /build/workspace-dist/ ./workspace-dist/
# The public Sign In page can load before an account exists.
COPY --from=workspace-builder /build/signin-dist/ ./signin-dist/
# SIL Open Font License accompanies the bundled Inter font in the runtime image.
COPY --from=workspace-builder /build/pilots/svelte-device-details/node_modules/@fontsource-variable/inter/LICENSE ./workspace-dist/OFL-Inter.txt
COPY assets/favicon.ico assets/apple-touch-icon.png assets/caffoot-icon-1024.png assets/qrcode.min.js assets/tailwind.css ./assets/
RUN mkdir -p /data && chown -R 10001:10001 /data /opt/caffoot
USER 10001:10001
EXPOSE 8080
CMD ["python", "-m", "backend.server"]
