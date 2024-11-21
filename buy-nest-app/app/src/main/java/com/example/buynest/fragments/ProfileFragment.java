package com.example.buynest.fragments;

import static android.content.Context.MODE_PRIVATE;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import com.example.buynest.R;
import com.example.buynest.models.User;
import com.example.buynest.viewmodels.UserManagementViewModel;

import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.buynest.LoginActivity;


public class ProfileFragment extends Fragment {

    private UserManagementViewModel viewModel;
    private TextView profileName;
    private TextView profileEmail;

    private View editProfileButton;
    private Button logoutButton;

    public ProfileFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_profile, container, false);
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        profileName = view.findViewById(R.id.profile_name);
        profileEmail = view.findViewById(R.id.profile_email);
        editProfileButton = view.findViewById(R.id.edit_profile);
        logoutButton = view.findViewById(R.id.logout_btn);

        viewModel = new ViewModelProvider(this).get(UserManagementViewModel.class);

        viewModel.getUserLiveData().observe(getViewLifecycleOwner(), new Observer<User>() {
            @Override
            public void onChanged(User user) {
                if (user != null) {
                    profileName.setText(user.getName());
                    profileEmail.setText(user.getEmail());
                }
            }
        });

        editProfileButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                fetchLatestDataAndShowEditDialog();
            }
        });

        logoutButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                logout();
            }
        });

        viewModel.fetchUserProfile();
    }

    private void updateUI(User user) {
        profileName.setText(user.getName());
        profileEmail.setText(user.getEmail());
    }

    private void fetchLatestDataAndShowEditDialog() {
        viewModel.fetchLatestUserData().observe(getViewLifecycleOwner(), new Observer<User>() {
            @Override
            public void onChanged(User user) {
                if (user != null) {
                    showEditProfileDialog(user);
                }
            }
        });
    }

    private void showEditProfileDialog(User user) {
        AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
        builder.setTitle("Edit Profile");

        View viewInflated = LayoutInflater.from(getContext()).inflate(R.layout.dialog_edit_profile, (ViewGroup) getView(), false);
        final EditText nameInput = viewInflated.findViewById(R.id.edit_name);
        final EditText addressInput = viewInflated.findViewById(R.id.edit_address);
        final EditText mobileInput = viewInflated.findViewById(R.id.edit_mobile);

        nameInput.setText(user.getName());
        addressInput.setText(user.getAddress());
        mobileInput.setText(user.getContact());

        builder.setView(viewInflated);

        builder.setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                String newName = nameInput.getText().toString();
                String newAddress = addressInput.getText().toString();
                String newMobile = mobileInput.getText().toString();

                Toast.makeText(requireContext(), newMobile, Toast.LENGTH_LONG).show();

                viewModel.updateUserProfile(newName, newAddress, newMobile);
            }
        });
        builder.setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });

        builder.show();
    }

    private void logout() {
        // Clear SharedPreferences
        SharedPreferences prefs = getActivity().getSharedPreferences("BuyNestPrefs", MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.clear();
        editor.apply();

        // Redirect to Login Activity
        Intent intent = new Intent(getActivity(), LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        getActivity().finish();
    }
}