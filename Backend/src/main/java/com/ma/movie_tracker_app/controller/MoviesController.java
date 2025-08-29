// Package: puts this controller class under the "controller" package
package com.ma.movie_tracker_app.controller;

// Spring MVC imports for REST APIs
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

// Import your Movie entity and repository
import com.ma.movie_tracker_app.model.Movies;
import com.ma.movie_tracker_app.model.MoviesRepository;

// Import List for returning multiple movies
import java.util.List;

// @RestController → this class handles HTTP requests and returns JSON
@RestController
// Base path for all endpoints in this controller → /api/movies
@RequestMapping("/api/movies")
public class MoviesController {

    // Inject MoviesRepository so we can query/save movies in the database
    @Autowired
    private MoviesRepository movieRepo;

    // -------- GET /api/movies --------
    // Fetch all movies OR, if a title query parameter is given, search by title
    @GetMapping
    public List<Movies> getAll(@RequestParam(value="title", required=false) String title) {
        // If client passed ?title=... in the URL, filter by title
        if (title != null) {
            return movieRepo.findByTitle(title);
        }
        // Otherwise, return all movies in the database
        return movieRepo.findAll();
    }

    // -------- POST /api/movies --------
    // Add a new movie to the database.
    // @RequestBody tells Spring to map the incoming JSON into a Movies object.
    @PostMapping
    public Movies add(@RequestBody Movies movie) {
        // Save the movie and return the saved entity as JSON
        return movieRepo.save(movie);
    }
}

