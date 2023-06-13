import React from "react";
import { Navigate } from "react-router-dom";
import useSessionStorage from "../util/useSessionStorage.js";

const PrivateRoute2 = ({ children }) => {
  const [isAuth, setIsAuth] = useSessionStorage(false, "isAuth");
  return !isAuth  ? children : <Navigate to={"/dashboard"}></Navigate>;
};
export default PrivateRoute2;
