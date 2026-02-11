FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Verify build output exists
RUN echo "=== Checking build output ===" && \
    ls -la dist/ && \
    test -f dist/src/main.js && echo "✓ dist/src/main.js exists" || (echo "✗ dist/src/main.js NOT FOUND" && exit 1)

# Expose port
EXPOSE 3000

# Start the application
CMD sh -c "npx prisma migrate deploy || true && npm run start:prod"
