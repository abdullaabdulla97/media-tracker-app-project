// Package: groups this repository under the "model" folder
package com.ma.movie_tracker_app.model;

// Import Spring Data JPA's base repository
import org.springframework.data.jpa.repository.JpaRepository;

// UserRepository extends JpaRepository to manage User entities.
// - Entity type: User
// - Primary key type: Long
//
// This gives us built-in CRUD methods such as:
//   save(user)           → INSERT or UPDATE
//   findById(id)         → SELECT by primary key
//   findAll()            → SELECT * (all rows)
//   deleteById(id)       → DELETE by id
//   count()              → SELECT COUNT(*)
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom finder method:
    // Looks up a user by their username.
    // Spring Data JPA automatically generates SQL like:
    //   SELECT * FROM user_table WHERE username = ?;
    //
    // Returns a User object if found, otherwise null.
    User findByUsername(String username);
}
