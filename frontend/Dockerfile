# Stage 1: The Builder
# This stage builds our static assets.
FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# The build command creates a 'build' folder with our compiled app
RUN npm run build

# Stage 2: The Final Image
# This stage serves the static files using Nginx.
FROM nginx:stable-alpine

# Copy the built assets from the 'builder' stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose the port Nginx runs on
EXPOSE 80





# Nginx will automatically start when the container launches.