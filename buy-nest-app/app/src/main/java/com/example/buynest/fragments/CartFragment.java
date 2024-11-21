package com.example.buynest.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.example.buynest.R;
import com.example.buynest.adapters.CartAdapter;
import com.example.buynest.models.CartItem;
import com.example.buynest.viewmodels.CartViewModel;

import java.util.List;

public class CartFragment extends Fragment {

    private RecyclerView cartRecyclerView;
    private CartAdapter cartAdapter;
    private TextView cartTitle;
    private TextView totalCartValue;
    private Button checkoutButton;
    private CartViewModel cartViewModel;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_cart, container, false);

        cartRecyclerView = view.findViewById(R.id.cart_recycler_view);
        cartTitle = view.findViewById(R.id.cart_title);
        totalCartValue = view.findViewById(R.id.total_cart_value);
        checkoutButton = view.findViewById(R.id.checkout_button);

        view.findViewById(R.id.backButton).setOnClickListener(v ->
                Navigation.findNavController(v).navigateUp());

        cartViewModel = new ViewModelProvider(requireActivity()).get(CartViewModel.class);

        setupRecyclerView();

        cartViewModel.getCartItems().observe(getViewLifecycleOwner(), this::updateCart);

        checkoutButton.setOnClickListener(v -> {
        });

        return view;
    }

    private void setupRecyclerView() {
        cartAdapter = new CartAdapter(cartViewModel.getCartItems().getValue());
        cartRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        cartRecyclerView.setAdapter(cartAdapter);
    }

    private void updateCart(List<CartItem> cartItems) {
        if (cartItems.isEmpty()) {
            cartTitle.setText("Your Cart is Empty");
            checkoutButton.setVisibility(View.GONE);
            totalCartValue.setVisibility(View.GONE);
        } else {
            cartTitle.setText("Your Cart");
            checkoutButton.setVisibility(View.VISIBLE);
            totalCartValue.setVisibility(View.VISIBLE);

            double total = 0;
            for (CartItem item : cartItems) {
                total += item.getProduct().getPrice() * item.getQuantity();
            }
            totalCartValue.setText(String.format("$%.2f", total));
        }
        cartAdapter.notifyDataSetChanged();
    }
}