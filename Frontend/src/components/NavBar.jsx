// Import routing helpers from react-router-dom
// - Link: creates navigation links without reloading the page
// - useNavigate: lets us redirect programmatically after search
import {Link, useNavigate} from "react-router-dom";

// Import React core and the useState hook (to manage input text + menu toggle state)
import React, {useState} from "react";

// Import the "Menu" (hamburger) icon from lucide-react for mobile toggle button
import {Menu, X} from "lucide-react";

// Define the NavBar component. It receives props from AppLayout (in App.jsx):
// - username: current logged-in username (empty if not logged in)
// - setSearchQuery: function to update the global search query
// - setMediaType: function to update whether we’re browsing "movie" or "tv"
// - onLogout: function to log out the user
function NavBar ({username, setSearchQuery, setMediaType, onLogout}) {
    // input stores the text typed into the search box
    const [input, setInput] = useState("");
    // navigate lets us programmatically redirect (e.g., to /search when search submitted)
    const navigate = useNavigate();

    // navOpen tracks whether the mobile navigation menu is open (for small screens)
    const [navOpen, setNavOpen] = useState(false);


    // Handle the search form submit
    function handleSearch(e) {
        e.preventDefault();          // Prevent full page reload
        setSearchQuery(input);       // Save the query into global state
        navigate("/search");         // Redirect user to the /search route
        setNavOpen(false);           // Closes the menu after search
    }

    // Closes the menu when clicking a link (for mobile)
    const closeMenu = () => setNavOpen(false);

    // JSX returned: the navigation bar structure
    return (
        <nav className="navbar">
            {/* Search form */}
            <form onSubmit={handleSearch}>
                <img 
                  src="/images/search-icon.png" 
                  alt="search icon" 
                  className="navbar-search-icon"
                />
                <input
                    type="text"
                    placeholder="Search Movies or TV shows"
                    value={input}                          // Controlled value from state
                    onChange={e => setInput(e.target.value)} // Update state on typing
                />
            </form>

            {/* Navigation links container.
                navOpen toggles "is-open" class for mobile menu */}
            <div className={`navbar-links ${navOpen ? "is-open" : ""}`}>
                {/* Movies link: also sets mediaType="movie" */}
                <Link to="/" className="navbar-movies" onClick={() => { setMediaType("movie"); closeMenu(); }}>
                  Movies
                </Link>
                {/* TV Shows link: also sets mediaType="tv" */}
                <Link to="/" className="navbar-tv" onClick={() => { setMediaType("tv"); closeMenu(); }}>
                  TV Shows
                </Link>
                {/* User’s lists (require login, but links are always visible) */}
                <Link to="/watchlist" className="navbar-watchlist" onClick={closeMenu}>Watchlist</Link>
                <Link to="/favourites" className="navbar-favourites" onClick={closeMenu}>Favourites</Link>
                <Link to="/watched" className="navbar-watched" onClick={closeMenu}>Watched</Link>
            
                {/* If username is truthy (logged in) show profile + logout menu */}
                {username ? (
                    <div className="navbar-user" tabIndex={0}> {/* tabIndex makes it focusable */}
                        <span className="navbar-user-name">{username}</span>
                        <img 
                          src="/images/profile-icon.png" 
                          alt="profile icon" 
                          className="navbar-profile-icon"
                        />
                        <img 
                          src="/images/dropdown-icon.png" 
                          alt="dropdown icon" 
                          aria-hidden="true" // Hidden from screen readers
                          className="navbar-dropdown-icon"
                        />
                        {/* Dropdown menu for the user */}
                        <div className="navbar-user-menu" role="menu">
                            {/* Logout button calls the onLogout function passed from App */}
                            <button 
                              className="navbar-menu-item" 
                              onClick={() => { onLogout(); closeMenu();}} 
                              role="menuitem"
                            >
                              Sign Out
                            </button>
                        </div>
                    </div>
                ) : (
                  // If no user is logged in, show Sign In / Sign Up links
                  <>
                    <Link to="/login" className="navbar-login" onClick={closeMenu}>SIGN IN</Link>
                    <Link to="/register" className="navbar-register" onClick={closeMenu}>SIGN UP</Link>
                  </>
                )}
            </div>

            {/* Mobile "burger" button to toggle navOpen */}
            <button
                className={`navbar-burger ${navOpen ? "is-active" : ""}`} // Changes the style when active
                type="button"
                aria-label="Toggle menu"                    // Accessibility label
                aria-expanded={navOpen ? "true" : "false"}  // Accessibility state
                onClick={() => setNavOpen(v => !v)}         // Toggle navOpen on click
            >
                {navOpen ? <X size={22}/> : <Menu size={22}/>} {/* Lucide-react Menu (hamburger) icon and X icon when closing the menu */}
            </button>
        </nav>
    );
}


export default NavBar; // Export this component so AppLayout in App.jsx can import
