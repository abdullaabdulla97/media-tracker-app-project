// Define the MediaCard component. It receives props (inputs) from its parent:
// - media: the movie/show object from TMDB or your backend
// - onAddWatchlist: function to add this item to the user's watchlist
// - onAddFavourites: function to add this item to the user's favourites
// - onAddWatched: function to add this item to the user's watched list
// - onRemoveWatchlist, onRemoveFavourites, onRemoveWatched: functions to remove this item from lists
function MediaCard({
    media,  
    onAddWatchlist, 
    onAddFavourites, 
    onAddWatched,  
    onRemoveWatchlist, 
    onRemoveFavourites, 
    onRemoveWatched
}) {
    // Title can be either "title" (for movies) or "name" (for TV shows)
    const title = media.title || media.name;

    // Date can be release_date (movies), first_air_date (shows), or releaseYear (custom DB field)
    const date = media.release_date 
        ? media.release_date 
        : media.first_air_date 
        ? media.first_air_date 
        : media.releaseYear 
        ? media.releaseYear 
        : "";

    // Image URL: use TMDB poster_path if present, otherwise fallback to media.imageUrl,
    // otherwise an empty string so <img> doesn't break
    const image = media.poster_path 
        ? `https://image.tmdb.org/t/p/w300${media.poster_path}` 
        : media.imageUrl 
        ? media.imageUrl 
        : " ";

    // Build a handler for Watchlist button:
    // If onAddWatchlist is passed, clicking calls add function
    // If onRemoveWatchlist is passed, clicking calls remove function
    // If neither is passed, button won't render
    const handleWatchlist = onAddWatchlist || onRemoveWatchlist 
        ? () => (onAddWatchlist ? onAddWatchlist(media) : onRemoveWatchlist(media)) 
        : null;

    // Same idea for Favourites
    const handleFavourites = onAddFavourites || onRemoveFavourites 
        ? () => (onAddFavourites ? onAddFavourites(media) : onRemoveFavourites(media)) 
        : null;

    // Same idea for Watched
    const handleWatched = onAddWatched || onRemoveWatched 
        ? () => (onAddWatched ? onAddWatched(media) : onRemoveWatched(media)) 
        : null;

    // JSX that defines how the card looks in the UI
    return (
        <div className="media-card"> {/* Card wrapper */}
          
          {/* Thumbnail image with overlay text */}
          <div className="media-thumb">
            <img 
              src={image}        // Poster image URL
              alt={title}        // Alt text for accessibility
              className="media-image" 
            />
            <div className="media-overlay">
                <h4 className="media-title">{title}</h4> {/* Show title */}
                {/* Display first 4 characters of the date (the year) */}
                <span className="media-year">{String(date).slice(0, 4)}</span>
            </div>
          </div>

          {/* Watched button: shows only if a handler is provided */}
          {handleWatched && (
                <button
                    className="media-action-watched" 
                    title={onAddWatched ? "Mark as Watched" : "Unmark Watched"} // Tooltip on hover
                    onClick={handleWatched} // Calls handler when clicked
                    aria-label={onAddWatched ? "Add to Watched" : "Remove from Watched"} // Accessibility label
                >
                    {/* Icon changes depending on whether adding or removing */}
                    <img 
                      src={onAddWatched ? "/images/watched-icon.png" : "/images/remove-icon.png"} 
                      alt={onAddWatched ? "Watched" : "Remove"}
                    />
                </button>
            )}

            {/* Watchlist button: shows only if a handler is provided */}
            {handleWatchlist && (
                <button
                    className="media-action-watchlist"
                    title={onAddWatchlist ? "Add to Watchlist" : "Remove from Watchlist"}
                    onClick={handleWatchlist}
                    aria-label={onAddWatchlist ? "Add to Watchlist" : "Remove from Watchlist"}
                >
                    <img 
                      src={onAddWatchlist ? "/images/watchlist-icon.png" : "/images/remove-icon.png"} 
                      alt={onAddWatchlist ? "Watchlist" : "Remove"}
                    />
                </button>
            )}

            {/* Favourites button: shows only if a handler is provided */}
            {handleFavourites && (
                <button
                    className="media-action-favourite"
                    title={onAddFavourites ? "Add to Favourites" : "Remove from Favourites"}
                    onClick={handleFavourites}
                    type="button" // Explicit type to avoid default "submit" inside forms
                    aria-label={onAddFavourites ? "Add to Favourites" : "Remove from Favourites"}
                >
                    <img 
                      src={onAddFavourites ? "/images/favourite-icon.png" : "/images/remove-icon.png"} 
                      alt={onAddFavourites ? "Favourites" : "Remove"}
                    />
                </button>
            )}
        </div>
        );
    }
    
    export default MediaCard; // Export this component so it can be imported in other files, like EntertainementCategoryList.
