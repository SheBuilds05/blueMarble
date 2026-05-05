FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# OPENSHIFT SECURITY SETUP
RUN chown -R :0 /app && chmod -R g=u /app

USER node

EXPOSE 5000

CMD ["node", "dist/server.js"]
