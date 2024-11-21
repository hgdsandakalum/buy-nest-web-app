package com.example.buynest.models;

import com.example.buynest.models.Product;

import java.util.ArrayList;
import java.util.List;

public class CartManager {
    private static CartManager instance;
    private List<CartItem> cartItems;

    private CartManager() {
        cartItems = new ArrayList<>();
    }

    public static synchronized CartManager getInstance() {
        if (instance == null) {
            instance = new CartManager();
        }
        return instance;
    }

    public void addToCart(Product product, int quantity) {
        for (CartItem item : cartItems) {
            if (item.product.getId().equals(product.getId())) {
                item.quantity += quantity;
                return;
            }
        }
        cartItems.add(new CartItem(product, quantity));
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void clearCart() {
        cartItems.clear();
    }

    public static class CartItem {
        public Product product;
        public int quantity;

        public CartItem(Product product, int quantity) {
            this.product = product;
            this.quantity = quantity;
        }
    }
}