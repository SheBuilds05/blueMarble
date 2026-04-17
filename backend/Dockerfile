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

OPENSHIFT SECURITY SETUP
RUN chown -R :0 /app && chmod -R g=u /app

# 7. Use the built-in 'node' user (standard practice for Node images)
# This prevents running as root, which OpenShift would block anyway.
USER node

# 8. Expose the port your Express app listens on
EXPOSE 5000

# 9. Start the application
# Use the compiled JS file in your dist folder
CMD ["node", "dist/index.js"]

