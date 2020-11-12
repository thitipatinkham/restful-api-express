
#กำหนด image เป็น Linux ที่ทำงานอยู่บน Version Apline
FROM node:lts-alpine as node
# Create app directory
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Install app dependencies
COPY package.json /usr/app/
RUN npm install

# Bundle app source
COPY . /usr/app

EXPOSE 3100
CMD [ "npm", "start" ]