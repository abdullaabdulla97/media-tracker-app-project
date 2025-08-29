// Import React along with two hooks: useEffect: run side-effects (fetching data) after render or when dependencies change, useState: store local state values in a function component
import React, {useEffect, useState} from "react";

// Import TMDB data-fetch helpers for different categories (trending/popular/top-rated)
import {fetchTrending, fetchPopular, fetchTopRated,} from "../tmdb";

// Import API functions to add movies/shows to user lists (watchlist/favourites/watched)
import {addMovieList, addShowList} from "../Api";

// Import React Router hooks: useNavigate: to programmatically change pages (redirect), useLocation: to read the current URL (useful to remember where the user came from)
import {useNavigate, useLocation} from "react-router-dom";

// Import a presentational component that displays a single movie/show card with buttons
import MediaCard from "./MediaCard";

// Define the component. It receives three props from the parent (App/AppLayout):
// - mediaType: "movie" or "show" (used to decide which TMDB endpoints to hit)
// - category: which list to show ("trending", "popular", "toprated")
// - username: the current logged-in user (empty string "" if not logged in)
function EntertainementCategoryList ({mediaType, category, username}) {
    // mediaList will hold an array of movie/show objects returned by TMDB
    const [mediaList, setMediaList] = useState([]);
    // page tracks the current page number for pagination (TMDB supports many pages)
    const [page, setPage] = useState(1);
    // totalPages tracks how many pages are available for the current query
    const [totalPages, setTotalPages] = useState(1);
    // navigate lets us redirect the user (e.g., to /login if they try to add without being logged in)
    const navigate = useNavigate();
    // location gives us the current path so we can remember it and return after login
    const location = useLocation();

    // Whenever mediaType or category changes (e.g., user switches from "movie" to "show"
    // or from "trending" to "popular"), reset the current page back to 1.
    useEffect(() => {
        setPage(1); // Reset pagination so we start at the first page for a new filter
    }, [mediaType, category]); // Re-run this effect whenever either value changes

    // This effect loads data from TMDB whenever any of these change:
    // - mediaType ("movie"/"tv"),
    // - category ("trending"/"popular"/"toprated"),
    // - page (pagination).
    useEffect(() => {
        // Define an async function inside the effect to use await cleanly
        async function load() {
            let data; // Will hold the response from TMDB
            // Decide which TMDB endpoint to call based on the current category
            if (category === "trending") {
                // For trending, we also pass "week" timeWindow and the current page
                data = await fetchTrending(mediaType, "week", page);
            } else if (category === "popular") {
                data = await fetchPopular(mediaType, page);
            } else if (category === "toprated") {
                data = await fetchTopRated(mediaType, page);
            } else {
                // If category is unknown, return an empty result set safely
                data = {results: [], total_pages: 1};
            }
            // Update local state with results and total page count
            setMediaList(data.results);
            setTotalPages(data.total_pages);
        }
        // Call the async loader; if it fails (network, API error), show safe defaults
        load().catch(() => {
            setMediaList([]);   // Empty list on error
            setTotalPages(1);   // Reset to 1 page on error
        });
    }, [mediaType, category, page]); // Re-run when any of these inputs change

    // Handle adding an item to the user's WATCHLIST
    function handleAddWatchlist(media) {
        // If the user is not logged in (username is falsy/empty), redirect to /login
        if (!username) {
            // We pass along { state: { from: currentPath } } so Login can redirect back here after success
            return navigate("/login", {state: {from: location.pathname}});
        }
        // Built a normalized object for the backend from TMDB media fields
        const entertainementObject = {
                // TMDB uses "title" for movies and "name" for TV Shows
                title: media.title || media.name,
                // Parse the first 4 chars of release_date or first_air_date to get the year (or null if missing)
                releaseYear: media.release_date ? parseInt(media.release_date.slice(0, 4)) : (media.first_air_date ? parseInt(media.first_air_date.slice(0, 4)) : null),
                // genre_ids is an array of numeric IDs; join into a comma-separated string for storage
                genre: media.genre_ids ? media.genre_ids.join(",") : "",
                // overview is the TMDB summary/description
                description: media.overview,
                // director isn't present in these list endpoints; left it as empty string as placeholder
                director: "",
                // poster_path is a relative path; build a full image URL (w300 width for smaller card images)
                imageUrl : media.poster_path ? `https://image.tmdb.org/t/p/w300${media.poster_path}` : "",
        };
        // Decide which backend endpoint to call based on mediaType
        if (mediaType === "movie") {
            // Add a MOVIE to the user's "watchlist"
            addMovieList(username, media.id, "watchlist", entertainementObject);
        } else {
            // Add a SHOW to the user's "watchlist"
            addShowList(username, media.id, "watchlist", entertainementObject);
        }
    }

    // Handle adding an item to the user's FAVOURITES
    function handleAddFavourites(media) {
        // Require login; otherwise route to /login and remember where we came from
        if (!username) {
            return navigate("/login", {state: {from: location.pathname}});
        }
        // Built the same normalized payload as above
        const entertainementObject = {
                title: media.title || media.name,
                releaseYear: media.release_date ? parseInt(media.release_date.slice(0, 4)) : (media.first_air_date ? parseInt(media.first_air_date.slice(0, 4)) : null),
                genre: media.genre_ids ? media.genre_ids.join(",") : "",
                description: media.overview,
                director: "",
                imageUrl : media.poster_path ? `https://image.tmdb.org/t/p/w300${media.poster_path}` : "",
        };
        // Call movie vs show version depending on mediaType
        if (mediaType === "movie") {
            addMovieList(username, media.id, "favourites", entertainementObject);
        } else {
            addShowList(username, media.id, "favourites", entertainementObject);
        }
    }

     // Handle adding an item to the user's WATCHED list
     function handleAddWatched(media) {
        // Require login; if not, send to /login with a pointer back
        if (!username) {
            return navigate("/login", {state: {from: location.pathname}});
        }
        // Normalize payload for backend consumption
        const entertainementObject = {
                title: media.title || media.name,
                releaseYear: media.release_date ? parseInt(media.release_date.slice(0, 4)) : (media.first_air_date ? parseInt(media.first_air_date.slice(0, 4)) : null),
                genre: media.genre_ids ? media.genre_ids.join(",") : "",
                description: media.overview,
                director: "",
                imageUrl : media.poster_path ? `https://image.tmdb.org/t/p/w300${media.poster_path}` : "",
        };
        // Send to the right endpoint based on mediaType
        if (mediaType === "movie") {
            addMovieList(username, media.id, "watched", entertainementObject);
        } else {
            addShowList(username, media.id, "watched", entertainementObject);
        }
    }

    // Render the main section for this page
    return (
        <section> {/* Semantic section wrapper for this page */}
            <div className="entertainement-container"> {/* Outer container for layout/styling */}
                    {/* If there are no items in mediaList, show "Not Found." */}
                    {mediaList.length === 0 ? (
                        <div>Not Found.</div>
                    ) : (
                     // Otherwise, show the grid of cards and the pagination controls
                     <>
                     {/* Grid wrapper for the list of media cards */}
                     <div className="entertainement-grid">
                        {/* Loops through mediaList and render a MediaCard for each item */}
                        {mediaList.map((media) => (
                            <MediaCard
                              key={media.id}                 // React key for list rendering
                              media={media}                  // The TMDB item object (movie/show)
                              mediaType={mediaType}          // So the card knows if it's movie or show
                              onAddWatchlist={handleAddWatchlist}   // Callback for "Add to Watchlist"
                              onAddFavourites={handleAddFavourites} // Callback for "Add to Favourites"
                              onAddWatched={handleAddWatched}       // Callback for "Add to Watched"
                            />
                            ))}
                    </div>

                  {/* Pagination controls: previous/next buttons and current page indicator */}
                  <div className="entertainement-page">
                    {/* Previous page button: decrease page but never below 1 */}
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <=1}>
                            ⬅ Previous page
                        </button>
                        {/* Show current page and total pages */}
                        <span className="entertainement-page-status">
                            Page {page} / {totalPages}
                        </span>
                        {/* Next page button: increase page but never above totalPages */}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}>
                                Next page ➡
                            </button>
                        </div>
                        </>
                      )}
                </div>
            </section>
            );
        }

// Export the component so it can be imported by other files
export default EntertainementCategoryList;
