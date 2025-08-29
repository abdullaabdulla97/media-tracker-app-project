// Package name: groups related classes under com.ma.movie_tracker_app
package com.ma.movie_tracker_app;

// Import the Spring Boot class that starts the application
import org.springframework.boot.SpringApplication;
// Import the annotation that marks this as a Spring Boot application
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication is a convenience annotation that:
//  - Marks this class as the starting point of the Spring Boot app
//  - Enables auto-configuration (Spring Boot will guess sensible defaults)
//  - Enables component scanning (so @RestController, @Service, @Repository classes are found automatically)
//  - Enables configuration properties
@SpringBootApplication
public class MediaApp {

    // Main method: the entry point of any Java application.
    // When you run "java -jar ..." or start the app in an IDE,
    // this is the method that runs first.
	public static void main(String[] args) {
        // SpringApplication.run(...) bootstraps the Spring application:
        //  - Creates the Spring ApplicationContext (container for beans)
        //  - Starts the embedded Tomcat server by default
        //  - Initializes all @Component/@RestController classes
        //  - Keeps the app running to listen for requests
		SpringApplication.run(MediaApp.class, args);
	}
}

