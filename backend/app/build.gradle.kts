import org.jetbrains.gradle.ext.packagePrefix
import org.jetbrains.gradle.ext.settings

plugins {
    application
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.kover)
    alias(libs.plugins.dokka)
    alias(libs.plugins.idea.ext)
    alias(libs.plugins.ktor)
    alias(libs.plugins.sqldelight)
}

application {
    mainClass.set("io.ktor.server.netty.EngineMain")
}

sourceSets {
    create("testIntegration") {
        compileClasspath += sourceSets.main.get().output
        runtimeClasspath += sourceSets.main.get().output
    }
}

val testIntegrationImplementation: Configuration by configurations.getting {
    extendsFrom(configurations.implementation.get())
}

val testIntegrationRuntimeOnly: Configuration by configurations.getting {
    extendsFrom(configurations.runtimeOnly.get())
}

configurations["testIntegrationImplementation"].extendsFrom(configurations.implementation.get())
configurations["testIntegrationRuntimeOnly"].extendsFrom(configurations.runtimeOnly.get())

dependencies {
    // Database
    implementation(libs.h2)
    implementation(libs.postgresql)

    // SQLDelight
    implementation(libs.sqldelight.runtime)
    implementation(libs.sqldelight.coroutines)
    implementation(libs.sqldelight.jdbc.driver)

    // Ktor
    implementation(libs.ktor.server.auth.jwt)
    implementation(libs.ktor.server.call.logging)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.server.cors)
    implementation(libs.ktor.server.netty)
    implementation(libs.ktor.server.rate.limit)
    implementation(libs.ktor.server.status.pages)
    implementation(libs.ktor.serialization.kotlinx.json)

    // Serialization
    implementation(libs.kotlinx.serialization.json)

    // Security
    implementation(libs.bcrypt)

    // Logging
    implementation(libs.logback.classic)

    // Test dependencies
    testImplementation(kotlin("test"))
    testImplementation(libs.kotest.assertions.core)
    testImplementation(libs.mockk)
    testImplementation(libs.junit.jupiter.api)
    testRuntimeOnly(libs.junit.jupiter.engine)

    // Integration test dependencies
    testIntegrationImplementation(kotlin("test"))
    testIntegrationImplementation(libs.ktor.server.test.host)
    testIntegrationImplementation(libs.kotest.assertions.core)
    testIntegrationImplementation(libs.junit.jupiter.api)
    testIntegrationRuntimeOnly(libs.junit.jupiter.engine)
    
    // Testcontainers for PostgreSQL testing
    testIntegrationImplementation(libs.testcontainers.core)
    testIntegrationImplementation(libs.testcontainers.postgresql)
    testIntegrationImplementation(libs.testcontainers.junit.jupiter)
}

val testIntegration = task<Test>("testIntegration") {
    description = "Runs integration tests."
    group = "verification"

    testClassesDirs = sourceSets["testIntegration"].output.classesDirs
    classpath = sourceSets["testIntegration"].runtimeClasspath
    shouldRunAfter("test")
}

tasks.check {
    dependsOn(testIntegration)
}

sqldelight {
    databases {
        create("Database") {
            packageName.set("com.bitwiserain.pbbg.app.db.generated")
            dialect("app.cash.sqldelight:postgresql-dialect:2.0.2")
        }
    }
}

idea.module {
    testSourceDirs.addAll(project.sourceSets["testIntegration"].allSource.srcDirs)
    settings {
        packagePrefix["src/main/kotlin"] = "com.bitwiserain.pbbg.app"
        packagePrefix["src/test/kotlin"] = "com.bitwiserain.pbbg.app.test"
        packagePrefix["src/testIntegration/kotlin"] = "com.bitwiserain.pbbg.app.testintegration"
    }
}
