package com.bitwiserain.pbbg.app.db

import com.bitwiserain.pbbg.app.db.generated.Database

class SQLDelightTransaction(private val database: Database) : Transaction {
    override fun <T> invoke(block: () -> T): T {
        return database.transactionWithResult { 
            block() 
        }
    }
}