package com.bitwiserain.pbbg.app.db.repository.mine

import com.bitwiserain.pbbg.app.db.generated.Database
import com.bitwiserain.pbbg.app.db.model.MineSession
import com.bitwiserain.pbbg.app.domain.model.mine.MineType

interface MineSessionTable {

    fun insertSessionAndGetId(userId: Int, width: Int, height: Int, mineType: MineType): Int

    fun getSession(userId: Int): MineSession?

    fun deleteSession(userId: Int)
}

class MineSessionTableImpl(private val database: Database) : MineSessionTable {

    override fun insertSessionAndGetId(userId: Int, width: Int, height: Int, mineType: MineType): Int =
        database.mineSessionQueries.insertSessionAndGetId(userId, width, height, mineType.id).executeAsOne()

    override fun getSession(userId: Int): MineSession? =
        database.mineSessionQueries.getSession(userId).executeAsOneOrNull()?.let { row ->
            MineSession(
                id = row.id,
                width = row.width,
                height = row.height,
                mineType = MineType.fromId(row.mine_type_id),
            )
        }

    override fun deleteSession(userId: Int) {
        database.mineSessionQueries.deleteSession(userId)
    }
}
