# ----------------------------------------------------
# Stage 1: Build the Vite Frontend
# ----------------------------------------------------
FROM node:20 AS frontend-build
WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Copy all frontend files to build
COPY frontend/ ./

# Pass the TomTom API key and other args as environment variables during build
ARG VITE_TOMTOM_API_KEY
ENV VITE_TOMTOM_API_KEY=$VITE_TOMTOM_API_KEY

RUN npm run build

# ----------------------------------------------------
# Stage 2: Build the Spring Boot Backend
# ----------------------------------------------------
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app

# Cache dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Include the source code
COPY src/ ./src/

# Copy the built React app explicitly into Spring Boot's static folder
COPY --from=frontend-build /app/frontend/dist /app/src/main/resources/static/

# Build the final JAR
RUN mvn clean package -DskipTests

# ----------------------------------------------------
# Stage 3: Run the Full-Stack Application
# ----------------------------------------------------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the JAR from the backend-build stage
COPY --from=backend-build /app/target/analytics-0.0.1-SNAPSHOT.jar app.jar

# Render requires applications to listen on a default port, often 10000, 
# or standard 8080 depending on WEB_PORT. Expose 8080.
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]