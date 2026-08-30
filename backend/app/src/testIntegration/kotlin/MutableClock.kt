package com.bitwiserain.pbbg.app.testintegration

import kotlin.time.Clock
import kotlin.time.Duration
import kotlin.time.Instant

class MutableClock(private var instant: Instant = Instant.fromEpochSeconds(946_684_800L)) : Clock {

    override fun now(): Instant = instant

    operator fun plusAssign(duration: Duration) {
        instant += duration
    }
}
