package com.bitwiserain.pbbg.app.db.repository

import com.bitwiserain.pbbg.app.db.generated.Database
import com.bitwiserain.pbbg.app.domain.model.friends.Friendship

interface FriendsTable {

    fun getFriendship(currentUserId: Int, targetUserId: Int): Friendship

    fun getFriends(userId: Int): List<UserFriendship>

    fun insertRequest(currentUserId: Int, targetUserId: Int)

    fun deleteFriendship(currentUserId: Int, targetUserId: Int)

    fun confirmRequest(currentUserId: Int, targetUserId: Int)

    fun cancelRequest(currentUserId: Int, targetUserId: Int)
}

class FriendsTableImpl(private val database: Database) : FriendsTable {

    override fun getFriendship(currentUserId: Int, targetUserId: Int): Friendship {
        val row = database.friendsQueries.getFriendship(currentUserId, targetUserId, targetUserId, currentUserId)
            .executeAsOneOrNull()

        return when {
            row == null -> Friendship.NONE
            row.confirmed -> Friendship.CONFIRMED
            row.initiator_user_id == currentUserId -> Friendship.REQUEST_SENT
            row.receiver_user_id == currentUserId -> Friendship.REQUEST_RECEIVED
            else -> throw IllegalStateException()
        }
    }

    override fun getFriends(userId: Int): List<UserFriendship> =
        database.friendsQueries.getFriends(userId, userId)
            .executeAsList()
            .map { row ->
                if (row.initiator_user_id == userId) {
                    UserFriendship(
                        userId = row.receiver_user_id,
                        friendship = if (row.confirmed) Friendship.CONFIRMED else Friendship.REQUEST_SENT
                    )
                } else {
                    UserFriendship(
                        userId = row.initiator_user_id,
                        friendship = if (row.confirmed) Friendship.CONFIRMED else Friendship.REQUEST_RECEIVED
                    )
                }
            }

    override fun insertRequest(currentUserId: Int, targetUserId: Int) {
        database.friendsQueries.insertRequest(currentUserId, targetUserId)
    }

    override fun deleteFriendship(currentUserId: Int, targetUserId: Int) {
        database.friendsQueries.deleteFriendship(currentUserId, targetUserId, targetUserId, currentUserId)
    }

    override fun confirmRequest(currentUserId: Int, targetUserId: Int) {
        database.friendsQueries.confirmRequest(targetUserId, currentUserId)
    }

    override fun cancelRequest(currentUserId: Int, targetUserId: Int) {
        database.friendsQueries.cancelRequest(currentUserId, targetUserId)
    }
}

data class UserFriendship(
    val userId: Int,
    val friendship: Friendship
)
