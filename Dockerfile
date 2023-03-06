FROM node:18
EXPOSE 8282

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./

CMD ["npm", "run", "start"]