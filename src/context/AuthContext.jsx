import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Listen to Auth State ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log("🔄 Auth state changed:", currentUser?.email || "No user");
    });
    return unsubscribe;
  }, []);

  // --- Signup Function ---
  async function signup({ email, password }) {
    console.log("📝 Signup attempt for:", email);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ User created:", cred.user.email);

      // Send verification email
      try {
        console.log("📨 Sending verification email...");
        await sendEmailVerification(cred.user);
        console.log("✅ Verification email sent successfully!");
        alert("Verification email sent! Please check your inbox.");
      } catch (emailError) {
        console.error("❌ Failed to send verification email:", emailError.message);
        alert("Failed to send verification email. Please try again later.");
      }

      // Force logout to prevent unverified access
      await signOut(auth);
      console.log("🔒 User signed out after registration.");
      return cred.user;
    } catch (error) {
      console.error("❌ Signup error:", error.code, error.message);
      alert(error.message);
      throw error;
    }
  }

  // --- Login Function ---
  async function login({ email, password }) {
    console.log("🔐 Login attempt for:", email);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Login successful:", cred.user.email);

      if (!cred.user.emailVerified) {
        console.warn("⚠️ Email not verified for:", cred.user.email);
        alert("Email not verified. Please verify your email first.");
        await signOut(auth);
        return null;
      }

      setUser(cred.user);
      console.log("🎯 Verified user logged in:", cred.user.email);
      return cred.user;
    } catch (error) {
      console.error("❌ Login error:", error.code, error.message);
      alert(error.message);
      throw error;
    }
  }

  // --- Resend Verification Email ---
  async function resendVerificationEmail() {
    console.log("🔁 Attempting to resend verification email...");
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      try {
        await sendEmailVerification(auth.currentUser);
        console.log("✅ Verification email resent to:", auth.currentUser.email);
        alert("Verification email resent! Please check your inbox.");
      } catch (error) {
        console.error("❌ Error resending verification email:", error.message);
        alert("Failed to resend verification email. Try again later.");
      }
    } else {
      console.warn("⚠️ No unverified user found to resend email.");
      alert("Either no user is logged in or email is already verified.");
    }
  }

  // --- Logout ---
  async function logout() {
    console.log("🚪 Logging out user...");
    await signOut(auth);
    console.log("✅ User signed out successfully.");
  }

  return (
    <AuthContext.Provider
      value={{ user, signup, login, logout, resendVerificationEmail }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

// --- Hook to use context easily ---
export function useAuth() {
  return useContext(AuthContext);
}
