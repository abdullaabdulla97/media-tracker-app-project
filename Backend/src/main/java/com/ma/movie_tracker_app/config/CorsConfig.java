// Package: puts this configuration class in the "config" folder
package com.ma.movie_tracker_app.config;

// Import Spring annotations for configuration and bean creation
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// Import Spring’s CORS support classes
import org.springframework.web.cors.*;
import org.springframework.web.filter.CorsFilter;

// Import List for allowed origins, methods, headers
import java.util.List;

// @Configuration marks this class as a configuration class.
// Spring will load it on startup and register any beans defined inside.
@Configuration
public class CorsConfig {

    // @Bean tells Spring to put this method’s return value (CorsFilter) 
    // into the application context. 
    // That way, the filter is applied to all incoming HTTP requests.
    @Bean
    public CorsFilter corsFilter() {
        // Create a new CORS configuration object
        CorsConfiguration cfg = new CorsConfiguration();

        // Allow requests only from your React frontend (localhost:3000)
        cfg.setAllowedOrigins(List.of("http://localhost:3000", "https://media-tracker-app-project.vercel.app/"));

        // Allow these HTTP methods from the frontend
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow any headers (e.g., Content-Type, Authorization, etc.)
        cfg.setAllowedHeaders(List.of("*"));

        // Allow sending cookies/credentials (e.g., JSESSIONID, authentication tokens)
        cfg.setAllowCredentials(true);

        // Create a URL-based configuration source and register our CORS rules for all paths
        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg); 
        // "/**" means: apply these rules to all endpoints in the backend

        // Return the CorsFilter which applies this configuration
        return new CorsFilter(src);
    }
}
