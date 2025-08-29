// Package: puts this class in the "model" folder of your project
package com.ma.movie_tracker_app.model;

// Import JPA (Jakarta Persistence API) annotations for mapping class → DB table
import jakarta.persistence.*;

// @Entity tells Spring Data JPA: 
// "This class should be mapped to a database table."
// By default, the table will be called "shows" (same as the class name, lowercased).
@Entity 
public class Shows {

    // @Id marks this field as the primary key column in the table.
    @Id 
    // @GeneratedValue(strategy = GenerationType.IDENTITY) → database auto-increments this column.
    // Example: 1, 2, 3... each time a new row is inserted.
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id; // Unique identifier for each show

    // Each show has a TMDB ID, which must be unique (no duplicate rows allowed).
    @Column(unique = true)
    private Long tmdbId;

    // Show title
    private String title;

    // Show description/overview.
    // @Column(length = 2000) → allows longer text (up to 2000 characters).
    @Column(length = 2000)
    private String description;

    // Release year of the show (year when it first aired).
    private Integer releaseYear;

    // Genres of the show (comma-separated string).
    // @Column(length = 500) → allows more text in the column.
    @Column(length = 500)
    private String genre;

    // Director field (optional; may not always apply directly to TV shows).
    private String director;

    // Poster image URL.
    // @Column(length = 500) → allows longer URL strings.
    @Column(length = 500)
    private String imageUrl;

    // ---- Constructors ----

    // Default constructor (required by JPA so it can create objects internally).
    public Shows() {}

    // ---- Getters and Setters ----
    // These let Spring and your app read/write the private fields.

    public Long getId() {
        return id;
    }

    public Long getTmdbId() {
        return tmdbId;
    }
    public void setTmdbId(Long tmdbId) {
        this.tmdbId = tmdbId;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }
    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }

    public String getGenre() {
        return genre;
    }
    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getDirector() {
        return director;
    }
    public void setDirector(String director) {
        this.director = director;
    }

    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
