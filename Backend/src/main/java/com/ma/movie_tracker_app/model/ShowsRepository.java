// Package: groups this interface in the "model" folder of your project
package com.ma.movie_tracker_app.model;

// Import Spring Data JPA's repository interface
import org.springframework.data.jpa.repository.JpaRepository;
// Import List so we can return multiple results for a query
import java.util.List;

// ShowsRepository is an INTERFACE that extends JpaRepository.
// By extending JpaRepository<Shows, Long> we tell Spring Data JPA:
//
// - This repository manages the "Shows" entity.
// - The primary key type of Shows is Long.
//
// JpaRepository gives us built-in CRUD methods for free, like:
//   save(show)           → INSERT or UPDATE
//   findById(id)         → SELECT one row by id
//   findAll()            → SELECT * (all rows)
//   deleteById(id)       → DELETE by id
//   count()              → SELECT COUNT(*)
public interface ShowsRepository extends JpaRepository<Shows, Long> {

    // Custom query method #1:
    // Spring Data JPA creates a query automatically:
    //   SELECT * FROM shows WHERE title = ?;
    // Returns a List because multiple shows might have the same title.
    List<Shows> findByTitle(String title);

    // Custom query method #2:
    // Spring Data JPA generates:
    //   SELECT * FROM shows WHERE tmdb_id = ?;
    // Returns a single Shows object (or null if not found).
    Shows findByTmdbId(Long tmdbId);
}
