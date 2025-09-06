package com.bitwiserain.pbbg.app.db.repository.farm

import com.bitwiserain.pbbg.app.db.generated.Database
import com.bitwiserain.pbbg.app.db.repository.farm.MaterializedPlantTable.PlantForm
import com.bitwiserain.pbbg.app.domain.model.farm.PlantEnum
import java.time.Instant

interface MaterializedPlantTable {

    fun insertPlantAndGetId(plant: PlantForm): Long

    fun setNewPlantCycleAndHarvest(plantId: Long, newCycleStart: Instant, harvests: Int)

    fun deletePlant(plantId: Long)

    data class PlantForm(
        val enum: PlantEnum,
        val cycleStart: Instant,
        val isMaturable: Boolean
    )
}

class MaterializedPlantTableImpl(private val database: Database) : MaterializedPlantTable {

    override fun insertPlantAndGetId(plant: PlantForm): Long =
        database.materializedPlantQueries.insertPlantAndGetId(
            plant_enum_id = plant.enum.id,
            cycle_start = plant.cycleStart.epochSecond,
            harvests = if (plant.isMaturable) 0 else null,
        ).executeAsOne()

    override fun setNewPlantCycleAndHarvest(plantId: Long, newCycleStart: Instant, harvests: Int) {
        database.materializedPlantQueries.setNewPlantCycleAndHarvest(
            cycle_start = newCycleStart.epochSecond,
            harvests = harvests,
            id = plantId,
        )
    }

    override fun deletePlant(plantId: Long) {
        database.materializedPlantQueries.deletePlant(plantId)
    }
}
