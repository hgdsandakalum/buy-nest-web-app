package com.example.buynest.models;

public class User {
    private String id;
    private String name;
    private String email;
    private String role;
    private String address;
    private String contact;

    public User(String id, String name, String email, String role, String address, String contact) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.address = address;
        this.contact = contact;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getAddress() {
        return address;
    }

    public String getContact() {
        return contact;
    }

}