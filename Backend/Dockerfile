### Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Download dependencies first
COPY pom.xml .
RUN mvn -q -B -DskipTests dependency:go-offline

# Copy source and build
COPY src ./src
RUN mvn -q -B -DskipTests clean package

### Run

FROM eclipse-temurin:21-jre
WORKDIR /app

# Render provides PORT; we pass it to Spring via -Dserver.port
ENV PORT=8080
EXPOSE 8080

# Copy the jar built in the build stage
COPY --from=build /app/target/*.jar app.jar

# Using the PORT Render gives us
CMD ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
