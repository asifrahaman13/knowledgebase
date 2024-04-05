/* eslint-disable @next/next/no-img-element */
"use client";

// App.js
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const Login = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    async function getAccessToken(code: any) {
      try {
        const response = await axios.get(`http://localhost:8000/users/auth/google/callback`, {
          params: { url: code },
        });
        if (response.status === 200) {
          const { access_token } = response.data;
          console.log("Access Token:", access_token);
          setToken(access_token);
          window.history.replaceState({}, document.title, "/login");
        }
      } catch (error) {
        console.error("Failed to fetch access token:", error);
      }
    }

    if (code) {
      getAccessToken(code);
    }
  }, []);

  const initiateAuthFlow = async () => {
    const authUrlRes = await axios.get("http://localhost:8000/users/auth/google");
    const { auth_url } = authUrlRes.data;
    console.log("Auth URL:", auth_url)
    window.location.href = auth_url; // Redirect to Google OAuth2 URL
  };

  return (
    <>

      {/* {!token ? <button onClick={() => initiateAuthFlow()}>Sign in with Google 🚀</button> : <p>Token: {token}</p>}  */}

      <div className="flex flex-row gap-2">
        <Link href="/auth/signin" className="text-lg font-medium font-sans">Sign in</Link>
        <Link href="/auth/signup" className="text-lg font-medium font-sans">Sign up</Link>
      </div>

    </>
  );
};

export default Login;
