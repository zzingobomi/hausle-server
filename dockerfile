FROM node:16

WORKDIR /hausle-server
COPY . .
RUN npm install
RUN npm run build

WORKDIR /hausle-server/lib

EXPOSE 17100
CMD ["node", "index.js"]