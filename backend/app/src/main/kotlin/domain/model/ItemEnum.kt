package com.bitwiserain.pbbg.app.domain.model

enum class ItemEnum(val id: Int, val baseItem: BaseItem) {
    STONE(1, BaseItem.Material.Stone),
    COAL(2, BaseItem.Material.Coal),
    COPPER_ORE(3, BaseItem.Material.CopperOre),
    ICE_PICK(4, BaseItem.Pickaxe.IcePick),
    PLUS_PICKAXE(5, BaseItem.Pickaxe.PlusPickaxe),
    CROSS_PICKAXE(6, BaseItem.Pickaxe.CrossPickaxe),
    SQUARE_PICKAXE(7, BaseItem.Pickaxe.SquarePickaxe),
    APPLE_SAPLING(8, BaseItem.Sapling.AppleSapling),
    TOMATO_SEED(9, BaseItem.Seed.TomatoSeed),
    APPLE(10, BaseItem.Apple),
    TOMATO(11, BaseItem.Tomato),
    ;

    companion object {
        private val idMap = ItemEnum.entries.associateBy { it.id }

        fun fromId(id: Int): ItemEnum = idMap[id]
            ?: throw IllegalArgumentException("Unknown ItemEnum id: $id")
    }
}
