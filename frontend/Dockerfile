# ---------- Build Stage ----------
FROM node:24-slim AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the Vite app
RUN npm run build

# ---------- Production Stage ----------
FROM nginx:alpine

# Clean default static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Custom nginx config for SPA routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx's default port
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
