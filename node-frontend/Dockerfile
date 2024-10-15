# Uuse node js image and Linux Alpine as the operating system for the container
FROM node:22-alpine

# Install procps to enable the 'ps' command
RUN apk add --no-cache procps

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code to working directory
COPY . .

# Expose the desired port
EXPOSE 8199

# Run the app
CMD ["node", "index.js"]
