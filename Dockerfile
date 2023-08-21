# Stage 1: Build the React app
FROM node:14 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the app using a smaller image
FROM node:14-alpine
WORKDIR /app
# Copy build artifacts from the previous stage
COPY --from=build /app /app
# Start the application using npm start
CMD ["npm", "start"]
