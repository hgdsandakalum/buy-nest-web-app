import { create } from "zustand";
import { message } from "antd";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CSR" | "VENDOR";
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful, user data:", data.user); // Debug log
        set({ user: data.user, loading: false });
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userRole", data.user.role);
        message.success("Logged in successfully");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      message.error("Failed to login");
      console.error("Login error:", error);
      set({ loading: false });
    }
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    message.success("Logged out successfully");
  },
  checkAuth: async () => {
    set({ loading: true });
    const token = localStorage.getItem("authToken");
    console.log("Checking auth, token:", token); // Debug log
    if (token) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/verify-token",
          {
            method: "POST",
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        console.log("Token verification response:", response); // Debug log
        if (response.ok) {
          const userData = await response.json();
          console.log("checkAuth userData", userData.user);
          if (userData.user) {
            set({ user: userData.user, loading: false });
            console.log("User set in state:", userData.user); // Debug log
            return true;
          } else {
            console.log("User data is null or undefined"); // Debug log
            set({ user: null, loading: false });
            return false;
          }
        } else {
          console.log("Token verification failed"); // Debug log
          localStorage.removeItem("authToken");
          set({ user: null, loading: false });
          return false;
        }
      } catch (error) {
        console.error("Error verifying auth token:", error);
        localStorage.removeItem("authToken");
        set({ user: null, loading: false });
        return false;
      }
    } else {
      console.log("No auth token found"); // Debug log
      set({ user: null, loading: false });
      return false;
    }
  },
}));
