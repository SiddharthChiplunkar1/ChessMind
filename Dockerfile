# Stage 1: Build the React Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
# Copy package.json and install dependencies
COPY chess-frontend/package*.json ./
RUN npm install
# Copy the rest of the frontend source and build
COPY chess-frontend/ ./
RUN npm run build

# Stage 2: Build the Spring Boot Backend
FROM maven:3.9.6-eclipse-temurin-21-alpine AS backend-build
WORKDIR /app/backend
# Copy POM and download dependencies
COPY chessengine/pom.xml .
RUN mvn dependency:go-offline
# Copy the backend source
COPY chessengine/src ./src
# Copy the built frontend into the backend's static directory so Spring Boot serves it
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static
# Build the final JAR
RUN mvn clean package -DskipTests

# Stage 3: Run the Application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copy the JAR from the backend build stage
COPY --from=backend-build /app/backend/target/*.jar app.jar
# Expose the port Spring Boot runs on
EXPOSE 8080
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
