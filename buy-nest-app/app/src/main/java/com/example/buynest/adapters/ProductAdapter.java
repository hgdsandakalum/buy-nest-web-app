package com.example.buynest.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.example.buynest.R;
import com.example.buynest.models.Product;
import java.util.List;

public class ProductAdapter extends RecyclerView.Adapter<ProductAdapter.ProductViewHolder> {

    private List<Product> products;
    private Context context;
    private OnProductClickListener onProductClickListener;

    public interface OnProductClickListener {
        void onProductClick(Product product);
    }

    public ProductAdapter(Context context,  List<Product> products, OnProductClickListener listener) {
        this.context = context;
        this.products = products;
        this.onProductClickListener = listener;
    }

    @NonNull
    @Override
    public ProductViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_product, parent, false);
        return new ProductViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ProductViewHolder holder, int position) {
        Product product = products.get(position);
        holder.bind(product, onProductClickListener);
    }

    @Override
    public int getItemCount() {
        return products != null ? products.size() : 0;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
        notifyDataSetChanged();
    }

    static class ProductViewHolder extends RecyclerView.ViewHolder {
        ImageView productImage;
        TextView productName, productVendor, productCategory, productPrice;

        ProductViewHolder(View itemView) {
            super(itemView);
            productName = itemView.findViewById(R.id.productName);
            productVendor = itemView.findViewById(R.id.productVendor);
            productCategory = itemView.findViewById(R.id.productCategory);
            productPrice = itemView.findViewById(R.id.productPrice);
        }

        void bind(final Product product, final OnProductClickListener listener) {
            productName.setText(product.getName());
            productVendor.setText("Vendor: " + product.getVendorId());
            productCategory.setText("Category: " + product.getCategory());
            productPrice.setText(String.format("$%.2f", product.getPrice()));


            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    listener.onProductClick(product);
                }
            });
        }
    }


}