# Use an official Node.js runtime as the base image
FROM node:18 as builder

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Start a new stage from the base image
FROM node:18

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built assets from the builder stage
COPY --from=builder /app/dist ./dist
# Adjust this path if your build outputs to a different directory

# Expose the port the app runs on
EXPOSE 9000

# Set the environment variable for the Medusa backend URL
# Replace the URL with your actual backend URL if different
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://backend-production-0ac3.up.railway.app/

# Start the application
CMD ["npm", "start"]
