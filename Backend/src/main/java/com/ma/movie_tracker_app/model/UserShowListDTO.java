// Package: groups this record inside the "model" folder
package com.ma.movie_tracker_app.model;

// It is perfect for DTOs (Data Transfer Objects) because:
//   - It is immutable (fields can’t be changed after creation).
//   - It auto-generates constructor, getters, equals, hashCode, and toString.
//   - Less boilerplate compared to a normal class.
//
// This DTO represents one entry from a user's show list.
// Fields explained:
// - username: the user who owns this list entry
// - tmdbId: the show's TMDB ID (unique identifier from TMDB)
// - type: which list it belongs to ("watchlist", "favourites", or "watched")
// - title: the title of the show
// - description: overview text of the show
// - releaseYear: the year the show first aired
// - genre: genre(s) of the show (as a string, often comma-separated)
// - director: director or main creator (optional field in shows)
// - imageUrl: poster image URL
public record UserShowListDTO(
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
