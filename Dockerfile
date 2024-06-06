# Stage 1: Build TypeScript code
FROM node:latest AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Stage 2: Create production image
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy built files from the previous stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

# Expose port (if needed)
EXPOSE 3000

# Command to run the application
CMD ["node", "build/index.js"]
