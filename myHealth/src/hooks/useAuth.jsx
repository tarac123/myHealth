import { createContext, useContext, useState } from "react";
import api from "@/config/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const onLogin = async (email, password) => {
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      return null; // success
    } catch (err) {
      return err?.response?.data || { message: "Login failed" };
    }
  };

  const onRegister = async (email, password) => {
    try {
      const res = await api.post("/register", { email, password });
      // some APIs return token on register, some don't:
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
      }
      return null;
    } catch (err) {
      return err?.response?.data || { message: "Register failed" };
    }
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthed: !!token, onLogin, onRegister, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
