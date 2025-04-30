package com.tech.demo.model;



import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Table(name = "`user`") // باستخدام علامات backticks `


@Entity
public class User {

    @Id
    private Long id;
    private String username;
    private String password;
    private String role; // الدور مثل "USER" أو "ADMIN"

    // getters and setters

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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}