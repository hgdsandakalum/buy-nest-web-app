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
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.buynest.models.User;
import com.example.buynest.utils.Constants;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.HashMap;
import java.util.Map;

public class UserManagementViewModel extends AndroidViewModel {
    private MutableLiveData<User> userLiveData = new MutableLiveData<>();
    private RequestQueue requestQueue;

    public UserManagementViewModel(Application application) {
        super(application);
        requestQueue = Volley.newRequestQueue(application);
    }

    public LiveData<User> getUserLiveData() {
        return userLiveData;
    }

    public LiveData<User> fetchLatestUserData() {
        MutableLiveData<User> latestUserData = new MutableLiveData<>();

        SharedPreferences prefs = getApplication().getSharedPreferences("BuyNestPrefs", Application.MODE_PRIVATE);
        String token = prefs.getString("token", "");

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, Constants.PROFILE_URL, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            User user = new User(
                                    response.getString("_id"),
                                    response.getString("name"),
                                    response.getString("email"),
                                    response.getString("role"),
                                    response.getString("address"),
                                    response.getString("contact")
                            );

                            latestUserData.postValue(user);
                            userLiveData.postValue(user);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // Handle error
                    }
                }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<>();
                headers.put("Authorization", token);
                return headers;
            }
        };

        requestQueue.add(jsonObjectRequest);
        return latestUserData;
    }

    public void fetchUserProfile() {
        SharedPreferences prefs = getApplication().getSharedPreferences("BuyNestPrefs", Application.MODE_PRIVATE);
        String token = prefs.getString("token", "");

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, Constants.PROFILE_URL, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            User user = new User(
                                    response.getString("_id"),
                                    response.getString("name"),
                                    response.getString("email"),
                                    response.getString("role"),
                                    response.getString("address"),
                                    response.getString("contact")
                            );
                            userLiveData.postValue(user);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // Handle error
                    }
                }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<>();
                headers.put("Authorization", token);
                return headers;
            }
        };

        requestQueue.add(jsonObjectRequest);
    }

    public void updateUserProfile(String name, String address, String mobile) {
        SharedPreferences prefs = getApplication().getSharedPreferences("BuyNestPrefs", Application.MODE_PRIVATE);
        String token = prefs.getString("token", "");

        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("name", name);
            jsonBody.put("address", address);
            jsonBody.put("contact", mobile);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.PUT, Constants.UPDATE_PROFILE_URL, jsonBody,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            User updatedUser = new User(
                                    response.getString("_id"),
                                    response.getString("name"),
                                    response.getString("email"),
                                    response.getString("role"),
                                    response.getString("address"),
                                    response.getString("contact")
                            );
                            userLiveData.postValue(updatedUser);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // Handle error
                    }
                }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> headers = new HashMap<>();
                headers.put("Authorization", token);
                return headers;
            }
        };

        requestQueue.add(jsonObjectRequest);
    }
}