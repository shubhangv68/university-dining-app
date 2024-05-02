import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthData } from "../DataContext/AuthDataContext";
import Events from "./Events";
import FSI from "./FSI";
import Home from "./Home";
import Jobs from "./Jobs";
import MealPlan from "./MealPlan";
import Nutrition from "./Nutrition";
import Preferences from "./Preferences";
import Sustainability from "./Sustainability";

axios.defaults.withCredentials = true;

async function getUserInfo(codeResponse) {
  try {
    const response = await axios.post("http://localhost:5000/login", {
      code: codeResponse.code,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    return null;
  }
}

async function getVerification() {
  try {
    const refreshToken = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("refresh_token_cookie"))
      ?.split("=")[1];

    const email = localStorage.getItem("user_email");

    const response = await axios.post(
      "http://localhost:5000/verifyToken",
      {
        email: email,
        token: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch protected data:", error);
    return null;
  }
}

export default function Main() {
  const {
    loggedIn,
    setLoggedIn,
    user,
    setUser,
    setCookie,
    removeCookie,
    logout,
  } = useAuthData();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      const loginDetails = await getUserInfo(codeResponse);
      if (loginDetails) {
        setLoggedIn(true);
        setUser(loginDetails.user);
        const refreshToken = loginDetails.refresh_token;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);
        setCookie("refresh_token_cookie", refreshToken, {
          expires: expirationDate,
          path: "/",
        });
        localStorage.setItem("user_email", loginDetails.user.email);
      }
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const verifyTokenData = await getVerification();
      if (verifyTokenData) {
        setLoggedIn(true);
        setUser({ name: verifyTokenData.logged_in_as });
      } else {
        setLoggedIn(false);
        setUser({});
      }
    };
    checkAuth();
  }, []);

  return (
    <main>
      {!loggedIn ? (
        <div className="login-button-container">
          <button onClick={() => googleLogin()} className="google-login-button">
            LOGIN WITH YOUR UMASS ACCOUNT
          </button>
        </div>
      ) : (
        <div>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/mealplan" element={<MealPlan />} />
            <Route path="/events" element={<Events />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/food_security_initiatives" element={<FSI />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      )}
    </main>
  );
}
