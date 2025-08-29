// Package: puts this record in the "model" folder
package com.ma.movie_tracker_app.model;

// A record in Java is a special type of class
// It is immutable (fields can't change once created) and is often used as a DTO.
// Here we define UserMovieListDTO to send user-movie list info to the frontend.
//
// Fields explained:
// - username: the user who owns this list entry
// - tmdbId: the movie's TMDB ID (used by frontend to fetch more info)
// - type: which list this belongs to ("watchlist", "favourites", "watched")
// - title: movie title
// - description: overview text
// - releaseYear: year the movie was released
// - genre: genre string (comma-separated)
// - director: director's name
// - imageUrl: poster image URL
public record UserMovieListDTO(
    String username, 
    Long tmdbId, 
    String type, 
    String title, 
    String description, 
    Integer releaseYear, 
    String genre, 
    String director, 
    String imageUrl
) {}


