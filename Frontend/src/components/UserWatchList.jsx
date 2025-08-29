// Import React plus hooks for state and side effects
// - useState: store the watchlist items and current filter
// - useEffect: fetch data whenever username/filter changes
import React, {useState, useEffect} from "react";

// Import backend API helpers:
// - fetchMovieList / fetchShowList: get items from the user's lists
// - removeMovieList / removeShowList: remove an item from a list
import { fetchMovieList, fetchShowList, removeMovieList, removeShowList} from "../Api";

// Import the presentational card that displays a single movie/show with action buttons
import MediaCard from "./MediaCard";

// Define the page component for the user's Watchlist.
// Props:
// - username: the current logged-in user (empty string if logged out)
function UserWatchList({username}) {
    // watchlist: array of items to display (can be movies and/or TV shows)
    const [watchlist, setWatchlist] = useState([]);
    // filterType: which subset to show ("All", "Movies", "TV Shows")
    const [filterType, setFilterType] = useState("All");

    // Load the watchlist whenever the username changes (login/logout) or the filter changes
    useEffect(() => {
        // If no user is logged in, clear the list and stop
        if (!username) {
            setWatchlist([]);
            return;
        }

        // Define an async function so we can await API calls
        async function load() {
            try {
                // If user wants to see ALL items (movies + TV)
                if (filterType === "All") {
                    // Fetch both lists in parallel for speed
                    const [m, s] = await Promise.all([
                        fetchMovieList(username, "watchlist"), // user's movie watchlist
                        fetchShowList(username, "watchlist"),  // user's TV watchlist
                    ]);
                    // Merge the arrays (fallback to empty arrays if API returns null/undefined)
                    setWatchlist([...(m || []), ...(s || [])]);
                // If user wants only Movies
                } else if (filterType === "Movies") {
                    const m = await fetchMovieList(username, "watchlist");
                    setWatchlist(m || []);
                // Otherwise, user wants only TV Shows
                } else {
                    const s = await fetchShowList(username, "watchlist");
                    setWatchlist(s || []);
                }
            } catch {
                // On any error (network/server), show a safe empty list
                setWatchlist([]);
            }
        }

        // Execute the loader
        load();
    }, [username, filterType]); // Re-run effect when username or filter changes
        

    // Remove an item (movie or show) from the watchlist
    function handleRemove(mediaObject) {
        // Determine if the entry is a MOVIE or a TV SHOW.
        // Many backends return a wrapper object like { id, movie: {...} } or { id, show: {...} }.
        const isMovie = !!mediaObject.movie;

        // Extract the TMDB ID regardless of nesting shape:
        // - If movie: prefer mediaObject.movie.tmdbId, otherwise mediaObject.tmdbId
        // - If show : prefer mediaObject.show.tmdbId, otherwise mediaObject.tmdbId
        const tmdbId = isMovie
            ? (mediaObject.movie ? mediaObject.movie.tmdbId : mediaObject.tmdbId)
            : (mediaObject.show ? mediaObject.show.tmdbId : mediaObject.tmdbId);

        // Choose the correct removal API based on the type
        const remove = isMovie
            ? removeMovieList(username, tmdbId, "watchlist")
            : removeShowList(username, tmdbId, "watchlist");

        // Once the server confirms removal, it refreshes the list matching the current filter
        remove.then(() => {
            if (filterType === "All") {
                // Re-fetch both lists then merge
                Promise.all([
                    fetchMovieList(username, "watchlist"),
                    fetchShowList(username, "watchlist"),
                ]).then(([m, s]) => setWatchlist([...(m || []), ...(s || [])]));
            } else if (filterType === "Movies") {
                // Re-fetch just movies
                fetchMovieList(username, "watchlist").then(m => setWatchlist(m || []));
            } else {
                // Re-fetch just shows
                fetchShowList(username, "watchlist").then(s => setWatchlist(s || []));
            }
        });
    }

    // Render the page UI
    return (
        <section className="container"> {/* Standard page container */}
            <h2>Your Watchlist</h2> {/* Page title */}

            {/* Filter dropdown to switch between All / Movies / TV Shows */}
            <div className="filter-section">
                <label htmlFor="filter">Filter:</label>
                <select
                    id="filter"
                    value={filterType}                         // Controlled select value 
                    onChange={(e) => setFilterType(e.target.value)} // Update filter state 
                >
                   <option>All</option>
                   <option>Movies</option>
                   <option>TV Shows</option>
                </select>
            </div>

            {/* If there are no items, show a friendly empty-state message */}
            {watchlist.length === 0 ? (
                <div className="description">Nothing added in your watchlist yet.</div>
            ) : (
                // Otherwise show a grid of cards
                <div className="entertainement-grid">
                    {watchlist.map(mediaObject => (
                        <MediaCard
                          key={mediaObject.id} // Unique key for React list rendering
                          // Pass the actual media payload:
                          // - prefer nested movie/show object, fall back to flattened object
                          media={mediaObject.movie || mediaObject.show || mediaObject}
                          // Tell the card what type it is
                          mediaType={mediaObject.movie ? "movie" : "tv"}
                          // Provide a remove handler; MediaCard will render the appropriate "remove" button
                          onRemoveWatchlist={() => handleRemove(mediaObject)}
                        />
                    ))}
                </div>
              )}
          </section>
          );
        }
        
        export default UserWatchList; // Export this component so App.jsx can import it
