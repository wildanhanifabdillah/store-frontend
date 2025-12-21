ARG NODE_VERSION=20-alpine

# Install dependencies
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build app
FROM deps AS builder
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Install production deps only
FROM node:${NODE_VERSION} AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Runtime image
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy production deps
COPY --from=prod-deps /app/node_modules ./node_modules
# Copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["npm", "run", "start"]
