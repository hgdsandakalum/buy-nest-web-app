package com.example.buynest.models;
import java.util.List;

public class Order {
    private String id;
    private String userId;
    private List<CartItem> items;


    public Order(String id, String userId, List<CartItem> items) {
        this.id = id;
        this.userId = userId;
        this.items = items;
    }

}