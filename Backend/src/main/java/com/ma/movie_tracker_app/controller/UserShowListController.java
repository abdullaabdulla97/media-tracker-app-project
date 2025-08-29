// Package: groups this controller under "controller"
package com.ma.movie_tracker_app.controller;

// Spring MVC + Spring core imports
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

// Import your models + repositories
import com.ma.movie_tracker_app.model.*;

// For building HTTP responses with status codes
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

// For JSON-like responses
import java.util.Map;
import java.util.HashMap;
import java.util.List;

// @RestController → handles HTTP requests and returns JSON
@RestController
// Base path: all endpoints start with /api/user/showlist
@RequestMapping("/api/user/showlist")
public class UserShowListController {

    // Inject repositories so we can query/update the database
    @Autowired
    private UserRepository userRepo;                  // Access user table
    @Autowired
    private ShowsRepository showRepo;                 // Access shows table
    @Autowired
    private UserShowListRepository userShowListRepo;  // Access user↔show relationships

    // -------- POST /api/user/showlist/{type}/add --------
    // Add a show to a user's list (watchlist, favourites, or watched)
    @PostMapping("/{type}/add")
    public ResponseEntity<Map<String, String>> addList(
            @PathVariable String type,         // Path variable: type of list
            @RequestBody UserShowListDTO dto   // Request body: DTO with show + user info
    ) {
        // Look up the user by username
        User userFound = userRepo.findByUsername(dto.username());

        // Look up the show by TMDB ID
        Shows show = showRepo.findByTmdbId(dto.tmdbId());

        // If show doesn’t exist in DB yet, create and save a new one
        if (show == null) {
            show = new Shows();
            show.setTmdbId(dto.tmdbId());
            show.setTitle(dto.title());
            show.setReleaseYear(dto.releaseYear());
            show.setGenre(dto.genre());
            show.setDescription(dto.description());
            show.setDirector(dto.director());
            show.setImageUrl(dto.imageUrl());
            show = showRepo.save(show);
        }

        // Build JSON response
        Map<String, String> response = new HashMap<>();

        if (userFound != null && show != null) {
            // Check if user already has this show in the list
            UserShowList existing = userShowListRepo.findByUserAndShowAndType(userFound, show, type);

            // If not, create a new entry
            if (existing == null) {
                UserShowList userShowList = new UserShowList();
                userShowList.setUser(userFound);
                userShowList.setShow(show);
                userShowList.setType(type);
                userShowListRepo.save(userShowList);
            }

            response.put("message", "Has been added to " + type);
            return ResponseEntity.ok(response); // 200 OK
        }

        // If user or show not found
        response.put("message", "The User or Show was not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // -------- POST /api/user/showlist/{type}/remove --------
    // Remove a show from a user's list
    @PostMapping("/{type}/remove")
    public ResponseEntity<Map<String, String>> removeList(
            @PathVariable String type,         // Type of list (watchlist/favourites/watched)
            @RequestBody UserShowListDTO dto   // DTO with username + tmdbId
    ) {
        User userFound = userRepo.findByUsername(dto.username());
        Shows show = showRepo.findByTmdbId(dto.tmdbId());

        Map<String, String> response = new HashMap<>();

        if (userFound != null && show != null) {
            // Delete the entry using repository method
            userShowListRepo.deleteByUserAndShowAndType(userFound, show, type);

            response.put("message", "Has been removed from " + type);
            return ResponseEntity.ok(response); // 200 OK
        }

        response.put("message", "The User or Show was not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // -------- GET /api/user/showlist/{type}?username=... --------
    // Fetch all shows in a specific list type for a given user
    @GetMapping("/{type}")
    public List<UserShowList> getList(
            @RequestParam String username, // Query param: username
            @PathVariable String type      // Path variable: type of list
    ) {
        User userFound = userRepo.findByUsername(username);
        // Return all rows for this user and list type
        return userShowListRepo.findByUserAndType(userFound, type);
    }
}

