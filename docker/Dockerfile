ARG DIRECTUS_VERSION=latest

FROM node:22-alpine AS extensions
WORKDIR /extensions
RUN npm install directus-extension-sync

FROM --platform=${TARGETPLATFORM} directus/directus:${DIRECTUS_VERSION}
COPY --from=extensions /extensions/node_modules/directus-extension-sync ./extensions/directus-extension-sync
