package com.bitwiserain.pbbg.app.db.repository.mine

import com.bitwiserain.pbbg.app.db.Transaction
import com.bitwiserain.pbbg.app.db.generated.Database
import com.bitwiserain.pbbg.app.db.model.MineCell
import com.bitwiserain.pbbg.app.domain.model.mine.MineEntity

interface MineCellTable {

    fun getGrid(mineSessionId: Int): Map<Pair<Int, Int>, MineEntity>

    fun getMineCells(mineSessionId: Int): List<MineCell>

    fun insertCells(mineSessionId: Int, cells: Map<Pair<Int, Int>, MineEntity>)

    fun deleteCells(cellIds: List<Int>)
}

class MineCellTableImpl(
    private val database: Database,
    private val transaction: Transaction,
) : MineCellTable {

    override fun getGrid(mineSessionId: Int): Map<Pair<Int, Int>, MineEntity> =
        database.mineCellQueries.getGrid(mineSessionId)
            .executeAsList()
            .associate { row ->
                (row.x to row.y) to MineEntity.fromId(row.mine_entity_id)
            }

    override fun getMineCells(mineSessionId: Int): List<MineCell> =
        database.mineCellQueries.getMineCells(mineSessionId)
            .executeAsList()
            .map { row ->
                MineCell(
                    id = row.id,
                    x = row.x,
                    y = row.y,
                    mineEntity = MineEntity.fromId(row.mine_entity_id),
                )
            }

    override fun insertCells(mineSessionId: Int, cells: Map<Pair<Int, Int>, MineEntity>) = transaction {
        cells.forEach { (pos, entity) ->
            database.mineCellQueries.insertCell(
                mineSessionId,
                pos.first,
                pos.second,
                entity.id
            )
        }
    }

    override fun deleteCells(cellIds: List<Int>) {
        require(cellIds.isNotEmpty())
        database.mineCellQueries.deleteCells(cellIds)
    }
}
