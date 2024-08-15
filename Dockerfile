# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.10.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Next.js/SQLite"

# Next.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
  apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3 && \
  rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install Yarn
ARG YARN_VERSION=1.22.22
RUN corepack enable && corepack prepare "yarn@$YARN_VERSION" --activate

# Copy package files first and install dependencies
COPY --link package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy application code
COPY --link . .

# Build application and create standalone build
RUN yarn build

# Remove development dependencies
RUN yarn install --production --frozen-lockfile

# Final stage for app image
FROM base

# Install runtime dependencies
RUN apt-get update -qq && \
  apt-get install --no-install-recommends -y openssl && \
  rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy standalone build files
COPY --from=build /app/.next/standalone /app
COPY --from=build /app/.next/static /app/.next/static
COPY --from=build /app/drizzle /app/drizzle

# Copy required files for deployment
# COPY --from=build /app/public /app/public # not needed until public folder is created
COPY --from=build /app/package.json /app/yarn.lock /app/

# Expose the application port and set the default command
EXPOSE 3000
CMD ["node", "server.js"]