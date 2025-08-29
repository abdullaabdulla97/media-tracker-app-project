// Package: puts this class under the "model" folder of your project
package com.ma.movie_tracker_app.model;

// Import JPA (Jakarta Persistence API) annotations for mapping class → database
import jakarta.persistence.*;

// @Entity marks this class as a JPA entity (mapped to a table in the database).
// @Table(name = "user_table") specifies the table name explicitly as "user_table".
// (We use this because "user" can be a reserved keyword in some databases like PostgreSQL.)
@Entity
@Table(name = "user_table")
public class User {

    // @Id marks this as the PRIMARY KEY column.
    @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY) means the database will auto-increment
    // the ID (e.g., 1,2,3...) each time a new user row is inserted.
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // unique identifier for each user

    // @Column(unique = true) means no two rows can have the same username.
    @Column(unique = true)
    private String username;

    // Password for authentication.
    // (Usually stored as a hashed value not plain text)
    private String password;

    // ---- Constructors ----

    // Default constructor (needed by JPA).
    public User() {}

    // ---- Getters and Setters ----
    // These allow Spring + your code to read and write fields safely.

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
