FROM node:24-alpine AS base
WORKDIR /app

# ---- dev : ng serve sur 4200, /api relaye vers l'API (proxy.conf.json) ----
FROM base AS dev
EXPOSE 4200
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000", "--proxy-config", "proxy.conf.json"]

# ---- build : ng build ----
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- prod : nginx 1.27 sert les fichiers et relaie /api ----
FROM nginx:1.27-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
# dist/<nom-du-projet>/browser : a adapter si plusieurs dossiers
COPY --from=build /app/dist/*/browser /usr/share/nginx/html
EXPOSE 80
