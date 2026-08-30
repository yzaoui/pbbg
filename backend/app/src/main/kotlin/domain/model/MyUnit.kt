package com.bitwiserain.pbbg.app.domain.model

import com.bitwiserain.pbbg.app.domain.BattleManager

data class MyUnit(
    val id: Long,
    val enum: MyUnitEnum,
    val hp: Int,
    val maxHP: Int,
    val atk: Int,
    val def: Int,
    val int: Int,
    val res: Int,
    val exp: Long
) {
    val alive: Boolean
        get() = hp > 0
    val dead: Boolean
        get() = !alive

    fun receiveDamage(attackerAtk: Int): DamageResult {
        val damage = BattleManager.calculateDamage(attackerAtk, this.def)
        val newHp = (hp - damage).coerceIn(0..this.maxHP)
        return DamageResult(copy(hp = newHp), damage)
    }

    fun gainExperience(gainedExp: Long): MyUnit {
        return copy(exp = exp + gainedExp)
    }

    fun maxHeal(): MyUnit {
        return copy(hp = maxHP)
    }
}

data class DamageResult(val updatedUnit: MyUnit, val damage: Int)
