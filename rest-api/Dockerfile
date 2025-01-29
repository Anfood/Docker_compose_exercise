# Use node js image and Linux Alpine as the operating system for the container
FROM node:alpine

# Set the working directory
RUN mkdir /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory in the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code from the host to container
COPY . .

# Expose API port
EXPOSE 8197

# Run the API server
CMD ["npm", "start"]