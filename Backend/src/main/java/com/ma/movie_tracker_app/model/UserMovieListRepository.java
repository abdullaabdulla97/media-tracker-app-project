// Package: puts this repository interface in the "model" folder
package com.ma.movie_tracker_app.model;

// Import Spring Data JPA base repository
import org.springframework.data.jpa.repository.JpaRepository;
// Import @Modifying so we can run DELETE/UPDATE queries
import org.springframework.data.jpa.repository.Modifying;
// Import @Transactional so the delete method runs inside a transaction
import org.springframework.transaction.annotation.Transactional;
// Import List so queries can return multiple results
import java.util.List;

// UserMovieListRepository extends JpaRepository to manage UserMovieList entities.
// - Entity type: UserMovieList
// - Primary key type: Long
//
// JpaRepository already gives us built-in CRUD methods like save(), findById(), findAll(), deleteById(), etc.
// We add custom queries here for specific use cases.
public interface UserMovieListRepository extends JpaRepository<UserMovieList, Long> {

    // Custom finder #1:
    // Find all UserMovieList entries for a given user AND a given type.
    // Example: find all movies in "watchlist" for user X.
    //
    // Spring Data JPA generates SQL automatically:
    // SELECT * FROM user_movie_list WHERE user_id = ? AND type = ?;
    List<UserMovieList> findByUserAndType(User user, String type);

    // Custom finder #2:
    // Find a single entry for a given user, a specific movie, and a type.
    // Example: Does user X already have movie Y in "favourites"?
    //
    // SQL generated automatically:
    // SELECT * FROM user_movie_list WHERE user_id = ? AND movie_id = ? AND type = ?;
    UserMovieList findByUserAndMovieAndType(User user, Movies movie, String type);

    // Custom delete:
    // Delete a row for a given user, movie, and type.
    // Example: remove movie Y from user X’s "watchlist".
    //
    // @Modifying marks this as a modifying query (not SELECT).
    // @Transactional ensures the delete runs inside a database transaction.
    // SQL generated:
    // DELETE FROM user_movie_list WHERE user_id = ? AND movie_id = ? AND type = ?;
    @Modifying
    @Transactional
    void deleteByUserAndMovieAndType(User user, Movies movie, String type);
}
