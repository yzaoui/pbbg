FROM gradle:8.6-jdk17 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle app:buildFatJar --no-daemon

FROM openjdk:19
EXPOSE 8080:80
RUN mkdir /app
COPY --from=build /home/gradle/src/app/build/libs/app-all.jar /app/app-all.jar
ENTRYPOINT ["java","-jar","/app/app-all.jar"]
