import React, {useEffect, useState} from "react"; // Import React and two hoks: useEffect (run code after render) and useState (store state values) 
import {fetchMe, userLogout} from "./Api"; // Import API helpers: fetchMe (asks backend who is logged in) and userLogout (logs user out) 
import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom"; // Import Router wrapper, Routes container, Route for paths, and useLocation to read the current URL path
import NavBar from "./components/NavBar"; // Import top navigation bar component (logo, search, login/logout button, etc.)
import SideBar from "./components/SideBar"; // Import sidebar component (lets users pick media type and category)
import LoginForm from "./components/LoginForm"; // Import login form page (handles username/password and login)
import RegisterForm from "./components/RegisterForm"; // Import register form page (handles creating an account)
//Import pages that show the user's saved lists (watchlist/ favourites/watched)
import UserWatchList from "./components/UserWatchList";
import UserFavourites from "./components/UserFavourites";
import UserWatched from "./components/UserWatched";
import EntertainementCategoryList from "./components/EntertainementCategoryList"; // Import the homepage list view that shows items by category (e.g., trending)
import SearchResult from "./components/SearchResult"; // Import the search results page (shows results for a query)


function App() { // App component, owns global state and wraps everything in a Router
  const [mediaType, setMediaType] = useState("movie"); // mediaTpe stores whether we are browsing a movie or show (deafult set to movie)
  const [searchQuery, setSearchQuery] = useState(""); // searchQuery stores the text the user typed into the search bar 
  const [username, setUsername] = useState(""); // username stores the currently authenticated username (empty string means "not logged in")
  const [category, setCategory] = useState("trending"); // category stores the selected content category (e.g., trending, popular, top-rated)

  useEffect(() => { // useEffect runs once on mount ([]), asks backend if a user session exists, and sets username accordingly 
    fetchMe() // Calls /api/user/me to check authentication status
      .then((data) => {
        if (data.authenticated) { // If backend responds with authenticated, then it saves the username in state
          setUsername(data.username);
        } else { // If it is not authenticated, clears the username (ensures it is logged out)
          setUsername("");
        }
      })
      .catch(() => setUsername("")); // if it fails (not logged in or network error), it will clear the username
    }, []); // Empty dependy so it will run only once after initial render

  return (
    <Router>  
      <AppLayout /*AppLayout is a child component that handles the whole page layout (NavBar, + SideBar + main content)*/
        mediaType={mediaType} // pass current media type ("movie" / "show")
        setMediaType={setMediaType} // pass setter so children can change media type
        searchQuery={searchQuery} // pass current search text
        setSearchQuery={setSearchQuery} // pass setter so NavBar can update search text
        username={username} //pass current username (empty string if logged out)
        setUsername={setUsername} // pass setter so Login/Register pages can set username
        category={category} // pass selected category (e.g., "trending")
        setCategory={setCategory} // pass setter so SideBar can change category
        onLogout={()=> { // pass a logout handler use by NavBar
          userLogout().finally(() => setUsername(""));
        }}
      />
    </Router>
  );
}

function AppLayout({ // AppLayout is seperated so it can use useLocation (must be inside Router) for sidebar visibilty logic
  mediaType,
  setMediaType,
  searchQuery,
  setSearchQuery,
  username,
  setUsername,
  category,
  setCategory,
  onLogout,
}) {
  const location = useLocation(); // useLocation gives the current URL path (e.g., "/", "/login". "/watchlist", etc. )
  const hideSideBarOn = ["/login", "/register", "/watchlist", "/favourites", "/watched"]; // paths where we do not want to show the sidebar
  const showSideBar = !hideSideBarOn.includes(location.pathname); // If the current path is not in hideSideBarOn, it will then show the sidebar 


 // Render the application (NavBar at the top, optional SideBar on the left and main content on the right)
  return ( 
      <div className="media-app-layout"> {/*Layout wrapper*/}
        <NavBar 
          setMediaType={setMediaType} // lets NavBar switch between "movie" and "show"
          setSearchQuery={setSearchQuery} // lets NavBar update search text from its input
          username={username} // shows user state (e.g., login/logout button)
          onLogout={onLogout} // allows NavBar to trigger logout
        />
        <div className="main-layout"> {/*Main page layout under NavBar*/}
          {showSideBar && ( // Renders the sidebar when showSideBar is true
          <SideBar
            mediaType={mediaType} // tells sidebar what media type is active
            setMediaType={setMediaType} // allows sidebar to switch media type
            category={category} // tells sidebar the current category
            setCategory={setCategory} // allows sidebar to change category
          />
          )}
          <main className={showSideBar ? "" : "no-sidebar"}> {/*Added class no-sidebar to stretch full width when sidebar is hidden*/}
            <Routes>
              <Route
                path="/" // Home route: shows category list page, passing mediaType, category, and username
                element={
                  <EntertainementCategoryList mediaType={mediaType} category={category} username={username}/>
                }
              />
              <Route
                path="/search" // search route: shows search results using current mediaType and searchQuery 
                element={
                  <SearchResult mediaType={mediaType} query={searchQuery} username={username}/>
                }
              />
              <Route path="/login" element={<LoginForm setUsername={setUsername}/>}/> {/*login route: shows loginForm, can setUsername after successful login*/}
              <Route path="/register" element={<RegisterForm setUsername={setUsername}/>} /> {/*register route: shows RegisterFor, can setUsername after successful registration*/}
              {/*User list pages (no sidebar): pass username + current mediaType so components know what to load*/}
              <Route
                path="/watchlist"
                element={<UserWatchList username={username} mediaType={mediaType}/>}
              />
              <Route
                path="/favourites"
                element={<UserFavourites username={username} mediaType={mediaType}/>}
              />
              <Route
                path="/watched"
                element={<UserWatched username={username} mediaType={mediaType}/>}
              />
            </Routes>
            </main>
          </div>
        </div>
    );
  }

export default App; // Export App component so index.js can import and render it
