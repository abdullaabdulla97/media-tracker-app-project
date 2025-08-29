// Package: puts this class in the "model" folder of your project
package com.ma.movie_tracker_app.model;

// Import JPA (Jakarta Persistence API) annotations for entity mapping
import jakarta.persistence.*;

// @Entity marks this class as a JPA entity → a table will be created in the database.
// By default, the table name will be "user_show_list" (from the class name).
@Entity
public class UserShowList {

    // @Id → this field is the PRIMARY KEY of the table.
    @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY) → database auto-generates the ID
    // Example: 1, 2, 3… for each new row
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many-to-One relationship:
    // Many "UserShowList" rows can belong to the same user.
    // Example: One user may have 50 different shows in their lists.
    @ManyToOne
    private User user;

    // Many-to-One relationship:
    // Many "UserShowList" rows can point to the same show.
    // Example: "Breaking Bad" could appear in hundreds of users' lists.
    @ManyToOne
    private Shows show;

    // "type" field stores which list this entry belongs to:
    // Possible values: "watchlist", "favourites", "watched"
    private String type;

    // ---- Constructors ----

    // Default constructor (required by JPA)
    public UserShowList() {}

    // ---- Getters and Setters ----
    // Needed so JPA + my app can read/write the private fields.

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    public Shows getShow() {
        return show;
    }
    public void setShow(Shows show) {
        this.show = show;
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
}
