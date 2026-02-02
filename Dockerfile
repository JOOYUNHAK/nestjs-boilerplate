# Base image
FROM node:22-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV development

# Expose the listening port of your app
EXPOSE 3000

# Start the app
CMD [ "npm", "run", "start:api:dev" ]
