import React, { useEffect } from "react";
import axios from "axios";

const add_log = async (agency, url) => {
  try {
    const token = localStorage.getItem("userInfoKrabo")
      ? JSON.parse(localStorage.getItem("userInfoKrabo")).token
      : null;

    let headers = {};

    if (token) {
      headers = {
        Authorization: `Bearer ${token}`,
      };
    } else {
      headers = {};
    }

    const response = await axios.post(
      "https://python.krabo.gold/api/user/add-log-user/",
      {
        url: url,
        agency: parseInt(agency),
      },
      { headers },
    );
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
  }
};

export default function Redirect() {
  useEffect(() => {
    const url = window.location.href;
    const urlObj = new URL(url);
    const whereValue = urlObj.searchParams.get("where");
    const urlValue = urlObj.searchParams.get("url");
    if (whereValue) {
      localStorage.setItem("where", whereValue);

      add_log(whereValue, urlValue);
      // window.location.href = `https://krabo.gold/${urlValue}`;
    } else {
      window.location.href = "https://krabo.gold/error";
    }
  }, []);

  return (
    <>
      <button
        onClick={() => {
          window.location.href = `https://krabo.gold/${urlValue}`;
        }}
      >
        برای ورود به سایت کلیک کنید...
      </button>
    </>
  );
}
