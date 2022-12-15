### STAGE 1: Build ###
FROM node:16-alpine AS build
WORKDIR /app
COPY ./.npmrc .
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:stable-alpine
COPY --from=build /app/dist/client /usr/share/nginx/html
COPY docker/production/files/nginx.conf /etc/nginx/nginx.conf
COPY docker/production/files/entrypoint.sh /usr/local/src/entrypoint.sh
CMD ["/usr/local/src/entrypoint.sh"]
EXPOSE 80