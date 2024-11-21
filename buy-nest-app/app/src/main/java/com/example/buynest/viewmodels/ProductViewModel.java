package com.example.buynest.viewmodels;

import android.app.Application;
import android.content.SharedPreferences;

import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.Volley;
import com.example.buynest.models.Product;
import com.example.buynest.utils.Constants;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ProductViewModel extends AndroidViewModel {
    private MutableLiveData<List<Product>> productsLiveData;
    private RequestQueue requestQueue;

    public ProductViewModel(Application application) {
        super(application);
        productsLiveData = new MutableLiveData<>();
        requestQueue = Volley.newRequestQueue(application);
    }

    public LiveData<List<Product>> getProducts() {
        return productsLiveData;
    }

    public void fetchProducts() {
        SharedPreferences prefs = getApplication().getSharedPreferences("BuyNestPrefs", Application.MODE_PRIVATE);
        String token = prefs.getString("token", "");

        String url = Constants.PRODUCTS_URL;

        JsonArrayRequest jsonArrayRequest = new JsonArrayRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONArray>() {
                    @Override
                    public void onResponse(JSONArray response) {
                        List<Product> productList = new ArrayList<>();
                        try {
                            for (int i = 0; i < response.length(); i++) {
                                JSONObject productJson = response.getJSONObject(i);
                                Product product = new Product(
                                        productJson.getString("id"),
                                        productJson.getString("name"),
                                        productJson.getString("description"),
                                        productJson.getDouble("price"),
                                        productJson.getString("category"),
                                        productJson.getString("vendorId"),
                                        productJson.getBoolean("isActive")
                                );
                                productList.add(product);
                            }
                            productsLiveData.postValue(productList);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                    }
                }){
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<>();
                headers.put("Authorization", token);
                return headers;
            }
        };

        requestQueue.add(jsonArrayRequest);
    }
}