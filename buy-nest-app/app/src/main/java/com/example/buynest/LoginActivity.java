package com.example.buynest;

import static com.example.buynest.utils.Constants.LOGIN_URL;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

public class LoginActivity extends AppCompatActivity {

    private EditText emailInput;
    private EditText passwordInput;
    private Button loginButton;
    private TextView registerPrompt;
    private RequestQueue requestQueue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Make the activity full screen
        makeFullScreen();

        setContentView(R.layout.activity_login);

        requestQueue = Volley.newRequestQueue(this);

        emailInput = findViewById(R.id.email_input);
        passwordInput = findViewById(R.id.password_input);
        loginButton = findViewById(R.id.login_button);
        registerPrompt = findViewById(R.id.register_prompt);


        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email = emailInput.getText().toString();
                String password = passwordInput.getText().toString();

                if (!email.isEmpty() && !password.isEmpty()) {
                    loginUser(email, password);
                } else {
                    Toast.makeText(LoginActivity.this, "Please enter email and password", Toast.LENGTH_SHORT).show();
                }
            }
        });

        registerPrompt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Redirect to RegisterActivity
                Intent intent = new Intent(LoginActivity.this, RegisterActivity.class);
                startActivity(intent);
                finish();
            }
        });
    }

    private void loginUser(String email, String password) {
        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("email", email);
            jsonBody.put("password", password);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, LOGIN_URL, jsonBody,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            String token = response.getString("token");
                            JSONObject user = response.getJSONObject("user");
                            String userId = user.getString("id");

                            // Save login state and token
                            SharedPreferences prefs = getSharedPreferences("BuyNestPrefs", MODE_PRIVATE);
                            SharedPreferences.Editor editor = prefs.edit();
                            editor.putBoolean("isLoggedIn", true);
                            editor.putString("token", token);
                            editor.putString("userId", userId);
                            editor.apply();

                            Toast.makeText(LoginActivity.this, "Login successful!", Toast.LENGTH_SHORT).show();

                            // Redirect to MainActivity
                            Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                            startActivity(intent);
                            finish();
                        } catch (JSONException e) {
                            e.printStackTrace();
                            Toast.makeText(LoginActivity.this, "Login failed. Please try again.", Toast.LENGTH_SHORT).show();
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        String errorMessage = "Login failed. ";
                        if (error.networkResponse != null) {
                            errorMessage += "Status code: " + error.networkResponse.statusCode;
                        }
                        if (error.getMessage() != null) {
                            errorMessage += " Error message: " + error.getMessage();
                        }
                        Toast.makeText(LoginActivity.this, errorMessage, Toast.LENGTH_LONG).show();
                    }
                });

        requestQueue.add(jsonObjectRequest);
    }

    private void makeFullScreen() {
        // For API 30 and above
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
            WindowInsetsControllerCompat controller = new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
            controller.hide(WindowInsetsCompat.Type.statusBars() | WindowInsetsCompat.Type.navigationBars());
            controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        }
        // For API 16 to 29
        else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
            View decorView = getWindow().getDecorView();
            int uiOptions = View.SYSTEM_UI_FLAG_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
            decorView.setSystemUiVisibility(uiOptions);
        }
        // For API 15 and below
        else {
            getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                    WindowManager.LayoutParams.FLAG_FULLSCREEN);
        }

        // Hide the action bar
        if (getSupportActionBar() != null) {
            getSupportActionBar().hide();
        }
    }

}