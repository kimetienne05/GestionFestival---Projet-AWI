# Base de donnees : PostgreSQL 18
FROM postgres:18-alpine

# Valeurs par defaut ; le mot de passe vient du .env via le compose
ENV POSTGRES_USER=festival \
    POSTGRES_DB=festival \
    TZ=Europe/Paris

# Initialisation locale ; les migrations applicatives sont gerees par l'API
COPY init.sql /docker-entrypoint-initdb.d/init.sql

EXPOSE 5432

HEALTHCHECK --interval=10s --timeout=5s --retries=5 --start-period=10s \
  CMD pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" || exit 1
