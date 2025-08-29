// Define the SideBar component.
// Props it receives from AppLayout (in App.jsx):
// - mediaType: tells us if we’re currently browsing "movie" or "tv"
// - category: the currently selected category (e.g., "trending")
// - setCategory: a function to change the selected category when user clicks a button
function SideBar({mediaType, category, setCategory}) {
    return (
        // <aside> is a semantic HTML tag for side content
        <aside className="sidebar-container">
            
            {/* Title shows whether we are browsing Movies or TV Shows */}
            <h3 className="sidebar-title">
              {mediaType === "movie" ? "Movies" : "TV Shows"}
            </h3>
            
            <div className="category-container">
                {/* Section label above the category buttons */}
                <div className="sidebar-section-label">CATEGORIES</div>

                {/* Trending button:
                    - Calls setCategory("trending") when clicked
                    - Disabled if current category is already "trending" */}
                <button
                    className="sidebar-item"
                    onClick={() => setCategory("trending")}
                    disabled={category === "trending"}
                >
                    Trending
                </button>

                {/* Popular button */}
                <button
                    className="sidebar-item"
                    onClick={() => setCategory("popular")}
                    disabled={category === "popular"}
                >
                    Popular
                </button>

                {/* Top Rated button */}
                <button
                    className="sidebar-item"
                    onClick={() => setCategory("toprated")}
                    disabled={category === "toprated"}
                >
                    Top Rated
                </button>
            </div>
        </aside>
    );
}


export default SideBar; // Export the SideBar component so App.jsx can import it
