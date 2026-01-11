package com.bitwiserain.pbbg.app.db.repository.market

import com.bitwiserain.pbbg.app.db.Transaction
import com.bitwiserain.pbbg.app.db.generated.Database
import com.bitwiserain.pbbg.app.db.repository.toMaterializedItem
import com.bitwiserain.pbbg.app.domain.model.ItemEnum
import com.bitwiserain.pbbg.app.domain.model.MaterializedItem

interface MarketInventoryTable {

    fun getItems(userId: Int): Map<Long, MaterializedItem>

    fun insertItems(userId: Int, itemIds: Iterable<Long>)

    fun insertItem(marketId: Int, itemId: Long)

    fun removeItems(itemIds: Set<Long>)
}

class MarketInventoryTableImpl(
    private val database: Database,
    private val transaction: Transaction,
) : MarketInventoryTable {

    override fun getItems(userId: Int): Map<Long, MaterializedItem> =
        database.marketInventoryQueries.getItems(userId)
            .executeAsList()
            .associate { row ->
                row.id to toMaterializedItem(ItemEnum.fromId(row.item_enum_id), row.quantity)
            }

    override fun insertItems(userId: Int, itemIds: Iterable<Long>) = transaction {
        // First get the market_id for this user
        val marketId = database.marketQueries.getMarketIdByUserId(userId).executeAsOneOrNull()
            ?: throw IllegalStateException("No market found for user $userId")

        // Insert each item
        itemIds.forEach { itemId ->
            database.marketInventoryQueries.insertItem(marketId, itemId)
        }
    }

    override fun insertItem(marketId: Int, itemId: Long) {
        database.marketInventoryQueries.insertItem(marketId, itemId)
    }

    override fun removeItems(itemIds: Set<Long>) {
        require(itemIds.isNotEmpty())
        database.marketInventoryQueries.removeItems(itemIds)
    }
}
