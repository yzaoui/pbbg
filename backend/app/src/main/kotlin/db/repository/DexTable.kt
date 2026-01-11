package com.bitwiserain.pbbg.app.db.repository

import com.bitwiserain.pbbg.app.db.Transaction
import com.bitwiserain.pbbg.app.db.generated.Database
import com.bitwiserain.pbbg.app.domain.model.ItemEnum

interface DexTable {

    fun hasEntry(userId: Int, item: ItemEnum): Boolean

    fun getDiscovered(userId: Int): Set<ItemEnum>

    fun insertDiscovered(userId: Int, item: ItemEnum)

    fun insertDiscovered(userId: Int, items: Collection<ItemEnum>)
}

class DexTableImpl(private val database: Database, private val transaction: Transaction) : DexTable {

    override fun hasEntry(userId: Int, item: ItemEnum): Boolean = database.dexQueries
        .hasEntry(userId, item.id)
        .executeAsOne()

    override fun getDiscovered(userId: Int): Set<ItemEnum> = database.dexQueries
        .getDiscovered(userId)
        .executeAsList()
        .map { ItemEnum.fromId(it) }
        .toSet()

    override fun insertDiscovered(userId: Int, item: ItemEnum) {
        database.dexQueries.insertDiscovered(userId, item.id)
    }

    override fun insertDiscovered(userId: Int, items: Collection<ItemEnum>) = transaction {
        require(items.isNotEmpty())
        items.forEach { item ->
            database.dexQueries.insertDiscovered(userId, item.id)
        }
    }
}
