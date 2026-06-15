import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";
import logo from "../../../public/assets/img/logo.png";
import defaultProfilePic from "../../../public/assets/img/profilImage.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserEdit,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCity,
  faHome,
  faEdit,
  faTrash,
  faArrowLeft,
  faSignOutAlt,
  faPrint,
  faTimesCircle,
  faCheckCircle,
  faSpinner,
  faCreditCard,
  faFileInvoice,
  faShoppingBag,
  faLocationDot,
  faReceipt,
  faUser,
  faAddressCard,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import MainLayout from "@layouts/Main";
import FooterMobile from "@components/Navbars/AppNav/FooterMobile";

export default function Profile({ header }) {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [address, setAddress] = useState({
    name: "",
    address: "",
    city: "",
    post_code: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [editAddressId, setEditAddressId] = useState(null);
  const [myFactors, setMyFactors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function fetchUserData() {
    try {
      const userInfo = localStorage.getItem("userInfoKrabo");
      const token = userInfo ? JSON.parse(userInfo).token : null;

      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(
        "https://python.krabo.gold/api/user/profile/",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserData(response?.data);
    } catch (error) {
      if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        localStorage.removeItem("userInfoKrabo");
        router.push("/login");
      }
      setError("اطلاعات شما یافت نشد");
    } finally {
      setLoading(false);
    }
  }

  async function fetchFactorData() {
    try {
      const userInfo = localStorage.getItem("userInfoKrabo");
      const token = userInfo ? JSON.parse(userInfo).token : null;

      if (!token) throw new Error("No token found");

      const response = await axios.post(
        "https://python.krabo.gold/api/order/my-factor/",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setMyFactors(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch factors:", error);
    }
  }

  async function fetchSavedAddresses() {
    try {
      const userInfo = localStorage.getItem("userInfoKrabo");
      const token = userInfo ? JSON.parse(userInfo).token : null;

      if (!token) throw new Error("No token found");

      const response = await axios.get(
        "https://python.krabo.gold/api/user/my-address/",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAddresses(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  }

  useEffect(() => {
    fetchUserData();
    fetchSavedAddresses();
    fetchFactorData();
  }, []);

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userInfo = localStorage.getItem("userInfoKrabo");
      const token = userInfo ? JSON.parse(userInfo).token : null;

      if (!token) throw new Error("No token found");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      if (editAddressId) {
        await axios.put(
          "https://python.krabo.gold/api/user/my-address/",
          { ...address, id: editAddressId },
          { headers }
        );
      } else {
        await axios.post(
          "https://python.krabo.gold/api/user/my-address/",
          address,
          { headers }
        );
      }

      await fetchSavedAddresses();
      setAddress({ name: "", address: "", city: "", post_code: "" });
      setEditAddressId(null);
    } catch (error) {
      console.error("Failed to add/edit address:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (addr) => {
    setAddress({
      name: addr.name,
      address: addr.address,
      city: addr.city,
      post_code: addr.post_code,
    });
    setEditAddressId(addr.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف این آدرس مطمئن هستید؟")) return;

    try {
      const userInfo = localStorage.getItem("userInfoKrabo");
      const token = userInfo ? JSON.parse(userInfo).token : null;

      if (!token) throw new Error("No token found");

      await axios.delete("https://python.krabo.gold/api/user/my-address/", {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });

      await fetchSavedAddresses();
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const getStatusInfo = (statusCode) => {
    switch (statusCode) {
      case 0:
        return { text: "لغو شده", icon: faTimesCircle, color: "#dc3545", bg: "#dc354510" };
      case 1:
        return { text: "پرداخت شده", icon: faCheckCircle, color: "#28a745", bg: "#28a74510" };
      case 2:
        return { text: "در انتظار پرداخت", icon: faCreditCard, color: "#ffc107", bg: "#ffc10710" };
      case 3:
        return { text: "ارسال شده", icon: faShoppingBag, color: "#17a2b8", bg: "#17a2b810" };
      case 4:
        return { text: "پیش فاکتور", icon: faFileInvoice, color: "#6c757d", bg: "#6c757d10" };
      default:
        return { text: "نامعلوم", icon: faTimesCircle, color: "#6c757d", bg: "#6c757d10" };
    }
  };

  const tabs = [
    { id: "profile", label: "پروفایل", icon: faUser },
    { id: "address", label: "آدرس‌ها", icon: faLocationDot },
    { id: "factor", label: "فاکتورها", icon: faReceipt },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <div className="error-text">{error}</div>
        <div className="error-buttons">
          <button onClick={() => router.push("/")} className="error-btn home-btn">
            بازگشت به صفحه اصلی
          </button>
          <button onClick={() => router.push("/login")} className="error-btn login-btn">
            صفحه ورود
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MainLayout isRTL>
        <div className="profile-page">
          {/* Header Section */}
          <div className="profile-header">
            <button onClick={() => router.push("/")} className="back-button">
              <FontAwesomeIcon icon={faChevronLeft} />
              <span>بازگشت</span>
            </button>
            <div className="profile-header-content">
              <div className="profile-avatar">
                <Image
                  src={userData?.profilePic || defaultProfilePic}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="avatar-image"
                />
              </div>
              <h1 className="profile-name">{userData?.username || "کاربر گرامی"}</h1>
              <p className="profile-email">{userData?.email || userData?.mobile}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-24">
            <div className="tabs-wrapper">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <FontAwesomeIcon icon={tab.icon} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="content-wrapper">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="profile-tab">
                <div className="info-card">
                  <div className="info-row">
                    <div className="info-label">
                      <FontAwesomeIcon icon={faUser} />
                      <span>نام کاربری</span>
                    </div>
                    <div className="info-value">{userData?.username || "—"}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">
                      <FontAwesomeIcon icon={faEnvelope} />
                      <span>ایمیل</span>
                    </div>
                    <div className="info-value">{userData?.email || "—"}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">
                      <FontAwesomeIcon icon={faPhone} />
                      <span>شماره موبایل</span>
                    </div>
                    <div className="info-value">{userData?.mobile || "—"}</div>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      localStorage.removeItem("userInfoKrabo");
                      router.push("/login");
                    }}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    خروج از حساب
                  </button>
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === "address" && (
              <div className="address-tab">
                <form onSubmit={handleSubmit} className="address-form">
                  <h3 className="form-title">
                    {editAddressId ? "ویرایش آدرس" : "افزودن آدرس جدید"}
                  </h3>
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      value={address.name}
                      onChange={handleChange}
                      placeholder="عنوان آدرس (مثال: منزل، محل کار)"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="address"
                      value={address.address}
                      onChange={handleChange}
                      placeholder="آدرس کامل"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        placeholder="شهر"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="post_code"
                        value={address.post_code}
                        onChange={handleChange}
                        placeholder="کد پستی"
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                    {isSubmitting ? "در حال ذخیره..." : editAddressId ? "به‌روزرسانی آدرس" : "ذخیره آدرس"}
                  </button>
                </form>

                <div className="addresses-list">
                  <h3 className="list-title">آدرس‌های ذخیره شده</h3>
                  {addresses.length > 0 ? (
                    <div className="address-grid">
                      {addresses.map(addr => (
                        <div key={addr.id} className="address-item">
                          <div className="address-header">
                            <span className="address-name">{addr.name}</span>
                            <div className="address-actions">
                              <button onClick={() => handleEdit(addr)} className="action-icon edit">
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button onClick={() => handleDelete(addr.id)} className="action-icon delete">
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </div>
                          <p className="address-text">{addr.address}</p>
                          <p className="address-meta">{addr.city} • {addr.post_code}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <FontAwesomeIcon icon={faLocationDot} />
                      <p>هیچ آدرسی ثبت نشده است</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Factor Tab - ALL STATUSES ENABLED */}
            {activeTab === "factor" && (
              <div className="factor-tab">
                <h3 className="list-title">لیست فاکتورها</h3>
                {myFactors.length > 0 ? (
                  <div className="factors-list">
                    {myFactors.map(item => {
                      const status = getStatusInfo(item.status_code);
                      // ✅ دکمه پرداخت فقط برای پیش فاکتور (4) و در انتظار پرداخت (2)
                      const canPay = item.status_code === 2 || item.status_code === 4;

                      return (
                        <div key={item.id} className="factor-item">
                          <div className="factor-info">
                            <span className="factor-number">#{item.id}</span>
                            <div className="factor-status" style={{ background: status.bg, color: status.color }}>
                              <FontAwesomeIcon icon={status.icon} />
                              <span>{status.text}</span>
                            </div>
                          </div>

                          <div className="factor-actions">
                            {/* ✅ دکمه پرداخت - فقط برای فاکتورهای پرداخت نشده */}
                            {canPay && (
                              <button
                                className="factor-action pay-btn"
                                onClick={() => {
                                  window.open(
                                    `http://krabo.gold:3421/api/order/go-to-geteway/?id=${item.id}`,
                                    "_blank"
                                  );
                                }}
                              >
                                <FontAwesomeIcon icon={faCreditCard} />
                                پرداخت
                              </button>
                            )}

                            {/* دکمه چاپ فاکتور - برای همه وضعیت‌ها */}
                            <button
                              className="factor-action print-btn"
                              onClick={() => {
                                router.push(`/factor/${item.id}`);
                              }}
                            >
                              <FontAwesomeIcon icon={faPrint} />
                              چاپ فاکتور
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <FontAwesomeIcon icon={faReceipt} />
                    <p>هیچ فاکتوری یافت نشد</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </MainLayout>
      <FooterMobile location="home" header={header?.data?.data} />

      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding-bottom: 80px;
        }

        /* Header Section */
        .profile-header {
          background: linear-gradient(135deg, #880a0a 0%, #6b0506 100%);
          padding: 30px 20px 60px;
          position: relative;
          border-radius: 0 0 30px 30px;
        }

        .back-button {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-3px);
        }

        .profile-header-content {
          text-align: center;
          margin-top: 10px;
        }

        .profile-avatar {
          position: relative;
          display: inline-block;
        }

        .avatar-image {
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          background: white;
        }

        .profile-name {
          color: white;
          margin: 12px 0 4px;
          font-size: 20px;
          font-weight: 600;
        }

        .profile-email {
          color: rgba(255, 255, 255, 0.8);
          font-size: 13px;
        }

        /* Tabs */
        .tabs-wrapper {
          display: flex;
          background: white;
          margin: -25px 16px 0;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .tab-button {
          flex: 1;
          padding: 14px 8px;
          background: transparent;
          border: none;
          font-size: 14px;
          font-weight: 500;
          color: #6c757d;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .tab-button.active {
          color: #880a0a;
          background: #fff5f5;
          position: relative;
        }

        .tab-button.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #880a0a;
        }

        /* Content Wrapper */
        .content-wrapper {
          padding: 20px 16px;
        }

        /* Info Card */
        .info-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #6c757d;
          font-size: 14px;
        }

        .info-label svg {
          width: 18px;
          color: #880a0a;
        }

        .info-value {
          font-weight: 500;
          color: #2c3e50;
          font-size: 14px;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 12px;
        }

/* Factor Actions Container */
.factor-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Pay Button */
.factor-action.pay-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.factor-action.pay-btn:hover {
  background: linear-gradient(135deg, #218838 0%, #1aa179 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

/* Print Button */
.factor-action.print-btn {
  background: #880a0a;
  color: white;
}

.factor-action.print-btn:hover {
  background: #6b0506;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(136, 10, 10, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .factor-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .factor-action {
    width: 100%;
    justify-content: center;
  }
}


        .btn {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #880a0a;
          color: white;
        }

        .btn-primary:hover {
          background: #6b0506;
          transform: translateY(-2px);
        }

        .btn-danger {
          background: #f8f9fa;
          color: #dc3545;
          border: 1px solid #dc3545;
        }

        .btn-danger:hover {
          background: #dc3545;
          color: white;
        }

        .btn-block {
          width: 100%;
        }

        /* Address Form */
        .address-form {
          background: white;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .form-title {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 16px;
        }

        .form-group {
          margin-bottom: 12px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #880a0a;
          box-shadow: 0 0 0 3px rgba(136, 10, 10, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* Addresses List */
        .list-title {
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 16px;
        }

        .address-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .address-item {
          background: white;
          border-radius: 16px;
          padding: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .address-item:hover {
          transform: translateX(-4px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .address-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .address-name {
          background: #880a0a10;
          color: #880a0a;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .address-actions {
          display: flex;
          gap: 8px;
        }

        .action-icon {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-icon.edit {
          background: #ffc10720;
          color: #ffc107;
        }

        .action-icon.delete {
          background: #dc354520;
          color: #dc3545;
        }

        .action-icon:hover {
          transform: scale(1.05);
        }

        .address-text {
          font-size: 14px;
          color: #495057;
          margin: 8px 0 4px;
        }

        .address-meta {
          font-size: 12px;
          color: #6c757d;
        }

        /* Factors List */
        .factors-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .factor-item {
          background: white;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .factor-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .factor-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .factor-number {
          font-weight: 700;
          font-size: 16px;
          color: #2c3e50;
        }

        .factor-status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .factor-action {
          background: #880a0a;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .factor-action:hover {
          background: #6b0506;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(136, 10, 10, 0.3);
        }

        /* Empty State */
        .empty-state {
          background: white;
          border-radius: 20px;
          padding: 48px 20px;
          text-align: center;
          color: #6c757d;
        }

        .empty-state svg {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state p {
          margin: 0;
          font-size: 14px;
        }

        /* Loading & Error States */
        .loading-container,
        .error-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #880a0a 0%, #6b0506 100%);
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          color: white;
          margin-top: 16px;
          font-size: 16px;
        }

        .error-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .error-text {
          color: white;
          font-size: 18px;
          margin-bottom: 24px;
        }

        .error-buttons {
          display: flex;
          gap: 12px;
        }

        .error-btn {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .error-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .profile-header {
            padding: 20px 16px 50px;
          }

          .tabs-wrapper {
            margin: -20px 12px 0;
          }

          .tab-button span {
            display: none;
          }

          .tab-button svg {
            width: 20px;
            height: 20px;
          }

          .content-wrapper {
            padding: 16px 12px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .factor-info {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .factor-item {
            flex-direction: column;
            text-align: center;
          }
          
          .factor-action {
            width: 100%;
            justify-content: center;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .profile-page {
            max-width: 800px;
            margin: 0 auto;
          }
        }

        @media (min-width: 1025px) {
          .profile-page {
            max-width: 900px;
            margin: 0 auto;
          }
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps(context) {
  const fs = require("fs");
  const path = require("path");

  let header = {};

  try {
    const headerPath = path.join(process.cwd(), "header.json");
    const data = fs.readFileSync(headerPath, "utf-8");
    header = {
      status: 200,
      success: true,
      data: JSON.parse(data),
    };
  } catch (error) {
    header = {
      status: 500,
      message: "not found",
      success: false,
      data: { menu: [] }
    };
  }

  return {
    props: {
      header: header,
    },
  };
}