FROM node:16.13.1-alpine As development

WORKDIR /app

COPY package*.json ./

RUN npm install glob rimraf
RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:16.13.1-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /app/build ./build

CMD ["npm", "run", "start:prod"]
