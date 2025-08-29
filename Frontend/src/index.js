import React from 'react'; // Import React to use JSX and React features
import ReactDOM from 'react-dom/client'; // Import ReactDOM, which handles rendering React into the browser's DOM
import './styles.css'; // Import global CSS styles that apply to the entire app
import App from './App'; // Import the App component, which contains the whole application

const root = ReactDOM.createRoot(document.getElementById('root')); // Created a root to control rendering into the <div id="root"> element in public/index.html
root.render( // Render the app inside the root
  <React.StrictMode> {/*Strict mode to check for issues*/}
    <App /> {/*Renders the app component, which defines routes, layout, and pages*/}
  </React.StrictMode>
);


