package com.bitwiserain.pbbg.app.testintegration

import com.bitwiserain.pbbg.app.mainWithDependencies
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.server.config.MapApplicationConfig
import io.ktor.server.testing.ApplicationTestBuilder
import io.ktor.server.testing.testApplication
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.put
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import java.time.Clock

@Testcontainers
object PostgreSQLTestContainer {
    @Container
    @JvmStatic
    val postgres: PostgreSQLContainer<*> = PostgreSQLContainer("postgres:15-alpine")
        .withDatabaseName("testdb")
        .withUsername("testuser")
        .withPassword("testpass")
        .withReuse(true) // Reuse container across test runs for faster execution
}

fun clearDatabase() {
    val container = PostgreSQLTestContainer.postgres

    // Ensure container is started
    if (!container.isRunning) {
        container.start()
    }

    // Create a connection to clear all data
    val connection = java.sql.DriverManager.getConnection(
        container.jdbcUrl,
        container.username,
        container.password
    )

    connection.use { conn ->
        val statement = conn.createStatement()

        // Disable foreign key checks temporarily
        statement.execute("SET session_replication_role = replica")

        // Get all table names and truncate them
        val tablesResult = statement.executeQuery("""
            SELECT tablename FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename NOT LIKE 'pg_%'
        """.trimIndent())

        val tableNames = mutableListOf<String>()
        while (tablesResult.next()) {
            tableNames.add(tablesResult.getString("tablename"))
        }
        tablesResult.close()

        // Truncate all tables
        for (tableName in tableNames) {
            try {
                statement.execute("TRUNCATE TABLE \"$tableName\" RESTART IDENTITY CASCADE")
            } catch (e: Exception) {
                // Ignore errors for tables that might not exist or have dependencies
                println("Warning: Could not truncate table $tableName: ${e.message}")
            }
        }

        // Re-enable foreign key checks
        statement.execute("SET session_replication_role = DEFAULT")

        statement.close()
    }
}

suspend fun ApplicationTestBuilder.registerUserAndGetToken(
    username: String = "username", password: String = "password"
) = client.post("/api/register") {
    header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
    setBody(
        buildJsonObject {
            put("username", username)
            put("password", password)
        }.toString()
    )
}.run {
    Json.parseToJsonElement(bodyAsText()).jsonObject.getValue("data").jsonObject.getValue("token").jsonPrimitive.content
}

fun testApp(clock: Clock, block: suspend ApplicationTestBuilder.() -> Unit) = testApplication {
    val container = PostgreSQLTestContainer.postgres

    // Ensure container is started before configuring the application
    if (!container.isRunning) {
        container.start()
    }

    environment {
        config = MapApplicationConfig().apply {
            put("ktor.environment", "prod")
            put("jdbc.address", "postgresql://${container.host}:${container.getMappedPort(5432)}/${container.databaseName}?user=${container.username}&password=${container.password}")
            put("jwt.issuer", "PBBG")
            put("jwt.realm", "PBBG API Server")
            put("jwt.secret", "eShVmYp3s6v9y\$B&E)H@McQfTjWnZr4t")
        }
    }
    application {
        mainWithDependencies(clock)
    }
    block()
}
