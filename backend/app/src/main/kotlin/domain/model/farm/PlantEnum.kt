package com.bitwiserain.pbbg.app.domain.model.farm

enum class PlantEnum(val id: Int, val basePlant: BasePlant) {
    APPLE_TREE(1, BasePlant.AppleTree),
    TOMATO_PLANT(2, BasePlant.TomatoPlant),
    ;

    companion object {
        private val idMap = entries.associateBy { it.id }

        fun fromId(id: Int): PlantEnum = idMap[id]
            ?: throw IllegalArgumentException("Unknown PlantEnum id: $id")
    }
}
