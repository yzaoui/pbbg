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

    // Exposed
    implementation(libs.exposed.core)
    implementation(libs.exposed.jdbc)

    // Ktor
    implementation(libs.ktor.server.auth.jwt)
    implementation(libs.ktor.server.call.logging)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.server.cors)
    implementation(libs.ktor.server.netty)
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

idea.module {
    testSourceDirs.addAll(project.sourceSets["testIntegration"].allSource.srcDirs)
    settings {
        packagePrefix["src/main/kotlin"] = "com.bitwiserain.pbbg.app"
        packagePrefix["src/test/kotlin"] = "com.bitwiserain.pbbg.app.test"
        packagePrefix["src/testIntegration/kotlin"] = "com.bitwiserain.pbbg.app.testintegration"
    }
}
