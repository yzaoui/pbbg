package com.bitwiserain.pbbg.app.db.repository

import com.bitwiserain.pbbg.app.db.generated.Database
import com.bitwiserain.pbbg.app.domain.model.UserStats

interface UserStatsTable {

    fun createUserStats(userId: Int)

    fun getUserStats(userId: Int): UserStats

    fun updateGold(userId: Int, gold: Long)

    fun updateMiningExp(userId: Int, miningExp: Long)

    fun updateFarmingExp(userId: Int, farmingExp: Long)
}

class UserStatsTableImpl(private val database: Database) : UserStatsTable {

    override fun createUserStats(userId: Int) {
        database.userStatsQueries.createUserStats(userId)
    }

    override fun getUserStats(userId: Int): UserStats =
        database.userStatsQueries.getUserStats(userId)
            .executeAsOne()
            .let { row ->
                UserStats(
                    gold = row.gold,
                    miningExp = row.mining_exp,
                    farmingExp = row.farming_exp
                )
            }

    override fun updateGold(userId: Int, gold: Long) {
        database.userStatsQueries.updateGold(gold, userId)
    }

    override fun updateMiningExp(userId: Int, miningExp: Long) {
        database.userStatsQueries.updateMiningExp(miningExp, userId)
    }

    override fun updateFarmingExp(userId: Int, farmingExp: Long) {
        database.userStatsQueries.updateFarmingExp(farmingExp, userId)
    }
}
