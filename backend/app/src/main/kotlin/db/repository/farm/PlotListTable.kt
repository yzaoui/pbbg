package com.bitwiserain.pbbg.app.db.repository.farm

import com.bitwiserain.pbbg.app.db.Transaction
import com.bitwiserain.pbbg.app.db.generated.Database
import com.bitwiserain.pbbg.app.reorder
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

interface PlotListTable {
    fun insertUser(userId: Int)

    fun get(userId: Int): List<Long>

    fun reorder(userId: Int, plotId: Long, newIndex: Int)
}

class PlotListTableImpl(
    private val database: Database,
    private val transaction: Transaction,
) : PlotListTable {

    override fun insertUser(userId: Int) {
        database.plotListQueries.insertUser(userId, "[]")
    }

    override fun get(userId: Int): List<Long> {
        val jsonString = database.plotListQueries.get(userId).executeAsOne()
        return Json.decodeFromString(jsonString)
    }

    override fun reorder(userId: Int, plotId: Long, newIndex: Int) = transaction {
        val jsonString = database.plotListQueries.get(userId).executeAsOne()
        val plotIdList: List<Long> = Json.decodeFromString(jsonString)

        if (newIndex !in plotIdList.indices) throw IllegalArgumentException()

        val oldIndex = plotIdList.indexOfFirst { it == plotId }
        if (oldIndex == -1) throw IllegalStateException()

        // No need to do any work
        if (oldIndex == newIndex) return@transaction

        val newPlotIdListJSON = plotIdList.reorder(fromIndex = oldIndex, toIndex = newIndex).let(Json::encodeToString)

        database.plotListQueries.updatePlotIdList(newPlotIdListJSON, userId)
    }
}
