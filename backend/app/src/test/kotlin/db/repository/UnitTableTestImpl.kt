package com.bitwiserain.pbbg.app.test.db.repository

import com.bitwiserain.pbbg.app.db.repository.UnitTable
import com.bitwiserain.pbbg.app.domain.model.MyUnit
import com.bitwiserain.pbbg.app.domain.model.MyUnitEnum

class UnitTableTestImpl(private val units: MutableMap<Long, MyUnit> = mutableMapOf()) : UnitTable {
    override fun insertUnitAndGetId(unit: UnitTable.UnitForm): Long {
        val id = units.size.toLong()
        val unitEnum = unit.enum
        val hp = unit.hp
        val maxHP = unit.hp
        val atk = unit.atk
        val def = unit.def
        val int = unit.int
        val res = unit.res
        val exp = 0L

        units[id] = MyUnit(
            id = id,
            enum = unitEnum,
            hp = hp,
            maxHP = maxHP,
            atk = atk,
            def = def,
            int = int,
            res = res,
            exp = exp
        )

        return id
    }

    override fun updateUnit(unitId: Long, unit: MyUnit) {
        units[unitId] = unit
    }

    override fun getUnit(unitId: Long): MyUnit? = units[unitId]

    override fun deleteUnits(unitIds: Collection<Long>) {
        unitIds.forEach { units.remove(it) }
    }
}
