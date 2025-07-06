package com.bitwiserain.pbbg.app

import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.plugins.origin
import io.ktor.server.plugins.ratelimit.RateLimit
import io.ktor.server.plugins.ratelimit.RateLimitName
import java.time.Clock
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes

/**
 * Configuration for rate limiting in the application.
 */
object RateLimitConfig {
    // Rate limiting for public endpoints (login, register, etc.)
    const val PUBLIC_RATE_LIMIT = 10
    val PUBLIC_RATE_LIMIT_NAME = RateLimitName("public")

    // Rate limiting for authenticated endpoints
    const val AUTHENTICATED_RATE_LIMIT = 100
    val AUTHENTICATED_RATE_LIMIT_NAME = RateLimitName("authenticated")

    // Rate limiting for sensitive operations
    const val SENSITIVE_OPERATION_RATE_LIMIT = 3
    val SENSITIVE_OPERATION_RATE_LIMIT_NAME = RateLimitName("sensitive")

    /**
     * Configures rate limiting for the application.
     */
    fun Application.configureRateLimiting(clock: Clock) {
        install(RateLimit) {
            register(PUBLIC_RATE_LIMIT_NAME) {
                rateLimiter(limit = PUBLIC_RATE_LIMIT, refillPeriod = 1.minutes, clock = clock::millis)
                requestKey { call -> call.request.origin.remoteHost }
            }

            register(AUTHENTICATED_RATE_LIMIT_NAME) {
                rateLimiter(limit = AUTHENTICATED_RATE_LIMIT, refillPeriod = 1.minutes, clock = clock::millis)
                requestKey { call -> call.user.id }
            }

            register(SENSITIVE_OPERATION_RATE_LIMIT_NAME) {
                rateLimiter(limit = SENSITIVE_OPERATION_RATE_LIMIT, refillPeriod = 1.hours, clock = clock::millis)
                requestKey { call -> call.request.origin.remoteHost }
            }
        }
    }
}
