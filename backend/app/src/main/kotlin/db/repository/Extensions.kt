package com.bitwiserain.pbbg.app.db.repository

import com.bitwiserain.pbbg.app.db.Unit
import com.bitwiserain.pbbg.app.domain.model.ItemEnum
import com.bitwiserain.pbbg.app.domain.model.MaterializedItem
import com.bitwiserain.pbbg.app.domain.model.MyUnit
import com.bitwiserain.pbbg.app.domain.model.MyUnitEnum

fun Unit.toDomainModel(): MyUnit {
    return when (MyUnitEnum.fromId(unit_enum_id)) {
        MyUnitEnum.ICE_CREAM_WIZARD -> MyUnit.IceCreamWizard(id, hp, max_hp, atk, def, int, res, exp)
        MyUnitEnum.TWOLIP -> MyUnit.Twolip(id, hp, max_hp, atk, def, int, res, exp)
        MyUnitEnum.CARPSHOOTER -> MyUnit.Carpshooter(id, hp, max_hp, atk, def, int, res, exp)
        MyUnitEnum.FLAMANGO -> MyUnit.Flamango(id, hp, max_hp, atk, def, int, res, exp)
    }
}

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
