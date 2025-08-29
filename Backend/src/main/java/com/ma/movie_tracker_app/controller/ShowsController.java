// Package: puts this controller class under the "controller" package
package com.ma.movie_tracker_app.controller;

// Spring MVC annotations for REST APIs
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

// Import your Show entity and repository
import com.ma.movie_tracker_app.model.Shows;
import com.ma.movie_tracker_app.model.ShowsRepository;

// Import List for returning multiple shows
import java.util.List;

// @RestController → this class will handle HTTP requests and return JSON responses
@RestController
// Base path for all endpoints in this controller → /api/shows
@RequestMapping("/api/shows")
public class ShowsController {

    // Inject ShowsRepository so we can query/save shows in the database
    @Autowired
    private ShowsRepository showRepo;

    // -------- GET /api/shows --------
    // Fetch all shows OR search by title if query parameter ?title=... is provided
    @GetMapping
    public List<Shows> getAll(@RequestParam(value="title", required=false) String title) {
        // If client sends a query like /api/shows?title=Friends → search by title
        if (title != null) {
            return showRepo.findByTitle(title);
        }
        // If no title param → return all shows
        return showRepo.findAll();
    }

    // -------- POST /api/shows --------
    // Add a new show to the database.
    // @RequestBody maps the incoming JSON into a Shows object.
    @PostMapping
    public Shows add(@RequestBody Shows show) {
        // Save the show and return the saved entity as JSON
        return showRepo.save(show);
    }
}

