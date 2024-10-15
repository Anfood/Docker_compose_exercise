# Use recent python image, with lightweight Alpine Linux as the operating system for container
FROM python:3.13-alpine

# Set the working directory inside the container
WORKDIR /app

# Install procps for 'ps' command
RUN apk add --no-cache bash procps

# Copy the current project content to the container working directory
COPY . /app

# Expose port 5000 for the python backend
EXPOSE 5000

# Start the Python backend
CMD ["python", "app.py"]
