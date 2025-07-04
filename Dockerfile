# Install dependencies and build
FROM node:18-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set environment variables
ENV NODE_OPTIONS=--max-old-space-size=2048

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Build Next.js in standalone mode
RUN pnpm build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Copy standalone output
COPY --from=builder /app/.next/standalone ./

# Copy static assets
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy package.json for runtime
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
