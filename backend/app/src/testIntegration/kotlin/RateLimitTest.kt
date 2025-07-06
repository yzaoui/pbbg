package com.bitwiserain.pbbg.app.testintegration

import com.bitwiserain.pbbg.app.RateLimitConfig
import com.bitwiserain.pbbg.app.SchemaHelper
import com.bitwiserain.pbbg.app.testintegration.response.RegisterResponse
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.decodeFromJsonElement
import kotlinx.serialization.json.jsonObject
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals

@TestInstance(TestInstance.Lifecycle.PER_METHOD)
class RateLimitTest {
    private val transaction = initDatabase()
    private val clock = MutableClock()
    private val json = Json { ignoreUnknownKeys = true }

    @AfterEach
    fun dropDatabase() {
        SchemaHelper.dropTables(transaction)
    }

    @Test
    fun `When making enough public requests, a TooManyRequests response should be returned`() = testApp(clock) {
        val loginRequest: (suspend (username: String) -> HttpResponse) = { username ->
            client.post("/api/login") {
                header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                setBody("""{"username":"$username","password":"password"}""")
            }
        }

        // Test login endpoint rate limiting (public endpoint)
        repeat(RateLimitConfig.PUBLIC_RATE_LIMIT) {
            loginRequest("user$it").run {
                // First requests up to the limit should not be rate limited
                // (they'll fail with 401 since users don't exist, but that's expected)
                assertNotEquals(HttpStatusCode.TooManyRequests, status)
            }
        }

        // Next request should be rate limited
        loginRequest("user").run {
            assertEquals(HttpStatusCode.TooManyRequests, status)
        }
    }

    @Test
    fun `When making enough authenticated requests, a TooManyRequests response should be returned`() = testApp(clock) {
        // First register a user
        val registerResponse = client.post("/api/register") {
            header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            setBody("""{"username":"testuser","password":"password"}""")
        }

        val authToken = json.decodeFromJsonElement<RegisterResponse>(json.parseToJsonElement(registerResponse.bodyAsText()).jsonObject["data"]!!).token

        // Test authenticated endpoint rate limiting
        repeat(RateLimitConfig.AUTHENTICATED_RATE_LIMIT) {
            client.get("/api/farm/plots") {
                header(HttpHeaders.Authorization, "Bearer $authToken")
            }.run {
                // First requests up to the limit should succeed
                assertEquals(HttpStatusCode.OK, status)
            }
        }

        // Next request should be rate limited
        client.get("/api/dex/items") {
            header(HttpHeaders.Authorization, "Bearer $authToken")
        }.apply {
            assertEquals(HttpStatusCode.TooManyRequests, status)
        }
    }
}
