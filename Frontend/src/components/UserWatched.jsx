// Import React plus hooks
// - useState: store watched items and filter
// - useEffect: fetch items when username/filter changes
import React, {useState, useEffect} from "react";

// Import backend API helpers for fetching/removing watched movies/shows
import { fetchMovieList, fetchShowList, removeMovieList, removeShowList} from "../Api";

// Import the card UI component to render each movie/show with action buttons
import MediaCard from "./MediaCard";

// Define the UserWatched page component.
// Props:
// - username: the currently logged-in user (empty string if not logged in)
function UserWatched({username}) {
    // watched holds the array of watched movies/shows
    const [watched, setWatched] = useState([]);
    // filterType tracks whether the user wants All / Movies / TV Shows
    const [filterType, setFilterType] = useState("All");

    // Load watched items whenever username or filterType changes
    useEffect(() => {
        // If no user logged in, show empty list and stop
        if (!username) {
            setWatched([]);
            return;
        }

        // Async loader function
        async function load() {
            try {
                if (filterType === "All") {
                    // Fetch both movies and shows in parallel
                    const [m, s] = await Promise.all([
                        fetchMovieList(username, "watched"),
                        fetchShowList(username, "watched"),
                    ]);
                    // Merge arrays
                    setWatched([...(m || []), ...(s || [])]);
                } else if (filterType === "Movies") {
                    // Only movies
                    const m = await fetchMovieList(username, "watched");
                    setWatched(m || []);
                } else {
                    // Only TV shows
                    const s = await fetchShowList(username, "watched");
                    setWatched(s || []);
                }
            } catch {
                // On any error (e.g., API down), clear the list safely
                setWatched([]);
            }
        }

        load();
    }, [username, filterType]); // Runs when username logs in/out or filter changes
        

    // Handle removing an item from watched list
    function handleRemove(mediaObject) {
        // Determine if item is a movie (backend object has `movie`) or a show
        const isMovie = !!mediaObject.movie;

        // Safely get TMDB ID regardless of nesting
        const tmdbId = isMovie 
            ? (mediaObject.movie ? mediaObject.movie.tmdbId : mediaObject.tmdbId)
            : (mediaObject.show ? mediaObject.show.tmdbId : mediaObject.tmdbId);

        // Choose correct remove API
        const remove = isMovie 
            ? removeMovieList(username, tmdbId, "watched")
            : removeShowList(username, tmdbId, "watched");

        // Once removal completes, refresh list according to filter
        remove.then(() => {
            if (filterType === "All") {
                Promise.all([
                    fetchMovieList(username, "watched"),
                    fetchShowList(username, "watched"),
                ]).then(([m, s]) => setWatched([...(m || []), ...(s || [])]));
            } else if (filterType === "Movies") {
                fetchMovieList(username, "watched").then(m => setWatched(m || []));
            } else {
                fetchShowList(username, "watched").then(s => setWatched(s || []));
            }
        });
    }

    // JSX rendering
    return (
        <section className="container"> {/* Page wrapper */}
            <h2>Your Watched</h2>

            {/* Filter dropdown */}
            <div className="filter-section">
                <label htmlFor="filter">Filter:</label>
                <select
                    id="filter"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)} // Update on change
                >
                   <option>All</option>
                   <option>Movies</option>
                   <option>TV Shows</option>
                </select>
            </div>

            {/* If no watched items, show a message; else show the grid */}
            {watched.length === 0 ? (
                <div className="description">Nothing added in your watched yet.</div>
            ) : (
                <div className="entertainement-grid">
                    {watched.map(mediaObject => (
                        <MediaCard
                          key={mediaObject.id} // Unique React key
                          media={mediaObject.movie || mediaObject.show || mediaObject} // Actual object
                          mediaType={mediaObject.movie ? "movie" : "tv"} // Type
                          // Pass the remove handler; MediaCard will display a "remove" button for watched
                          onRemoveWatched={() => handleRemove(mediaObject)}
                        />
                    ))}
                </div>
              )}
          </section>
          );
        }
        
        export default UserWatched; // Export components so App.jsx can import it
