// Import the API helper that calls the backend registration endpoint
import {userRegistration} from "../Api";
// Import React core and the useState hook to manage form input + messages
import React, {useState} from "react";
// Import icons from lucide-react for nicer UI (username + password icons)
import {UserRound, LockKeyhole} from "lucide-react";
// Import routing helpers:
// - Link: for a link to the Login page
// - useNavigate: to programmatically redirect after successful signup
import {Link, useNavigate} from "react-router-dom";

// Define the RegisterForm component. It receives one prop from App.jsx:
// - setUsername: function to update global username state when registration succeeds (auto sign-in)
function RegisterForm({setUsername}) {
    // inputUser holds the username typed by the user
    const [inputUser, setInputUser] = useState("");
    // password holds the password typed by the user
    const [password, setPassword] = useState("");
    // confirm holds the second password field (confirmation)
    const [confirm, setConfirm] = useState("");
    // message holds any validation or error text to show in the UI
    const [message, setMessage] = useState(null);
    // navigate lets us redirect after successful registration
    const navigate = useNavigate();

    // Handle the form submit event
    async function handleSubmit(e) {
        e.preventDefault();      // Prevent the page from reloading on form submit
        setMessage(null);        // Clear any previous message

        // Client-side validation (quick checks before hitting the server)

        // If both username and password are missing
        if (!inputUser.trim() && !password) {
            setMessage("Username and password are required.");
            return; // Stop here; don't call the API
        }
        // If username missing
        if (!inputUser.trim()) {
            setMessage("Username is required.");
            return;
        }
        // If password missing
        if (!password) {
            setMessage("Password is required.");
            return;
        }
        // Username length must be between 6 and 11 (inclusive)
        if (inputUser.trim().length < 6 || inputUser.trim().length > 11) {
            setMessage("Username must be between 6 and 11 characters.");
            return;
        }

        // Password must be 6–11 chars, include at least:
        // - one lowercase letter
        // - one uppercase letter
        // - one number
        // Regex breakdown:
        // ^                 start of string
        // (?=.*[a-z])       at least one lowercase
        // (?=.*[A-Z])       at least one uppercase
        // (?=.*\d)          at least one digit
        // [A-Za-z\d]{6,11}  only letters/numbers, length 6-11
        // $                 end of string
        const passwordVerification = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,11}$/;
        if (!passwordVerification.test(password)) {
            setMessage("Password must be 6-11 characters and include uppercase, lowercase, and a number.");
            return;
        }

        // Confirm password must match
        if (password !== confirm) {
            setMessage("Password does not match. Please try again.");
            return;
        }

        // If validation passes, call the backend to register
        try {
            // Send username/password to the /register endpoint
            const data = await userRegistration(inputUser, password);

            // Check if the API returned a success message
            if (data.message?.toLowerCase().includes("successful")) {
                // Save username in App state (treat as logged-in)
                setUsername(inputUser);
                // Redirect to homepage (you can change to /movies if you like)
                navigate("/");
            } else {
                // If API returned an error message, show it; fallback to generic
                setMessage(data.message || "Registration failed.");
            }
        } catch (err) {
            // If request failed (e.g., username taken, network issue), show friendly message
            setMessage("Registration failed, username already taken.");
        }
    }

    // JSX: the sign-up form UI
    return (
        <div className="signup-wrapper"> {/* Outer wrapper for layout/styling */}
            <form 
              className="signup-card"        // Card-like container
              onSubmit={handleSubmit}        // Submit handler
              noValidate                      // Disable browser default validation bubbles
            >
                <h2 className="signup-title">Create your account</h2>

                {/* Username input with icon */}
                <div className="icon-wrapper">
                    <UserRound className="icon"/> {/* User icon */}
                    <input
                        className="signup-input"
                        value={inputUser}                           // Controlled input value
                        onChange={(e) => setInputUser(e.target.value)} // Update state on typing
                        placeholder="Username"
                        required                                     // HTML5 required
                    />
                </div>

                {/* Password input with icon */}
                <div className="icon-wrapper">
                    <LockKeyhole className="icon"/> {/* Lock icon */}
                    <input
                        className="signup-input"
                        type="password"                              // Hide characters
                        value={password}                             // Controlled value
                        onChange={(e) => setPassword(e.target.value)} // Update state on typing
                        placeholder="Password"
                        required
                    />
                </div>

                {/* Confirm password input with icon */}
                <div className="icon-wrapper">
                    <LockKeyhole className="icon"/> {/* Lock icon */}
                    <input
                        className="signup-input"
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)} // Update confirmation state
                        placeholder="Confirm Password"
                        required
                    />
                </div>

                {/* Validation or error message area */}
                {message && <div className="signup-message">{message}</div>}

                {/* Submit button */}
                <button className="signup-btn" type="submit">Sign Up</button>

                {/* Footer with link to Login page */}
                <div className="signup-footer">
                    Already a member?{" "}
                    <Link to="/login" className="signup-link">Sign in</Link>
                </div>
            </form>
        </div>
        );
    }
    

export default RegisterForm; // Export this component so App.jsx can import it.
