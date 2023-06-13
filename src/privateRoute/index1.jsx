import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useLocalState } from "../util/useLocalStorage";
import useSessionStorage from "../util/useSessionStorage.js";

const PrivateRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useSessionStorage(false, "isAuth");
      return isAuth  ? children : <Navigate to={"/login"}></Navigate>;
};

export default PrivateRoute;
