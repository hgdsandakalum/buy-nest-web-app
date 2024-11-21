package com.example.buynest.viewmodels;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModel;

import com.example.buynest.models.Order;

import java.util.List;

public class OrderTrackingViewModel extends ViewModel {
    public LiveData getOrderStatus(String orderId) {
        return null;
    }

    public LiveData<List<Order>> getOrderHistory(String userId) {
        return null;
    }
}