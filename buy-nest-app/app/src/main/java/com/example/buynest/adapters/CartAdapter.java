package com.example.buynest.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.example.buynest.R;
import com.example.buynest.models.CartItem;

import java.util.List;

public class CartAdapter extends RecyclerView.Adapter<CartAdapter.CartViewHolder> {

    private List<CartItem> cartItems;

    public CartAdapter(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    @NonNull
    @Override
    public CartViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_cart, parent, false);
        return new CartViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CartViewHolder holder, int position) {
        CartItem item = cartItems.get(position);
        holder.productName.setText(item.getProduct().getName());
        holder.productPrice.setText(String.format("$%.2f", item.getProduct().getPrice()));
        holder.productQuantity.setText(String.valueOf(item.getQuantity()));
        holder.productTotal.setText(String.format("$%.2f", item.getProduct().getPrice() * item.getQuantity()));
    }

    @Override
    public int getItemCount() {
        return cartItems.size();
    }

    static class CartViewHolder extends RecyclerView.ViewHolder {
        TextView productName, productPrice, productQuantity, productTotal;

        CartViewHolder(View itemView) {
            super(itemView);
            productName = itemView.findViewById(R.id.cartItemName);
            productPrice = itemView.findViewById(R.id.cartItemPrice);
            productQuantity = itemView.findViewById(R.id.cartItemQuantity);
            productTotal = itemView.findViewById(R.id.cartItemTotal);
        }
    }
}