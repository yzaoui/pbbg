package com.bitwiserain.pbbg.app.db.repository

import com.bitwiserain.pbbg.app.db.generated.Database
import com.bitwiserain.pbbg.app.domain.model.itemdetails.ItemHistory
import kotlinx.serialization.json.Json
import kotlin.time.Instant

interface ItemHistoryTable {

    fun insertItemHistory(itemId: Long, itemHistory: ItemHistory)

    fun getItemHistoryList(itemId: Long): List<ItemHistory>
}

class ItemHistoryTableImpl(private val database: Database) : ItemHistoryTable {

    override fun insertItemHistory(itemId: Long, itemHistory: ItemHistory) {
        database.itemHistoryQueries.insertItemHistory(
            itemId,
            Json.encodeToString(itemHistory.info),
            itemHistory.date.toEpochMilliseconds(),
        )
    }

    override fun getItemHistoryList(itemId: Long): List<ItemHistory> =
        database.itemHistoryQueries.getItemHistory(itemId)
            .executeAsList()
            .map {
                ItemHistory(
                    date = Instant.fromEpochMilliseconds(it.time_epoch_millis),
                    info = Json.decodeFromString(it.item_history_type),
                )
            }
}
