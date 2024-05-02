FROM node:21-slim

# For server
EXPOSE 3000

# For hot reloading
EXPOSE 35729

# Set working directory
WORKDIR /app

# Copy host files to working directory
COPY . .

# Install node dependencies
ENV npm_config_cache=/tmp/npm_cache
RUN --mount=type=cache,target=$npm_config_cache \
    npm ci

# Start the React app
CMD ["npm", "start"]