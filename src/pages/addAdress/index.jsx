import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import logo from "../../../public/assets/img/logo.png"; // Update the path as needed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMapMarkerAlt,
  faCity,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import MainLayout from "@layouts/Main"; // Adjust path as necessary

export default function AddAddress() {
  const [address, setAddress] = useState({
    title: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch saved addresses when the component mounts
    fetchSavedAddresses();
  }, []);

  const fetchSavedAddresses = async () => {
    try {
      const token = localStorage.getItem("userInfoKrabo")
        ? JSON.parse(localStorage.getItem("userInfoKrabo")).token
        : null;

      if (!token) {
        throw new Error("No token found");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        "https://python.krabo.gold/api/order/my-addresses/",
        { headers },
      );

      setAddresses(response.data);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      await axios.post(
        "https://python.krabo.gold/api/order/add-address/",
        address,
        { headers },
      );

      fetchSavedAddresses(); // Fetch the updated addresses
      setAddress({
        title: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      }); // Reset the form
    } catch (error) {
      console.error("Failed to add address:", error);
      setError("Failed to add address.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("userInfoKrabo")
        ? JSON.parse(localStorage.getItem("userInfoKrabo")).token
        : null;

      if (!token) {
        throw new Error("No token found");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.delete(
        `https://python.krabo.gold/api/order/delete-address/${id}/`,
        { headers },
      );

      fetchSavedAddresses(); // Refresh the address list after deletion
    } catch (error) {
      console.error("Failed to delete address:", error);
      setError("Failed to delete address.");
    }
  };

  return (
    <MainLayout isRTL>
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light py-5">
        <Image
          src={logo}
          alt="Logo"
          width={150}
          height={150}
          className="rounded-circle mb-3"
        />
        <div
          className="bg-white p-4 shadow-lg rounded-lg"
          style={{ width: "100%", maxWidth: "600px" }}
        >
          <div className="text-center mb-4">
            <h2 className="mb-4 text-warning">افزودن آدرس جدید</h2>
          </div>
          {error && <div className="text-danger mb-3">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <FontAwesomeIcon icon={faEdit} style={{ width: "20px" }} />
                </span>
                <input
                  type="text"
                  name="title"
                  value={address.title}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="عنوان (مانند خانه، محل کار)"
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <FontAwesomeIcon icon={faHome} style={{ width: "20px" }} />
                </span>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="آدرس خیابان"
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <FontAwesomeIcon icon={faCity} style={{ width: "20px" }} />
                </span>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="شهر"
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    style={{ width: "20px" }}
                  />
                </span>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="استان"
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    style={{ width: "20px" }}
                  />
                </span>
                <input
                  type="text"
                  name="postalCode"
                  value={address.postalCode}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="کد پستی"
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    style={{ width: "20px" }}
                  />
                </span>
                <input
                  type="text"
                  name="country"
                  value={address.country}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="کشور"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-warning w-100 mt-3"
              disabled={loading}
            >
              {loading ? "در حال ارسال..." : "ذخیره آدرس"}
            </button>
          </form>

          {/* نمایش آدرس‌های ذخیره شده */}
          <div className="mt-5">
            <h4 className="text-center">آدرس‌های ذخیره شده</h4>
            <ul className="list-group">
              {addresses.map((addr) => (
                <li
                  key={addr.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{addr.title}</strong> - {addr.street}, {addr.city},{" "}
                    {addr.state}, {addr.postalCode}, {addr.country}
                  </div>
                  <div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(addr.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
