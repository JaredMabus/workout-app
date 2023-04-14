FROM node:16-alpine

# Create app directory
WORKDIR /app

# Copy all files to image
COPY . .

# Install ./ modules pm2 and typescript
RUN npm install

# Install ./server modules
WORKDIR /app/server
RUN npm install

# Install ./client modules
WORKDIR /app/client
RUN npm install --legacy-peer-deps

WORKDIR /app

# Build/compile to ./server and ./client to ./dist 
RUN npm run build

# Install ./dist server modules
RUN npm run install-prod

# Remove ./server and ./client directories
RUN rm -rf ./client ./server

EXPOSE 80

CMD [ "npm", "start" ]