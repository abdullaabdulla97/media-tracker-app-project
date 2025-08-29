// Import React plus two hooks:
// - useState: to store favourites and the selected filter
// - useEffect: to load data when username/filter changes
import React, {useState, useEffect} from "react";

// Import backend API helpers to fetch/remove items from the user's lists
import { fetchMovieList, fetchShowList, removeMovieList, removeShowList} from "../Api";

// Import the card UI component that renders one item and exposes add/remove buttons
import MediaCard from "./MediaCard";

// Define the UserFavourites page component.
// Props:
// - username: the currently logged-in user's name (empty string if not logged in)
function UserFavourites({username}) {
    // favourites holds the current list of favourited items (movies and/or shows)
    const [favourites, setFavourites] = useState([]);
    // filterType controls whether we show All / Movies / TV Shows
    const [filterType, setFilterType] = useState("All");

    // Load favourites whenever the username or filter changes
    useEffect(() => {
        // If no user is logged in, show an empty list and stop
        if (!username) {
            setFavourites([]);
            return; // Do not proceed to fetch
        }

        // Define an async loader so we can use await
        async function load() {
            try {
                // When filter is "All", fetch movies and shows in parallel
                if (filterType === "All") {
                    // Promise.all runs both requests simultaneously for speed
                    const [m, s] = await Promise.all([
                        fetchMovieList(username, "favourites"), // User's favourite MOVIES
                        fetchShowList(username, "favourites"),  // User's favourite TV SHOWS
                    ]);
                    // Merge the arrays (fallback to empty arrays if either is null/undefined)
                    setFavourites([...(m || []), ...(s || [])]);
                // When filter is "Movies" only, fetch just favourite movies
                } else if (filterType === "Movies") {
                    const m = await fetchMovieList(username, "favourites");
                    setFavourites(m || []);
                // Otherwise, "TV Shows": fetch just favourite shows
                } else {
                    const s = await fetchShowList(username, "favourites");
                    setFavourites(s || []);
                }
            } catch {
                // On any error (network, server), show a safe empty list
                setFavourites([]);
            }
        }

        // Execute the loader
        load();
    }, [username, filterType]); // Re-run when username changes (login/logout) or the filter changes
        

    // Handle removing an item (movie or show) from favourites
    function handleRemove(mediaObject) {
        // Determine if the thing we’re removing is a MOVIE or a TV SHOW.
        // The backend payloads looks like:
        //   { id, movie: {..., tmdbId}, ... }  OR  { id, show: {..., tmdbId}, ... }
        const isMovie = !!mediaObject.movie; // true if there's a "movie" field

        // Grab the TMDB ID regardless of whether this is a movie or a show.
        // Some items may flatten tmdbId at the root; handle both shapes safely.
        const tmdbId = isMovie
            ? (mediaObject.movie ? mediaObject.movie.tmdbId : mediaObject.tmdbId)
            : (mediaObject.show ? mediaObject.show.tmdbId : mediaObject.tmdbId);

        // Choose the correct API removal function based on type (movie vs show)
        const remove = isMovie
            ? removeMovieList(username, tmdbId, "favourites") // Remove MOVIE from favourites
            : removeShowList(username, tmdbId, "favourites"); // Remove SHOW from favourites

        // After the removal API resolves, refresh the list according to current filter
        remove.then(() => {
            if (filterType === "All") {
                // Re-fetch both lists and merge again
                Promise.all([
                    fetchMovieList(username, "favourites"),
                    fetchShowList(username, "favourites"),
                ]).then(([m, s]) => setFavourites([...(m || []), ...(s || [])]));
            } else if (filterType === "Movies") {
                // Re-fetch just movies
                fetchMovieList(username, "favourites").then(m => setFavourites(m || []));
            } else {
                // Re-fetch just shows
                fetchShowList(username, "favourites").then(s => setFavourites(s || []));
            }
        });
    }

    // Render the page UI
    return (
        <section className="container"> {/* Outer container for consistent page padding/width */}
            <h2>Your Favourites</h2> {/* Page title */}

            {/* Filter controls to show All / Movies / TV Shows */}
            <div className="filter-section">
                <label htmlFor="filter">Filter:</label>
                <select
                    id="filter"
                    value={filterType} // Controlled value from state
                    onChange={(e) => setFilterType(e.target.value)} // Update when user selects
                >
                   <option>All</option>
                   <option>Movies</option>
                   <option>TV Shows</option>
                </select>
            </div>

            {/* If the user has no favourites, show a friendly message.
                Otherwise, render the grid of cards. */}
            {favourites.length === 0 ? (
                <div className="description">Nothing added in your favourites yet.</div>
            ) : (
                <div className="entertainement-grid">
                    {/* Map over the favourites and render a MediaCard for each item. 
                       Each element from the backend might be shaped like:
                       { id, movie: {...} }  OR  { id, show: {...} }  OR  a flattened object.
                       We choose media = movie || show || flattened object.
                    */}
                    {favourites.map(mediaObject => (
                        <MediaCard
                          key={mediaObject.id} // Unique key for React list rendering
                          media={mediaObject.movie || mediaObject.show || mediaObject} // The actual media payload
                          mediaType={mediaObject.movie ? "movie" : "tv"} // Tell card which type it is
                          onRemoveFavourites={() => handleRemove(mediaObject)} // Call our removal with the full object; MediaCard will display a "remove" button for favourites
                        />
                    ))}
                </div>
              )}
          </section>
          );
        }


export default UserFavourites; // Export this page component so App.jsx can import it
