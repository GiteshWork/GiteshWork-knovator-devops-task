# Stage 1: The Builder
# This stage installs all dependencies and is then discarded.
FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

COPY ./src ./src

# Stage 2: The Final Image
# This is the lightweight image that will be deployed.
FROM node:22-alpine
WORKDIR /app

# Copy the code and node_modules from the 'builder' stage
COPY --from=builder /app ./

# Expose the port the app runs on
EXPOSE 5000

# The command to run our app
CMD ["npm", "start"]