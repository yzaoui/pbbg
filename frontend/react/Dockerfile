# Stage 1: Build the Vite app
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code and build the app
COPY . .
RUN bun run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine AS prod

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default nginx config (optional but recommended)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
