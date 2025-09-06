package com.bitwiserain.pbbg.app.db.repository

import com.bitwiserain.pbbg.app.db.generated.Database
import com.bitwiserain.pbbg.app.domain.model.ItemEnum
import com.bitwiserain.pbbg.app.domain.model.MaterializedItem

interface MaterializedItemTable {

    fun getItem(itemId: Long): MaterializedItem?

    fun insertItemAndGetId(itemToStore: MaterializedItem): Long

    fun updateQuantity(itemId: Long, quantityDelta: Int)
}

class MaterializedItemTableImpl(private val database: Database) : MaterializedItemTable {

    override fun getItem(itemId: Long): MaterializedItem? =
        database.materializedItemQueries.getItem(itemId)
            .executeAsOneOrNull()
            ?.let { row ->
                toMaterializedItem(ItemEnum.fromId(row.item_enum_id), row.quantity)
            }

    override fun insertItemAndGetId(itemToStore: MaterializedItem): Long {
        val quantity = if (itemToStore is MaterializedItem.Stackable) itemToStore.quantity else null
        return database.materializedItemQueries.insertItemAndGetId(
            itemToStore.enum.id,
            quantity
        ).executeAsOne()
    }

    override fun updateQuantity(itemId: Long, quantityDelta: Int) {
        database.materializedItemQueries.updateQuantity(quantityDelta, itemId)
    }
}
