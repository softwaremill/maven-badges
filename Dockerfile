ARG BASE_IMAGE=node:23-alpine

# Build stage
FROM $BASE_IMAGE AS builder

RUN apk update && \
  mkdir /app && \
  chown node:node /app

WORKDIR /app

USER node

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node src ./src

RUN npm run build

# Production stage
FROM $BASE_IMAGE AS runner

RUN apk add --no-cache tzdata
WORKDIR /app

# Set timezone
RUN cp /usr/share/zoneinfo/Europe/Warsaw /etc/localtime
ENV TZ="Europe/Warsaw"
RUN echo "$TZ" > /etc/timezone

# Copy built artifacts and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

CMD [ "npm", "start" ]
