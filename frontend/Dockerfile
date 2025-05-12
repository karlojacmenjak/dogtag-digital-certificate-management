# Use official Node.js base image
FROM node:24

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app source
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Default command (development)
CMD ["npm", "run", "dev"]
