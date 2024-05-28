# Use a multi-stage build for efficiency
FROM node:22-alpine AS builder

WORKDIR /tmp/

# Coping Web to tmp directory
COPY web/ . web/
COPY server/ . server/

# Install dependencies for frontend
WORKDIR /tmp/web
RUN npm install

# Build frontend
RUN npm run build


WORKDIR /usr/src/app
# Copy backend
COPY server/ .

# Install dependencies for backend
RUN npm install
# Build Backend
RUN npm run build
# Copy static frontent to public folder in backend
RUN mkdir -p ./dist/src/public
RUN cp -a /tmp/web/dist/. ./dist/src/public/
RUN ls -la ./dist/src/public



# Define ENV Variables
ENV ADDRESS=0.0.0.0
ENV PORT=8080
ENV NODE_ENV=production

# Start application \
CMD ["npm", "run", "start"]