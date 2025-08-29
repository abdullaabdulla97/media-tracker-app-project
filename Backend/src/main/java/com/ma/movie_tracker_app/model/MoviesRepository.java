// Package: groups this class under the "model" folder in com.ma.movie_tracker_app
package com.ma.movie_tracker_app.model;

// Import Spring Data JPA's repository base interface
import org.springframework.data.jpa.repository.JpaRepository;
// Import List so we can return multiple Movies when searching
import java.util.List;

// MoviesRepository is an INTERFACE (not a class).
// By extending JpaRepository<Movies, Long> we tell Spring Data JPA:
//
// - This repository works with the "Movies" entity.
// - The primary key type of Movies is Long.
//
// JpaRepository gives us many ready-made CRUD methods, like:
//   save(movie)          → INSERT or UPDATE
//   findById(id)         → SELECT by primary key
//   findAll()            → SELECT * (all rows)
//   deleteById(id)       → DELETE by id
//   count()              → SELECT COUNT(*)
public interface MoviesRepository extends JpaRepository<Movies, Long> {

    // Custom query method #1:
    // Spring Data JPA will automatically generate a query like:
    //   SELECT * FROM movies WHERE title = ?;
    // Returns a List because multiple movies might share the same title.
    List<Movies> findByTitle(String title);

    // Custom query method #2:
    // Finds a single movie by its TMDB ID.
    // Query generated automatically:
    //   SELECT * FROM movies WHERE tmdb_id = ?;
    // Returns a single Movies object or null if not found.
    Movies findByTmdbId(Long tmdbId);
}

