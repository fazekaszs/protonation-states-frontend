FROM node:18
EXPOSE 8282
ENV PORT=8282
ENV BACKEND_PORT=8181

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./

CMD ["npm", "run", "start"]