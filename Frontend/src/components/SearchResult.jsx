// Import React plus hooks:
// - useState: to store component state (results, page, filter)
// - useEffect: to run side effects (fetching data) when inputs change
import React, {useState, useEffect} from "react";

// Import the TMDB search helper to query movies/TV by text
import {fetchSearch} from "../tmdb";

// Import backend helpers to add items to the user's lists (watchlist/favourites/watched)
import { addMovieList, addShowList } from "../Api";

// Import routing hooks for programmatic navigation and to read current path
import {useNavigate, useLocation} from "react-router-dom";

// Card component that renders each search result item and action buttons
import MediaCard from "./MediaCard";

// Define the SearchResult page component.
// Props:
// - mediaType: current mode ("movie" or "tv") — used when the filter is "All" to pick defaults if needed
// - query: the search text to look up on TMDB
// - username: logged-in username (empty string if not logged in)
function SearchResult({mediaType, query, username}) {
    // mediaList will contain the array of results to display (movies and/or TV)
    const [mediaList, setMediaList] = useState([]);
    // page tracks the current page for pagination (TMDB supports many pages)
    const [page, setPage] = useState(1);
    // filterType lets the user switch between "All", "Movies", "TV Shows"
    const [filterType, setFilterType] = useState("All");
    // totalPages is how many pages the current search has (used to enable/disable page buttons)
    const [totalPages, setTotalPages] = useState(0);
    // navigate allows redirecting (e.g., to /login if user tries to add without being logged in)
    const navigate = useNavigate();
    // location gives current path so we can redirect back here after login
    const location = useLocation();

    // Whenever mediaType, query, or filter changes, reset pagination back to the first page
    useEffect(() => {
        setPage(1);
    }, [mediaType, query, filterType]);

    // Small helper that figures out an item's type:
    // - use m.media_type if TMDB provided it (e.g., "movie" or "tv")
    // - else infer: if it has a "title" it's a movie, otherwise assume tv
    const itemIs = (m) => m.media_type || (m.title ? "movie" : "tv");

    // Fetch search results whenever filterType, query, or page changes
    useEffect(() => {
        // If the search box is empty, clear results and do nothing
        if (!query) {
            setMediaList([]);
            setTotalPages(0);
            return;
        }

        // IIFE so we can use async/await inside useEffect
        (async () => {
            try {
                // If the user only wants Movies
                if (filterType === "Movies") {
                    const data = await fetchSearch("movie", query, page); // Movie search
                    setMediaList(data?.results || []);                    // Results (default [])
                    setTotalPages(data?.total_pages || 0);                // Total pages (default 0)

                // If the user only wants TV Shows
                } else if (filterType === "TV Shows") {
                    const data = await fetchSearch("tv", query, page);    // TV search
                    setMediaList(data?.results || []);
                    setTotalPages(data?.total_pages || 0);

                // If the user wants All
                } else {
                    // Fetch both in parallel for speed
                    const [m, t] = await Promise.all([
                        fetchSearch("movie", query, page),
                        fetchSearch("tv", query, page),
                    ]);
                    // Merge the two lists (movies first, then tv)
                    const merged = [...(m?.results || []), ...(t?.results || [])];
                    setMediaList(merged);
                    // Use the larger of the two page counts for the pager
                    setTotalPages(Math.max(m?.total_pages || 0, t?.total_pages || 0));
                }
            } catch {
                // On any error, fall back to empty results so UI stays stable
                setMediaList([]);
                setTotalPages(0);
            }
        })();
    }, [filterType, query, page]); // Dependencies that trigger a new fetch

    // When user clicks "Add to Watchlist" on a card
    function handleAddWatchlist(media) {
        // Must be logged in; otherwise redirect to /login and remember current page
        if (!username) {
            return navigate("/login", {state: {from: location.pathname}});
        }
        // Normalize TMDB fields into your backend's expected object shape
        const entertainementObject = {
            title: media.title || media.name, // movies: title, tv: name
            // Try release_date (movie) then first_air_date (tv); parse the year (first 4 chars). If none, null.
            releaseYear: media.release_date ? parseInt(media.release_date.slice(0, 4)) : (media.first_air_date ? parseInt(media.first_air_date.slice(0, 4)) : null),
            // genre_ids is an array of numbers from TMDB; store as comma-separated string for simplicity
            genre: media.genre_ids ? media.genre_ids.join(",") : "",
            // overview is the TMDB description
            description: media.overview,
            // Not available in this search endpoint; can be filled via a details/credits call later
            director: "",
            // Build a full poster URL (w300) if we have poster_path, else empty string
            imageUrl : media.poster_path ? `https://image.tmdb.org/t/p/w300${media.poster_path}` : "",
        };
        // Decide movie vs tv endpoint based on this specific item's type
        if (itemIs(media) === "movie") {
            addMovieList(username, media.id, "watchlist", entertainementObject);
        } else {
            addShowList(username, media.id, "watchlist", entertainementObject);
        }
    }
    
    // When user clicks "Add to Favourites"
    function handleAddFavourites(media) {
        if (!username) {
            return navigate("/login", {state: {from: location.pathname}});
        }
        const entertainementObject = {
            title: media.title || media.name,
            releaseYear: media.release_date ? parseInt(media.release_date.slice(0, 4)) : (media.first_air_date ? parseInt(media.first_air_date.slice(0, 4)) : null),
            genre: media.genre_ids ? media.genre_ids.join(",") : "",
            description: media.overview,
            director: "",
            imageUrl : media.poster_path ? `https://image.tmdb.org/t/p/w300${media.poster_path}` : "",
        };
        if (itemIs(media) === "movie") {
            addMovieList(username, media.id, "favourites", entertainementObject);
        } else {
            addShowList(username, media.id, "favourites", entertainementObject);
        }
    }
    
    // When user clicks "Add to Watched"
    function handleAddWatched(media) {
        if (!username) {
            return navigate("/login", {state: {from: location.pathname}});
        }
        const entertainementObject = {
            title: media.title || media.name,
            releaseYear: media.release_date ? parseInt(media.release_date.slice(0, 4)) : (media.first_air_date ? parseInt(media.first_air_date.slice(0, 4)) : null),
            genre: media.genre_ids ? media.genre_ids.join(",") : "",
            description: media.overview,
            director: "",
            imageUrl : media.poster_path ? `https://image.tmdb.org/t/p/w300${media.poster_path}` : "",
        };
        if (itemIs(media) === "movie") {
            addMovieList(username, media.id, "watched", entertainementObject);
        } else {
            addShowList(username, media.id, "watched", entertainementObject);
        }
    }

    // Render the page UI
    return (
        <section className="container"> {/* Main container for the search page */}
            <h2>Search Results</h2>

            {/* Filter controls: All / Movies / TV Shows */}
            <div className="filter-section">
                <label htmlFor="filter">Filter: </label>
                <select
                    id="filter"
                    value={filterType}                         // Controlled select value
                    onChange={(e) => setFilterType(e.target.value)} // Update state on change
                >
                    <option value="All">All</option>
                    <option value="Movies">Movies</option>
                    <option value="TV Shows">TV Shows</option>
                </select>
            </div>

            {/* If there are no results, show a friendly message */}
            {mediaList.length === 0 ? (
                <div className="description">Not Found.</div>
            ) : (
              // Otherwise render the grid and the pagination
              <>
                {/* Grid of result cards */}
                <div className="entertainement-grid">
                    {mediaList.map((media) => (
                        <MediaCard 
                          key={`${itemIs(media)}-${media.id}`} // Stable key combining type + id
                          media={media}                         // The TMDB item object
                          mediaType={itemIs(media)}             // Pass this item’s actual type
                          onAddWatchlist={handleAddWatchlist}   // Add to watchlist handler
                          onAddFavourites={handleAddFavourites} // Add to favourites handler
                          onAddWatched={handleAddWatched}       // Add to watched handler
                        />
                    ))}
                </div>
                
                {/* Pagination controls */}
                <div className="entertainement-page">
                    {/* Go to previous page but never below 1 */}
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <=1}
                    >
                        ⬅ Previous page
                    </button>

                    {/* Display current page / total pages (fall back to 1 if totalPages=0) */}
                    <span className="entertainement-page-status">
                        Page {page} / {totalPages || 1}
                    </span>

                    {/* Go to next page but never exceed totalPages */}
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
                        disabled={page >= totalPages}
                    >
                        Next page ➡
                    </button>
                </div>
              </>
            )}
        </section>
    );
}


export default SearchResult; // Export component so App.jsx (or others) can import it
