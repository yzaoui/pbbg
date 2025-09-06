package com.bitwiserain.pbbg.app.db.repository

import com.bitwiserain.pbbg.app.db.generated.Database
import com.bitwiserain.pbbg.app.db.repository.UnitTable.UnitForm
import com.bitwiserain.pbbg.app.domain.model.MyUnit
import com.bitwiserain.pbbg.app.domain.model.MyUnitEnum

interface UnitTable {

    /**
     * Inserts a new unit and returns its ID.
     */
    fun insertUnitAndGetId(unit: UnitForm): Long

    /**
     * Updates a unit with new stats.
     */
    fun updateUnit(unitId: Long, unit: MyUnit)

    fun getUnit(unitId: Long): MyUnit?

    fun deleteUnits(unitIds: Collection<Long>)

    /**
     * The form of fields required to create a new unit.
     * The new unit will start with 0 exp, and be at full HP.
     */
    data class UnitForm(
        val enum: MyUnitEnum,
        val hp: Int,
        val atk: Int,
        val def: Int,
        val int: Int,
        val res: Int
    )
}

class UnitTableImpl(private val database: Database) : UnitTable {

    override fun insertUnitAndGetId(unit: UnitForm): Long =
        database.unitQueries.insertUnitAndGetId(
            unit_enum_id = unit.enum.id,
            hp = unit.hp,
            max_hp = unit.hp,
            atk = unit.atk,
            def = unit.def,
            int = unit.int,
            res = unit.res,
            exp = 0L,
        ).executeAsOne()

    override fun updateUnit(unitId: Long, unit: MyUnit) {
        database.unitQueries.updateUnit(
            id = unitId,
            hp = unit.hp,
            max_hp = unit.maxHP,
            atk = unit.atk,
            def = unit.def,
            int = unit.int,
            res = unit.res,
            exp = unit.exp,
        )
    }

    override fun getUnit(unitId: Long): MyUnit? =
        database.unitQueries.getUnit(unitId).executeAsOneOrNull()?.toDomainModel()

    override fun deleteUnits(unitIds: Collection<Long>) {
        database.unitQueries.deleteUnit(unitIds)
    }
}
