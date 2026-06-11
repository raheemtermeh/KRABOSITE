import { useState, useEffect } from "react";
import axios from "axios";

const useFetchCartItems = () => {
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("userInfoKrabo")
          ? JSON.parse(localStorage.getItem("userInfoKrabo")).token
          : null;

        if (!token) {
          throw new Error("No token found");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const response = await axios.get(
          "https://python.krabo.gold/api/order/my-card/",
          { headers },
        );

        setTotalItems(response.data.count);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  return totalItems;
};

export default useFetchCartItems;
