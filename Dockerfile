ARG BASE_IMAGE=node:23-alpine

# Build stage
FROM $BASE_IMAGE AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Production stage
FROM $BASE_IMAGE AS runner

RUN apk add --no-cache tzdata
WORKDIR /app
USER node

# Copy built artifacts and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

CMD [ "npm", "start" ]
