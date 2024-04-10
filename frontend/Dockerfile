# Use build argument to determine the environment (dev or prod)
ARG ENV=prod

# Stage 1: Base stage for both development and production
FROM node:16-alpine as base

# Set the working directory in the Docker container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your project files into the Docker container
COPY . .

# Stage 2: Development environment setup
FROM base as development

# Expose port 5000 for the development server
EXPOSE 5000

# Set the command to start the dev server
CMD ["npm", "run", "dev"]

# Stage 3: Build stage for production environment
FROM base as production-build

# Build the application using Vite
RUN npm run build

# Stage 4: Production environment setup using Nginx
FROM nginx:1.21-alpine as production

# Copy built files from the production-build stage to the Nginx serve directory
COPY --from=production-build /app/dist /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Set Nginx to run in the foreground
CMD ["nginx", "-g", "daemon off;"]
