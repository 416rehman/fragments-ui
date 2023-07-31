FROM node:18-alpine as build

WORKDIR /app

# Copy the package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Install the dependencies
RUN npm ci --silent

# Copy the source code
COPY . ./

# Build the app
RUN npm run build

# Serve the app
FROM nginx:stable-alpine

# Copy the build files to the nginx directory to serve
COPY --from=build /app/build /usr/share/nginx/html

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Copy the .env file and .env.sh script to the serve directory
COPY ./.env.sh /usr/share/nginx/html/
COPY ./.env /usr/share/nginx/html/

# Add bash so we can run the .env.sh script
RUN apk add --no-cache bash

# Make the .env.sh script executable
RUN chmod +x /usr/share/nginx/html/.env.sh

# Execute the .env.sh script and start nginx
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/.env.sh && nginx -g \"daemon off;\""]