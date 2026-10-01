# estagio 1: constroi. node 24 porque o prerender roda com strip-types
FROM node:24-alpine AS construcao
WORKDIR /app

# copia so o manifesto primeiro: enquanto as dependencias nao mudam, o docker
# reaproveita esta camada e o install nao roda de novo
COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .
RUN npm run build && node scripts/nginx.mjs

# estagio 2: serve. o node inteiro fica pra tras, vai so o html pronto
FROM nginx:1.29-alpine
COPY --from=construcao /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=construcao /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q --spider http://localhost/ || exit 1
