FROM node:16.15.0
EXPOSE 8800
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build
CMD ["npm", "start"]
