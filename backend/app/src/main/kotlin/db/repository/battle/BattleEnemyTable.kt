package com.bitwiserain.pbbg.app.db.repository.battle

import com.bitwiserain.pbbg.app.db.generated.Database
import com.bitwiserain.pbbg.app.db.repository.toDomainModel
import com.bitwiserain.pbbg.app.domain.model.MyUnit

interface BattleEnemyTable {

    /**
     * Gets a single enemy belonging to a battle session, if any.
     */
    fun getEnemy(battleSession: Long, enemyId: Long): MyUnit?

    /**
     * Gets a list of enemies belonging to a battle session, if any.
     */
    fun getEnemies(battleSession: Long): List<MyUnit>

    /**
     * Inserts new enemy unit into a battle session.
     */
    fun insertEnemy(battleSession: Long, unitId: Long)
}

class BattleEnemyTableImpl(private val database: Database) : BattleEnemyTable {

    override fun getEnemy(battleSession: Long, enemyId: Long): MyUnit? = database.battleEnemyQueries
        .getEnemy(
            battle_session_id = battleSession,
            id = enemyId
        )
        .executeAsOneOrNull()
        ?.toDomainModel()

    override fun getEnemies(battleSession: Long): List<MyUnit> = database.battleEnemyQueries
        .getEnemies(battleSession)
        .executeAsList()
        .map { it.toDomainModel() }

    override fun insertEnemy(battleSession: Long, unitId: Long) {
        database.battleEnemyQueries.insertEnemy(battleSession, unitId)
    }
}
