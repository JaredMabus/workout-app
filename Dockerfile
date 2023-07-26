FROM --platform=linux/amd64 node:16-alpine

# Create app directory
WORKDIR /app

# Copy all files to image
COPY . .

# Set frontend prod host
ENV REACT_APP_HOST="https://liftx.tech"

# Install ./ modules pm2 and typescript
RUN npm install

WORKDIR /app/server
RUN npm install --production=false
# RUN npm build

# Install ./client modules
WORKDIR /app/client
RUN npm install --production=false
RUN npm run test-client

# Build server and client to ./dist 
WORKDIR /app
RUN npm run build-prod

# Install ./dist server modules
RUN npm run install-build

# Remove ./server and ./client directories
RUN rm -rf ./client ./server

EXPOSE 8080 

# Start express server
CMD [ "npm", "start" ]