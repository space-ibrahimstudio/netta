import React, { Fragment, useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@ibrahimstudio/button";
import { Input } from "@ibrahimstudio/input";
import { useAuth } from "../libs/securities/auth";
import { useApi } from "../libs/apis/office";
import { useNotifications } from "../components/feedbacks/context/notifications-context";
import { inputValidator } from "../libs/plugins/controller";
import Pages from "../components/frames/pages";
import { LoadingContent } from "../components/feedbacks/screens";
import { Login } from "../components/contents/icons";
import styles from "./styles/login.module.css";

const LoginPage = () => {
  const { isLoggedin, login } = useAuth();
  const { apiCrud } = useApi();
  const { showNotifications } = useNotifications();
  const [portalType, setPortalType] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [inputData, setInputData] = useState({ phone: "", otp: "" });
  const [errors, setErrors] = useState({ phone: "", otp: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevState) => ({ ...prevState, [name]: value }));
    setErrors({ ...errors, [name]: "" });
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    const requiredFields = ["phone"];
    const validationErrors = inputValidator(inputData, requiredFields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const formData = new FormData();
    formData.append("hp", inputData.phone);
    setIsLoading(true);
    try {
      const response = await apiCrud(formData, "authapi", "requestotp");
      if (response.status) {
        showNotifications("success", `Permintaan kode OTP berhasil terkirim ke WhatsApp ${inputData.phone}. Kembali ke Login untuk melanjutkan.`);
      } else {
        showNotifications("danger", "Ada kesalahan saat meminta kode OTP. Periksa koneksi internet dan coba lagi.");
      }
    } catch (error) {
      showNotifications("danger", "Permintaan tidak dapat di proses. Mohon coba sesaat lagi.");
      console.error("error when trying to request otp:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ["phone", "otp"];
    const validationErrors = inputValidator(inputData, requiredFields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    try {
      await login(inputData);
    } catch (error) {
      console.error("error when trying to login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedin) {
    return <Navigate to="/" />;
  }

  return (
    <Pages title="Login" access="public" topmargin="unset" bottommargin="unset" justify="center" bgImage="/img/lock-background.jpg">
      <section className={styles.loginSection}>
        <form className={styles.loginForm} onSubmit={portalType === "login" ? handleSubmit : handleRequestOTP}>
          <header className={styles.formHead}>
            <img className={styles.formLogoIcon} loading="lazy" alt="Admin Login" src="/png/logo.webp" />
            <h1 className={styles.formTitle}>Portal Netta</h1>
            <p className={styles.formDesc}>{portalType === "login" ? "Masukkan Nomor Telepon dan Password untuk mengakses Dashboard." : "Masukkan Nomor Telepon untuk meminta OTP melalui WhatsApp."}</p>
          </header>
          <div className={styles.formHead}>
            {portalType === "login" && (
              <Fragment>
                <Input id="login-phone" labeled={false} placeholder="0881xxxx" type="tel" name="phone" value={inputData.phone} onChange={handleChange} errormsg={errors.phone} required />
                <Input id="login-otp" labeled={false} placeholder="Masukkan password" type="password" name="otp" value={inputData.otp} onChange={handleChange} errormsg={errors.otp} required />
              </Fragment>
            )}
            {portalType === "request" && <Input id="login-phone" labeled={false} placeholder="0881xxxx" type="tel" name="phone" value={inputData.phone} onChange={handleChange} errormsg={errors.phone} required />}
          </div>
          <footer className={styles.formFoot}>
            <Button id={portalType === "login" ? "submit-login" : "submit-phone"} isFullwidth type="submit" buttonText={portalType === "login" ? "Masuk ke Dashboard" : "Request Password"} startContent={<Login />} loadingContent={<LoadingContent />} isLoading={isLoading} />
            <h6 className={styles.formForgot} onClick={portalType === "login" ? () => setPortalType("request") : () => setPortalType("login")}>
              {portalType === "login" ? "Lupa Password?" : "Kembali Login"}
            </h6>
          </footer>
        </form>
      </section>
    </Pages>
  );
};

export default LoginPage;
