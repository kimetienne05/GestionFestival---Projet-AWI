FROM node:24-alpine AS base
WORKDIR /app
EXPOSE 3000
ENV PORT=3000
# Test de sante utilise aussi par le deploiement
HEALTHCHECK --interval=10s --timeout=3s --retries=5 --start-period=15s \
  CMD wget -qO- http://localhost:3000/api/v1/sante || exit 1

# ---- dev : code monte en volume par le compose ----
FROM base AS dev
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]

# ---- build : compilation TypeScript ----
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- prod : dependances de production + code compile ----
FROM base AS prod
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
# volume "regles" (PDF des regles de jeux)
RUN mkdir -p /app/regles && chown -R node:node /app
USER node
CMD ["node", "dist/index.js"]
