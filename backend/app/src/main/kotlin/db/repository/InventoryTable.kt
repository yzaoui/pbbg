package com.bitwiserain.pbbg.app.db.repository

import com.bitwiserain.pbbg.app.db.GetInventoryItem
import com.bitwiserain.pbbg.app.db.GetInventoryItems
import com.bitwiserain.pbbg.app.db.Transaction
import com.bitwiserain.pbbg.app.db.generated.Database
import com.bitwiserain.pbbg.app.domain.model.BaseItem
import com.bitwiserain.pbbg.app.domain.model.InventoryItem
import com.bitwiserain.pbbg.app.domain.model.ItemEnum
import com.bitwiserain.pbbg.app.domain.model.MaterializedItem

interface InventoryTable {

    fun insertItem(userId: Int, itemId: Long, baseItem: BaseItem)

    fun insertItems(userId: Int, itemEntries: Map<Long, BaseItem>)

    fun removeItem(userId: Int, itemId: Long)

    fun removeItems(userId: Int, itemIds: Collection<Long>)

    fun getHeldItemsOfBaseKind(userId: Int, itemEnum: ItemEnum): Map<Long, MaterializedItem>

    fun getInventoryItem(userId: Int, itemId: Long): InventoryItem?

    fun getInventoryItems(userId: Int): Map<Long, InventoryItem>

    fun setItemEquipped(userId: Int, itemId: Long, equipped: Boolean)
}

class InventoryTableImpl(
    private val database: Database,
    private val transaction: Transaction,
) : InventoryTable {

    override fun insertItem(userId: Int, itemId: Long, baseItem: BaseItem) {
        val equipped = if (baseItem is BaseItem.Equippable) false else null
        database.inventoryQueries.insertItem(userId, itemId, equipped)
    }

    override fun insertItems(userId: Int, itemEntries: Map<Long, BaseItem>) = transaction {
        itemEntries.forEach { (itemId, baseItem) ->
            val equipped = if (baseItem is BaseItem.Equippable) false else null
            database.inventoryQueries.insertItem(userId, itemId, equipped)
        }
    }

    override fun removeItem(userId: Int, itemId: Long) {
        database.inventoryQueries.removeItem(userId, itemId)
    }

    override fun removeItems(userId: Int, itemIds: Collection<Long>) {
        require(itemIds.isNotEmpty())
        database.inventoryQueries.removeItems(userId, itemIds)
    }

    override fun getHeldItemsOfBaseKind(userId: Int, itemEnum: ItemEnum): Map<Long, MaterializedItem> =
        database.inventoryQueries.getHeldItemsOfBaseKind(userId, itemEnum.id)
            .executeAsList()
            .associate { row ->
                row.id to toMaterializedItem(ItemEnum.fromId(row.item_enum_id), row.quantity)
            }

    override fun getInventoryItem(userId: Int, itemId: Long): InventoryItem? =
        database.inventoryQueries.getInventoryItem(userId, itemId)
            .executeAsOneOrNull()
            ?.toInventoryItem()

    override fun getInventoryItems(userId: Int): Map<Long, InventoryItem> =
        database.inventoryQueries.getInventoryItems(userId)
            .executeAsList()
            .associate { it.id to it.toInventoryItem() }

    override fun setItemEquipped(userId: Int, itemId: Long, equipped: Boolean) {
        database.inventoryQueries.setItemEquipped(equipped, userId, itemId)
    }

    private fun GetInventoryItems.toInventoryItem(): InventoryItem {
        val materializedItem = toMaterializedItem(ItemEnum.fromId(item_enum_id), quantity)
        return if (materializedItem.base is BaseItem.Equippable) {
            InventoryItem.EquippableInventoryItem(materializedItem, equipped ?: false)
        } else {
            InventoryItem(materializedItem)
        }
    }

    private fun GetInventoryItem.toInventoryItem(): InventoryItem {
        val materializedItem = toMaterializedItem(ItemEnum.fromId(item_enum_id), quantity)
        return if (materializedItem.base is BaseItem.Equippable) {
            InventoryItem.EquippableInventoryItem(materializedItem, equipped ?: false)
        } else {
            InventoryItem(materializedItem)
        }
    }
}
