FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN chown -R 1001:0 /app && chmod -R g+rwX /app
EXPOSE 3000

CMD ["npm", "start"]
