package com.bitwiserain.pbbg.app.domain.model.mine

enum class MineType(val id: Int, val friendlyName: String, val minLevel: Int, val spriteName: String, private val mineEntityOdds: Map<Float, MineEntity>) {
    BEGINNER(
        1,
        "Young Worm's Mine",
        1,
        "young-worm",
        mapOf(
            0.05f to MineEntity.ROCK,
            0.008f to MineEntity.COAL
        )
    ),
    MODERATE(
        2,
        "Grown Heron's Mine",
        5,
        "grown-heron",
        mapOf(
            0.048f to MineEntity.ROCK,
            0.005f to MineEntity.COAL,
            0.012f to MineEntity.COPPER
        )
    ),
    ;

    fun rollForMineEntity(roll: Float): MineEntity? {
        var currentOdds = 0f

        for (pair in mineEntityOdds) {
            currentOdds += pair.key

            if (roll <= currentOdds) return pair.value
        }

        return null
    }

    companion object {
        private val idMap = MineType.entries.associateBy { it.id }

        fun fromId(id: Int): MineType = idMap[id]
            ?: throw IllegalArgumentException("Unknown MineType id: $id")
    }
}
