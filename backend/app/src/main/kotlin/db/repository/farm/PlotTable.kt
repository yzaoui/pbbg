package com.bitwiserain.pbbg.app.db.repository.farm

import com.bitwiserain.pbbg.app.db.GetPlot
import com.bitwiserain.pbbg.app.db.GetPlots
import com.bitwiserain.pbbg.app.db.Transaction
import com.bitwiserain.pbbg.app.db.generated.Database
import com.bitwiserain.pbbg.app.domain.model.farm.MaterializedPlant
import com.bitwiserain.pbbg.app.domain.model.farm.PlantEnum
import com.bitwiserain.pbbg.app.domain.model.farm.Plot
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.time.Instant

interface PlotTable {

    fun createAndGetEmptyPlot(userId: Int): Plot

    fun updatePlot(userId: Int, plotId: Long, plantId: Long)

    fun getPlots(userId: Int): List<Plot>

    fun getPlot(userId: Int, plotId: Long): Plot?
}

class PlotTableImpl(
    private val database: Database,
    private val transaction: Transaction
) : PlotTable {

    override fun createAndGetEmptyPlot(userId: Int): Plot = transaction {
        val newPlotId = database.plotQueries.createAndGetEmptyPlotId(userId).executeAsOne()

        val currentPlotIdList: List<Long?> = database.plotListQueries.get(userId).executeAsOne()
            .let(Json::decodeFromString)

        val updatedPlotIdListJSON = Json.encodeToString(currentPlotIdList + newPlotId)

        database.plotListQueries.updatePlotIdList(updatedPlotIdListJSON, userId)

        Plot(newPlotId, null)
    }

    override fun updatePlot(userId: Int, plotId: Long, plantId: Long) {
        database.plotQueries.updatePlot(plant_id = plantId, user_id = userId, id = plotId)
    }

    override fun getPlots(userId: Int): List<Plot> =
        database.plotQueries.getPlots(userId)
            .executeAsList()
            .map { it.toPlot() }

    override fun getPlot(userId: Int, plotId: Long): Plot? =
        database.plotQueries.getPlot(userId, plotId).executeAsOneOrNull()?.toPlot()

    private fun GetPlots.toPlot(): Plot {
        return Plot(
            id = id,
            plant = if (plant_id != null) plant_id to toMaterializedPlant() else null
        )
    }

    private fun GetPlots.toMaterializedPlant(): MaterializedPlant {
        // This function assumes `plant_id` isn't false, therefore neither is `plant_enum_id` nor `cycle_start`
        val plantEnum = PlantEnum.fromId(plant_enum_id!!)
        val cycleStart = Instant.ofEpochSecond(cycle_start!!)

        return when (plantEnum) {
            PlantEnum.APPLE_TREE -> MaterializedPlant.AppleTree(cycleStart, harvests!!)
            PlantEnum.TOMATO_PLANT -> MaterializedPlant.TomatoPlant(cycleStart)
        }
    }

    private fun GetPlot.toPlot(): Plot {
        return Plot(
            id = id,
            plant = if (plant_id != null) plant_id to toMaterializedPlant() else null
        )
    }

    private fun GetPlot.toMaterializedPlant(): MaterializedPlant {
        // This function assumes `plant_id` isn't false, therefore neither is `plant_enum_id` nor `cycle_start`
        val plantEnum = PlantEnum.fromId(plant_enum_id!!)
        val cycleStart = Instant.ofEpochSecond(cycle_start!!)

        return when (plantEnum) {
            PlantEnum.APPLE_TREE -> MaterializedPlant.AppleTree(cycleStart, harvests!!)
            PlantEnum.TOMATO_PLANT -> MaterializedPlant.TomatoPlant(cycleStart)
        }
    }
}
