// Package: puts this controller under "controller"
package com.ma.movie_tracker_app.controller;

// Spring MVC + Spring core imports
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

// Import models and repositories
import com.ma.movie_tracker_app.model.*;

// For building HTTP responses with proper status codes
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

// For building JSON-like responses
import java.util.Map;
import java.util.HashMap;
import java.util.List;

// @RestController → this class handles HTTP requests and returns JSON
@RestController
// Base path: all endpoints start with /api/user/movielist
@RequestMapping("/api/user/movielist")
public class UserMovieListController {

    // Inject repositories to work with database tables
    @Autowired
    private UserRepository userRepo;                // For looking up users
    @Autowired
    private MoviesRepository movieRepo;             // For looking up or saving movies
    @Autowired
    private UserMovieListRepository userMovieListRepo; // For managing user ↔ movie links

    // -------- POST /api/user/movielist/{type}/add --------
    // Add a movie to a user's list (watchlist, favourites, or watched)
    @PostMapping("/{type}/add")
    public ResponseEntity<Map<String, String>> addList(
            @PathVariable String type,         // The list type (from URL path)
            @RequestBody UserMovieListDTO dto  // DTO sent in JSON body
    ) {
        // Find the user from the username
        User userFound = userRepo.findByUsername(dto.username());

        // Try to find the movie by TMDB ID
        Movies movie = movieRepo.findByTmdbId(dto.tmdbId());

        // If movie not in DB yet, create and save a new one
        if (movie == null) {
            movie = new Movies();
            movie.setTmdbId(dto.tmdbId());
            movie.setTitle(dto.title());
            movie.setReleaseYear(dto.releaseYear());
            movie.setGenre(dto.genre());
            movie.setDescription(dto.description());
            movie.setDirector(dto.director());
            movie.setImageUrl(dto.imageUrl());
            movie = movieRepo.save(movie); // persist to DB
        }

        // Build response message
        Map<String, String> response = new HashMap<>();

        if (userFound != null && movie != null) {
            // Check if entry already exists
            UserMovieList existing = userMovieListRepo.findByUserAndMovieAndType(userFound, movie, type);

            // If not already in list, create and save it
            if (existing == null) {
                UserMovieList userMovieList = new UserMovieList();
                userMovieList.setUser(userFound);
                userMovieList.setMovie(movie);
                userMovieList.setType(type);
                userMovieListRepo.save(userMovieList);
            }

            response.put("message", "Has been added to " + type);
            return ResponseEntity.ok(response); // 200 OK
        }

        // If user or movie not found
        response.put("message", "The User or Movie was not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // -------- POST /api/user/movielist/{type}/remove --------
    // Remove a movie from a user's list
    @PostMapping("/{type}/remove")
    public ResponseEntity<Map<String, String>> removeList(
            @PathVariable String type,         // List type
            @RequestBody UserMovieListDTO dto  // DTO with username + tmdbId
    ) {
        User userFound = userRepo.findByUsername(dto.username());
        Movies movie = movieRepo.findByTmdbId(dto.tmdbId());

        Map<String, String> response = new HashMap<>();

        if (userFound != null && movie != null) {
            // Delete the entry (Spring Data JPA builds the query automatically)
            userMovieListRepo.deleteByUserAndMovieAndType(userFound, movie, type);

            response.put("message", "Has been removed from " + type);
            return ResponseEntity.ok(response); // 200 OK
        }

        response.put("message", "The User or Movie was not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // -------- GET /api/user/movielist/{type}?username=... --------
    // Get all movies of a given type for a specific user
    @GetMapping("/{type}")
    public List<UserMovieList> getList(
            @RequestParam String username, // username passed as a query parameter
            @PathVariable String type      // type passed as a path variable
    ) {
        User userFound = userRepo.findByUsername(username);
        // Return all matching entries (e.g., all watchlist movies for this user)
        return userMovieListRepo.findByUserAndType(userFound, type);
    }
}

