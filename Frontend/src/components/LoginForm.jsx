// Import the API helper that calls the backend login endpoint
import {userLogin} from "../Api";

// Import React core and the useState hook to manage input values + messages
import React, {useState} from "react";

// Import icons from lucide-react for nicer UI (username and password icons)
import {UserRound, LockKeyhole} from "lucide-react";

// Import routing helpers:
// - Link: to navigate declaratively with <a>-like links
// - useNavigate: to programmatically redirect the user after login
// - useLocation: to check where the user came from (so we can redirect back after login)
import {Link, useNavigate, useLocation} from "react-router-dom";

// Define the LoginForm component. It receives one prop from App.jsx:
// - setUsername: a function to update the global username state when login succeeds
function LoginForm({setUsername}) {
    // inputUser holds the value of the username input field
    const [inputUser, setInputUser] = useState("");
    // password holds the value of the password input field
    const [password, setPassword] = useState("");
    // message stores any success/error message to show to the user
    const [message, setMessage] = useState(null);
    // navigate lets us redirect programmatically after successful login
    const navigate = useNavigate();
    // location stores the current route state (so we can redirect back after login)
    const location = useLocation();

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault(); // Prevent the page from refreshing on submit
        setMessage(null);   // Clear any old message
        try {
            // Call the backend login API with entered username + password
            const data = await userLogin(inputUser, password);

            // If API response contains a success message (check case-insensitively)
            if (data.message?.toLowerCase().includes("successful")) {
                // Save the username globally in App state
                setUsername(inputUser);

                // Check if we have a "from" path (where user was before redirect to login)
                // If none, default to home page "/"
                const from = location.state?.from || "/";
                navigate(from); // Redirect user to that page
            } else {
                // If API gave an error message, display it; otherwise show generic failure
                setMessage(data.message || "Login failed.");
            }
        } catch (err) {
            // If API call fails (network error, 401, etc.), show a fallback error message
            setMessage("Login failed, wrong username or password");
        }
    }

    // JSX returned by the component (UI for the login form)
    return (
        <div className="signin-wrapper"> {/* Outer container for styling */}
            <form 
              className="signin-card"   // Card style container for the form
              onSubmit={handleSubmit}   // Call our function when form is submitted
              noValidate                // Disable browser’s built-in validation messages
            >
                <h2 className="signin-title">Sign in</h2>

                {/* Username input with icon */}
                <div className="icon-wrapper">
                    <UserRound className="icon"/> {/* User icon */}
                    <input
                        className="signin-input"
                        value={inputUser}                      // Controlled value = state
                        onChange={(e) => setInputUser(e.target.value)} // Update state on typing
                        placeholder="Username"                 // Placeholder text
                        required                               // HTML5 required validation
                    />
                </div>

                {/* Password input with icon */}
                <div className="icon-wrapper">
                    <LockKeyhole className="icon"/> {/* Lock icon */}
                    <input
                        className="signin-input"
                        type="password"                        // Hide characters as dots
                        value={password}                       // Controlled value
                        onChange={(e) => setPassword(e.target.value)} // Update state on typing
                        placeholder="Password"
                        required
                    />
                </div>

                {/* If we have a message (error), display it */}
                {message && <div className="signin-message">{message}</div>}

                {/* Submit button */}
                <button className="signin-btn" type="submit">Sign in</button>

                {/* Footer with link to Register page */}
                <div className="signin-footer">
                    New here?{" "}
                    <Link to="/register" className="signin-link">Sign Up Now</Link>
                </div>
            </form>
        </div>
       );
    }
    

export default LoginForm; // Export this component so it allows App.jsx to import and use it
