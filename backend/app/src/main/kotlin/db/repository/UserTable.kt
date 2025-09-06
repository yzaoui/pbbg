package com.bitwiserain.pbbg.app.db.repository

import com.bitwiserain.pbbg.app.db.generated.Database
import com.bitwiserain.pbbg.app.db.model.User
import java.time.Instant

interface UserTable {

    fun createUserAndGetId(username: String, passwordHash: ByteArray, joinedInstant: Instant): Int

    fun getUserByUsername(username: String): User?

    fun getUserById(userId: Int): User?

    fun getUsersById(userIds: Collection<Int>): Map<Int, User>

    fun userExists(userId: Int): Boolean

    fun searchUsers(text: String): List<User>

    fun updatePassword(userId: Int, newPassword: ByteArray)
}

class UserTableImpl(private val database: Database) : UserTable {

    override fun createUserAndGetId(username: String, passwordHash: ByteArray, joinedInstant: Instant): Int =
            database.userQueries.insertUser(username, passwordHash, joinedInstant.epochSecond)
                .executeAsOne()

    override fun getUserByUsername(username: String): User? =
        database.userQueries.getUserByUsername(username)
            .executeAsOneOrNull()
            ?.toDomainModel()

    override fun getUserById(userId: Int): User? =
        database.userQueries.getUserById(userId)
            .executeAsOneOrNull()
            ?.toDomainModel()

    override fun getUsersById(userIds: Collection<Int>): Map<Int, User> {
        require(userIds.isNotEmpty())
        return database.userQueries.getUsersById(userIds)
            .executeAsList()
            .associate { row ->
                row.id to row.toDomainModel()
            }
    }

    override fun userExists(userId: Int): Boolean =
        database.userQueries.userExists(userId)
            .executeAsOne()

    override fun searchUsers(text: String): List<User> =
        database.userQueries.searchUsers(text)
            .executeAsList()
            .map { it.toDomainModel() }

    override fun updatePassword(userId: Int, newPassword: ByteArray) {
        database.userQueries.updatePassword(newPassword, userId)
    }

    private fun com.bitwiserain.pbbg.app.db.User.toDomainModel() = User(
        id = id,
        username = username,
        passwordHash = password_hash,
        joinedInstant = Instant.ofEpochSecond(joined_epoch_seconds),
    )
}
