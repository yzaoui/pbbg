package com.bitwiserain.pbbg.app.db.repository.battle

import com.bitwiserain.pbbg.app.db.generated.Database
import com.bitwiserain.pbbg.app.domain.model.battle.BattleQueue

interface BattleSessionTable {

    fun createBattleSessionAndGetId(userId: Int): Long

    /**
     * Get a user's battle session ID, if any.
     */
    fun getBattleSessionId(userId: Int): Long?

    fun isBattleInProgress(userId: Int): Boolean

    /**
     * Delete a battle session entry.
     */
    fun deleteBattle(battleSession: Long)

    fun getBattleQueue(battleSession: Long): BattleQueue

    fun updateBattleQueue(battleSession: Long, battleQueue: BattleQueue)
}

class BattleSessionTableImpl(private val database: Database) : BattleSessionTable {

    override fun createBattleSessionAndGetId(userId: Int): Long =
        database.battleSessionQueries.createBattleSessionAndGetId(userId).executeAsOne()

    override fun getBattleSessionId(userId: Int): Long? =
        database.battleSessionQueries.getBattleSessionId(userId).executeAsOneOrNull()

    override fun isBattleInProgress(userId: Int): Boolean =
        database.battleSessionQueries.isBattleInProgress(userId).executeAsOne()

    override fun deleteBattle(battleSession: Long) {
        database.battleSessionQueries.deleteBattle(battleSession)
    }

    override fun getBattleQueue(battleSession: Long): BattleQueue {
        val turnsString = database.battleSessionQueries.getBattleQueue(battleSession).executeAsOne()
        return BattleQueue.fromJSON(turnsString)
    }

    override fun updateBattleQueue(battleSession: Long, battleQueue: BattleQueue) {
        database.battleSessionQueries.updateBattleQueue(battleQueue.toJSON(), battleSession)
    }
}
