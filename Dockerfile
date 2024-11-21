# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install Python 3 and other dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

# Install global npm packages
RUN npm install -g truffle ganache-cli

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Compile the contracts
RUN npx truffle compile

# Expose port 8545 for Ganache
EXPOSE 8545

# Start Ganache, run Truffle migrations, and then run the benchmark
CMD npm run full-benchmark