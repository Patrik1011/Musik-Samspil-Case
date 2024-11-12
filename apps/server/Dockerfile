# Use the official Node.js image as a base
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy the API directory
COPY . .

# Install dependencies using pnpm
RUN npm install -g pnpm
RUN pnpm install

# Expose the port the API runs on
EXPOSE 3000

# Start the API application
CMD ["pnpm", "dev"]