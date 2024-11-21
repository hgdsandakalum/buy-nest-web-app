package com.example.buynest.viewmodels;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.example.buynest.models.CartItem;
import com.example.buynest.models.Product;

import java.util.ArrayList;
import java.util.List;

public class CartViewModel extends ViewModel {
    private MutableLiveData<List<CartItem>> cartItems = new MutableLiveData<>(new ArrayList<>());

    public void addToCart(Product product, int quantity) {
        List<CartItem> currentItems = cartItems.getValue();
        if (currentItems != null) {
            boolean found = false;
            for (CartItem item : currentItems) {
                if (item.getProduct().getId().equals(product.getId())) {
                    item.setQuantity(item.getQuantity() + quantity);
                    found = true;
                    break;
                }
            }
            if (!found) {
                currentItems.add(new CartItem(product, quantity));
            }
            cartItems.setValue(currentItems);
        }
    }

    public LiveData<List<CartItem>> getCartItems() {
        return cartItems;
    }

    public void clearCart() {
        cartItems.setValue(new ArrayList<>());
    }

}