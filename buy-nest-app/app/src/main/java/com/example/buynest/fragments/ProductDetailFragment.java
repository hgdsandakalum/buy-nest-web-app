package com.example.buynest.fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.Navigation;

import com.example.buynest.R;
import com.example.buynest.models.Product;
import com.example.buynest.viewmodels.CartViewModel;

public class ProductDetailFragment extends Fragment {
    private Product product;
    private int quantity = 1;
    private CartViewModel cartViewModel;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ProductDetailFragmentArgs args = ProductDetailFragmentArgs.fromBundle(getArguments());
        product = args.getProduct();
        cartViewModel = new ViewModelProvider(requireActivity()).get(CartViewModel.class);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_product_detail, container, false);

        ImageButton backButton = view.findViewById(R.id.backButton);
        ImageView productImage = view.findViewById(R.id.productDetailImage);
        TextView productName = view.findViewById(R.id.productDetailName);
        TextView productDescription = view.findViewById(R.id.productDetailDescription);
        TextView productPrice = view.findViewById(R.id.productDetailPrice);
        TextView productCategory = view.findViewById(R.id.productDetailCategory);
        Button decreaseQuantity = view.findViewById(R.id.decreaseQuantity);
        Button increaseQuantity = view.findViewById(R.id.increaseQuantity);
        TextView quantityValue = view.findViewById(R.id.quantityValue);
        Button addToCartButton = view.findViewById(R.id.addToCartButton);


        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Navigate back to the previous fragment
                getParentFragmentManager().popBackStack();
            }
        });

        decreaseQuantity.setOnClickListener(v -> {
            if (quantity > 1) {
                quantity--;
                quantityValue.setText(String.valueOf(quantity));
            }
        });

        increaseQuantity.setOnClickListener(v -> {
            quantity++;
            quantityValue.setText(String.valueOf(quantity));
        });

        if (product != null) {
            productName.setText(product.getName());
            productDescription.setText(product.getDescription());
            productPrice.setText(String.format("$%.2f", product.getPrice()));
            productCategory.setText("Category: " + product.getCategory());
        }

        addToCartButton.setOnClickListener(v -> {
            cartViewModel.addToCart(product, quantity);
            String message = String.format("Added %d %s to cart", quantity, product.getName());
            Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
            Navigation.findNavController(v).navigate(R.id.action_productDetailFragment_to_cartFragment);
        });

        return view;
    }
}