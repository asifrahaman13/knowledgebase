"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";

const Page: React.FC = () => {
  const [token, setToken] = useState<string>("");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    console.log(code);

    const getAccessToken = async (code: string | null) => {
      try {
        const response = await axios.get<{ access_token: string }>(`http://localhost:8000/users/auth/google/callback`, {
          params: { url: code },
        });
        if (response.status === 200) {
          const { access_token } = response.data;
          console.log("Access Token:", access_token);
          setToken(access_token);
          localStorage.setItem("token", access_token);
          window.location.href = "http://localhost:3000/dashboard";
        }
      } catch (error) {
        console.error("Failed to fetch access token:", error);
      }
    }

    if (code) {
      getAccessToken(code);
    }
  }, [pathname, searchParams]);

  const [data, setData] = useState<{ [key: string]: any }>({});
  useEffect(() => {
    const getUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(`http://localhost:8000/users/auth/user_info?url=${token}`);
        console.log(response);
        if (response.status === 200) {
          setData(response.data);
        }
      }
    }

    getUserDetails();
  }, []);

  return (
    <>
      <div>{data.sub}</div>
      <div>{data.name}</div>
      <div>{data.given_name}</div>
      <div>{data.family_name}</div>
      <div>{data.picture}</div>
      <div>{data.email}</div>
      <div>{data.email_verified ? "Verified" : "Not Verified"}</div>
      <div>{data.locale}</div>
      <div>{data.hd}</div>
    </>
  );
};

export default Page;
