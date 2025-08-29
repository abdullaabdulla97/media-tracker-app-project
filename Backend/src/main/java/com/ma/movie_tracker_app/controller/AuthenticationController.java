// Package: places this controller class under the "controller" package
package com.ma.movie_tracker_app.controller;

// Spring MVC annotations and classes for building REST APIs
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;

// the model + repository for accessing users in the database
import com.ma.movie_tracker_app.model.User;
import com.ma.movie_tracker_app.model.UserRepository;

// For working with the HTTP session (stores logged-in username)
import jakarta.servlet.http.HttpSession;

// Utility types for building JSON-like responses
import java.util.HashMap;
import java.util.Map;

// @RestController = this class handles HTTP requests and returns JSON (no view templates)
@RestController
// Base path for all endpoints in this controller: /api/user/...
@RequestMapping("/api/user")
public class AuthenticationController {

    // Inject the UserRepository so we can query/save users
    @Autowired
    private UserRepository userRepo;

    // --------- Register ---------
    // POST /api/user/register
    @PostMapping("/register")
    // @RequestBody tells Spring to parse the JSON body into a User object
    // HttpSession lets us store data (like USERNAME) across requests
    public ResponseEntity<Map<String, String>> register(@RequestBody User user, HttpSession session) {
        // We'll return a JSON map like {"message": "...", "username": "..."}
        Map<String, String> response = new HashMap<>();

        // Check if the username is already taken
        if (userRepo.findByUsername(user.getUsername()) != null) {
            response.put("message", "Username already taken");
            // 409 CONFLICT = resource already exists
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        // Save the new user to the database
        userRepo.save(user);

        // Log the user in immediately by storing the username in the session
        session.setAttribute("USERNAME", user.getUsername());

        // Build success response
        response.put("message", "Registration successful");
        response.put("username", user.getUsername());
        // 200 OK with JSON body
        return ResponseEntity.ok(response);
    }

    // --------- Login ---------
    // POST /api/user/login
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user, HttpSession session) {
        Map<String, String> response = new HashMap<>();

        // Look up the user by username
        User userFound = userRepo.findByUsername(user.getUsername());

        // If user exists AND passwords match, authenticate them
        if (userFound != null && userFound.getPassword().equals(user.getPassword())) {
            // Save username in the session to mark them as logged-in
            session.setAttribute("USERNAME", userFound.getUsername());

            // Build success response
            response.put("message", "Login successful");
            response.put("username", userFound.getUsername());
            return ResponseEntity.ok(response);
        }

        // If not found or password mismatch, return 401 Unauthorized
        response.put("message", "Invalid username or password");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    // --------- Logout ---------
    // POST /api/user/logout
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpSession session) {
        // Destroy the session; user is no longer authenticated
        session.invalidate();
        // Return a simple success message
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    // GET /api/user/me
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(HttpSession session) {
        // Read the username stored in the session (set on login/register)
        String username = (String) session.getAttribute("USERNAME");

        // If not present, the user is not authenticated
        if (username == null) {
            // 401 Unauthorized with a JSON body indicating not authenticated
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("authenticated", false));
        }

        // If present, return authenticated: true and the username
        return ResponseEntity.ok(Map.of("authenticated", true, "username", username));
    }
}

