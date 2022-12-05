FROM node:18-alpine as base

# Create app directory
WORKDIR /src/app

# Install app dependencies.  Copy these in sooner to take advantage
# of docker layers.
COPY package*.json ./

RUN npm install
# If building for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Make port accessible outside container.
EXPOSE 8080

# Run once container is ready.
CMD [ "npm", "run", "start" ]
