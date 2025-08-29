// Package: puts this class in the "model" folder under com.ma.movie_tracker_app
package com.ma.movie_tracker_app.model;

// Import JPA (Jakarta Persistence API) annotations that let us map this class to a database table
import jakarta.persistence.*;

// @Entity tells JPA/Hibernate: "This class represents a table in the database."
// By default, the table name will match the class name ("movies"), but can be customized with @Table.
@Entity 
public class Movies {

    // @Id marks this field as the PRIMARY KEY column of the table
    @Id 
    // @GeneratedValue tells the database to auto-generate values for this column.
    // GenerationType.IDENTITY = the database handles auto-increment (e.g., 1,2,3,...).
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id; // Primary key (unique for each row in the "movies" table)

    // @Column(unique = true) means no two movies can share the same tmdbId in the DB.
    @Column(unique = true)
    private Long tmdbId;

    // Movie title
    private String title;

    // Movie description/overview.
    // @Column(length = 2000) → allows up to 2000 characters in this text column.
    @Column(length = 2000)
    private String description;

    // Release year of the movie (e.g., 2024).
    private Integer releaseYear;

    // Genre(s) of the movie. 
    // @Column(length = 500) → allows up to 500 characters (comma-separated genres).
    @Column(length = 500)
    private String genre;

    // Director’s name (plain string for now).
    private String director;

    // Poster image URL (from TMDB).
    // @Column(length = 500) → allows longer URLs (up to 500 characters).
    @Column(length = 500)
    private String imageUrl;

    // ---- Constructors ----

    // Default constructor (required by JPA).
    public Movies () {}

    // ---- Getters and Setters ----
    // These are needed so JPA and my code can read/write the fields.

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

