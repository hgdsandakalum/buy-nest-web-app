package com.example.buynest;

import static com.example.buynest.utils.Constants.REGISTER_URL;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
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

import org.json.JSONObject;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;

import java.io.UnsupportedEncodingException;

public class RegisterActivity extends AppCompatActivity {

    private EditText nameInput;
    private EditText emailInput;
    private EditText passwordInput;
    private EditText confirmPasswordInput;
    private EditText phoneInput;
    private EditText addressInput;
    private Button registerButton;
    private TextView loginPrompt;

    private RequestQueue requestQueue;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        makeFullScreen();

        setContentView(R.layout.activity_register);

        requestQueue = Volley.newRequestQueue(this);

        nameInput = findViewById(R.id.name_input);
        emailInput = findViewById(R.id.email_input);
        passwordInput = findViewById(R.id.password_input);
        confirmPasswordInput = findViewById(R.id.confirm_password_input);
        phoneInput = findViewById(R.id.phone_input);
        addressInput = findViewById(R.id.address_line_input);
        registerButton = findViewById(R.id.register_button);
        loginPrompt = findViewById(R.id.login_prompt);

        registerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String name = nameInput.getText().toString();
                String email = emailInput.getText().toString();
                String password = passwordInput.getText().toString();
                String confirmPassword = confirmPasswordInput.getText().toString();
                String phone = phoneInput.getText().toString();
                String address = addressInput.getText().toString();

                if (isValidRegistration(name, email, password, confirmPassword, phone, address)) {
                    registerUser(name, email, password, phone, address);
                }
            }
        });

        loginPrompt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Redirect to LoginActivity
                Intent intent = new Intent(RegisterActivity.this, LoginActivity.class);
                startActivity(intent);
                finish();
            }
        });
    }

    private boolean isValidRegistration(String name, String email, String password, String confirmPassword,
                                        String phone, String address) {
        if (name.isEmpty() || email.isEmpty() || password.isEmpty() || confirmPassword.isEmpty() ||
                phone.isEmpty() || address.isEmpty()) {
            Toast.makeText(this, "All fields are required", Toast.LENGTH_SHORT).show();
            return false;
        }

        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            Toast.makeText(this, "Invalid email format", Toast.LENGTH_SHORT).show();
            return false;
        }

        if (password.length() < 6) {
            Toast.makeText(this, "Password must be at least 6 characters long", Toast.LENGTH_SHORT).show();
            return false;
        }

        if (!password.equals(confirmPassword)) {
            Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show();
            return false;
        }

        if (!android.util.Patterns.PHONE.matcher(phone).matches()) {
            Toast.makeText(this, "Invalid phone number format", Toast.LENGTH_SHORT).show();
            return false;
        }

        return true;
    }

    private void registerUser(String name, String email, String password, String phone,
                              String address) {

        JSONObject jsonBody = new JSONObject();
        try {
            jsonBody.put("name", name);
            jsonBody.put("email", email);
            jsonBody.put("password", password);
            jsonBody.put("contact", phone);
            jsonBody.put("address", address);
            jsonBody.put("role", "CUSTOMER");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, REGISTER_URL, jsonBody,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Toast.makeText(RegisterActivity.this, "Registration successful!", Toast.LENGTH_SHORT).show();
                        Intent intent = new Intent(RegisterActivity.this, LoginActivity.class);
                        startActivity(intent);
                        finish();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        String errorMessage = "Registration failed. ";
                        if (error.networkResponse != null) {
                            errorMessage += "Status code: " + error.networkResponse.statusCode;
                            try {
                                String responseBody = new String(error.networkResponse.data, "utf-8");
                                errorMessage += " Response body: " + responseBody;
                            } catch (UnsupportedEncodingException e) {
                                e.printStackTrace();
                            }
                        }
                        if (error.getMessage() != null) {
                            errorMessage += " Error message: " + error.getMessage();
                        }
                        Log.e("RegisterActivity", errorMessage);
                        Toast.makeText(RegisterActivity.this, errorMessage, Toast.LENGTH_LONG).show();
                        error.printStackTrace();                    }
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