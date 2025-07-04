FROM gradle:8.7-jdk21 AS base
WORKDIR /app
COPY . .

FROM base AS build
WORKDIR /app
RUN gradle app:buildFatJar --no-daemon

FROM eclipse-temurin:21-jre AS prod
WORKDIR /app
COPY --from=build /app/app/build/libs/*-all.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
