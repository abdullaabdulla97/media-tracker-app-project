// Package: puts this repository interface in the "model" folder
package com.ma.movie_tracker_app.model;

// Import Spring Data JPA base repository
import org.springframework.data.jpa.repository.JpaRepository;
// Import annotation to mark modifying queries (DELETE/UPDATE)
import org.springframework.data.jpa.repository.Modifying;
// Import annotation so methods run inside a transaction
import org.springframework.transaction.annotation.Transactional;
// Import List for returning multiple results
import java.util.List;

// UserShowListRepository extends JpaRepository to manage UserShowList entities.
// - Entity type: UserShowList
// - Primary key type: Long
//
// This gives you built-in CRUD methods (save, findAll, findById, deleteById, etc.)
// PLUS, you can define custom finder/delete methods by naming them clearly.
public interface UserShowListRepository extends JpaRepository<UserShowList, Long> {

    // Custom finder #1:
    // Returns all UserShowList entries for a given user and type.
    // Example: find all shows in "favourites" for user X.
    //
    // SQL generated automatically:
    // SELECT * FROM user_show_list WHERE user_id = ? AND type = ?;
    List<UserShowList> findByUserAndType(User user, String type);

    // Custom finder #2:
    // Returns a single UserShowList entry for a specific user, show, and type.
    // Example: check if user X already has show Y in "watchlist".
    //
    // SQL generated automatically:
    // SELECT * FROM user_show_list WHERE user_id = ? AND show_id = ? AND type = ?;
    UserShowList findByUserAndShowAndType(User user, Shows show, String type);

    // Custom delete:
    // Deletes an entry for a given user, show, and type.
    // Example: remove show Y from user X’s "watched" list.
    //
    // @Modifying marks this as a query that changes the DB (not a SELECT).
    // @Transactional ensures the delete happens inside a transaction.
    // SQL generated automatically:
    // DELETE FROM user_show_list WHERE user_id = ? AND show_id = ? AND type = ?;
    @Modifying
    @Transactional
    void deleteByUserAndShowAndType(User user, Shows show, String type);
}

