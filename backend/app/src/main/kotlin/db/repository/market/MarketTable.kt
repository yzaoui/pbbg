package com.bitwiserain.pbbg.app.db.repository.market

import com.bitwiserain.pbbg.app.db.generated.Database

interface MarketTable {

    fun createMarketAndGetId(userId: Int): Int
}

class MarketTableImpl(private val database: Database) : MarketTable {

    override fun createMarketAndGetId(userId: Int): Int =
        database.marketQueries.createMarketAndGetId(userId)
            .executeAsOne()
}
