# Use Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Run app
CMD ["node", "dist/index.js"]

