// Package: puts this class in the "model" folder of your project
package com.ma.movie_tracker_app.model;

// Import JPA annotations for entity and relationship mapping
import jakarta.persistence.*;

// @Entity marks this as a database-mapped class (a table will be created for it).
// By default, the table name will be "user_movie_list" (based on the class name).
@Entity
public class UserMovieList {

    // @Id → primary key of the table
    @Id
    // @GeneratedValue tells the database to auto-generate values for this column.
    // GenerationType.IDENTITY = the database handles auto-increment (e.g., 1,2,3,...).
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique ID for each entry in the user's movie list

    // @ManyToOne → Many UserMovieList entries can belong to ONE user.
    // Example: One user may have 20 different UserMovieList rows (for different movies).
    @ManyToOne
    private User user;

    // @ManyToOne → Many UserMovieList entries can refer to ONE movie.
    // Example: "Inception" might appear in many users’ lists.
    @ManyToOne
    private Movies movie;

    // "type" field tells which list this entry belongs to:
    // Examples: "watchlist", "favourites", "watched"
    private String type;

    // ---- Constructors ----

    // Default constructor (required by JPA)
    public UserMovieList() {}

    // ---- Getters and Setters ----
    // Needed so JPA and your code can read/write these fields

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public Movies getMovie() {
        return movie;
    }
    public void setMovie(Movies movie) {
        this.movie = movie;
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
}
