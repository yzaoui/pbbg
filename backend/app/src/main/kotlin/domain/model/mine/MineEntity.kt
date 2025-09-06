package com.bitwiserain.pbbg.app.domain.model.mine

/**
 * Entities that can be found on the mine's surface.
 */
enum class MineEntity(val id: Int, val exp: Int, val friendlyName: String, val spriteName: String) {
    ROCK(1, 4, "Rock","rock"),
    COAL(2, 9, "Coal", "coal"),
    COPPER(3, 8, "Copper", "copper"),
    ;

    companion object {
        private val idMap = MineEntity.entries.associateBy { it.id }

        fun fromId(id: Int): MineEntity = idMap[id]
            ?: throw IllegalArgumentException("Unknown MineEntity id: $id")
    }
}
