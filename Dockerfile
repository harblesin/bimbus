FROM node:latest as build-stage
# WORKDIR /src
COPY package*.json ./
RUN npm install
CMD ["npm", "run", "build"]
# RUN npm install -g nodemon
COPY . .
COPY .env .
EXPOSE 8080
# RUN npm run build
# CMD ["concurrently", "npm", "start", "nodemon", "node_server/server.js"]
# RUN ["npm", "run", "launch"]
CMD ["node", "node_server/server.js"]
# RUN npm run launch