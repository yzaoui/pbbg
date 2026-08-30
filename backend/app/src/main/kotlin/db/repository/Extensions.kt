package com.bitwiserain.pbbg.app.db.repository

import com.bitwiserain.pbbg.app.db.Unit
import com.bitwiserain.pbbg.app.domain.model.ItemEnum
import com.bitwiserain.pbbg.app.domain.model.MaterializedItem
import com.bitwiserain.pbbg.app.domain.model.MyUnit
import com.bitwiserain.pbbg.app.domain.model.MyUnitEnum

fun Unit.toDomainModel(): MyUnit = MyUnit(
    id = id,
    enum = MyUnitEnum.fromId(unit_enum_id),
    hp = hp,
    maxHP = max_hp,
    atk = atk,
    def = def,
    int = int,
    res = res,
    exp = exp
)

fun toMaterializedItem(itemEnum: ItemEnum, quantity: Int?): MaterializedItem {
    return when (itemEnum) {
        ItemEnum.STONE -> MaterializedItem.Stone(quantity!!)
        ItemEnum.COAL -> MaterializedItem.Coal(quantity!!)
        ItemEnum.COPPER_ORE -> MaterializedItem.CopperOre(quantity!!)
        ItemEnum.ICE_PICK -> MaterializedItem.IcePick
        ItemEnum.PLUS_PICKAXE -> MaterializedItem.PlusPickaxe
        ItemEnum.CROSS_PICKAXE -> MaterializedItem.CrossPickaxe
        ItemEnum.SQUARE_PICKAXE -> MaterializedItem.SquarePickaxe
        ItemEnum.APPLE_SAPLING -> MaterializedItem.AppleSapling(quantity!!)
        ItemEnum.TOMATO_SEED -> MaterializedItem.TomatoSeed(quantity!!)
        ItemEnum.APPLE -> MaterializedItem.Apple(quantity!!)
        ItemEnum.TOMATO -> MaterializedItem.Tomato(quantity!!)
    }
}
