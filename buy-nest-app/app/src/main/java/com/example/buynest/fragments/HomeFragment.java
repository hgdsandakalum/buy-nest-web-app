package com.example.buynest.fragments;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import com.example.buynest.R;
import com.example.buynest.adapters.ProductAdapter;
import com.example.buynest.models.Product;
import com.example.buynest.viewmodels.ProductViewModel;

import java.util.ArrayList;
import java.util.List;

public class HomeFragment extends Fragment implements ProductAdapter.OnProductClickListener {

    private static final String TAG = "HomeFragment";
    private RecyclerView productRecyclerView;
    private ProductAdapter productAdapter;
    private ProductViewModel productViewModel;
    private SwipeRefreshLayout swipeRefreshLayout;

    public HomeFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        productRecyclerView = view.findViewById(R.id.productRecyclerView);
        swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout);

        productRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        productAdapter = new ProductAdapter(getContext(), new ArrayList<>(), this);
        productRecyclerView.setAdapter(productAdapter);

        productViewModel = new ViewModelProvider(this).get(ProductViewModel.class);
        productViewModel.getProducts().observe(getViewLifecycleOwner(), new Observer<List<Product>>() {
            @Override
            public void onChanged(List<Product> products) {
                if (products != null) {
                    Log.d(TAG, "Products received: " + products.size());
                    productAdapter.setProducts(products);
                    productAdapter.notifyDataSetChanged();
                    swipeRefreshLayout.setRefreshing(false);
                } else {
                    Log.d(TAG, "Received null product list");
                }
            }
        });

        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                refreshProducts();
            }
        });

        productViewModel.fetchProducts();

        return view;
    }

    private void refreshProducts() {
        productViewModel.fetchProducts();
    }

    @Override
    public void onProductClick(Product product) {
        HomeFragmentDirections.ActionHomeFragmentToProductDetailFragment action =
                HomeFragmentDirections.actionHomeFragmentToProductDetailFragment(product);
        Navigation.findNavController(getView()).navigate(action);
    }
}