import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  ManagementPage,
  ProlongmentPage
} from "./pages";
import {
  Historique,
  MainDashboard,
  Result,
  Table,
} from "./components/index.js";
import PrivateRoute from "./privateRoute/index1";
import PrivateRoute2 from "./privateRoute/index2";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/login"
            element={
              <PrivateRoute2>
                <LoginPage />
              </PrivateRoute2>
            }
          />
          <Route
            path="/register"
            element={
              <PrivateRoute2>
                <RegisterPage />
              </PrivateRoute2>
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          >
            <Route path="" element={<PrivateRoute><MainDashboard /></PrivateRoute>} />
            
            {/* History */}
            <Route path="history" element={<PrivateRoute><Historique /></PrivateRoute>} />

            {/* Result */}
            <Route path="result" element={<PrivateRoute><Result /></PrivateRoute>} />
            {/* prolongement */ }
            <Route path="prolongment" element={<PrivateRoute><ProlongmentPage /></PrivateRoute>} />

            {/* Management */}
            <Route
              path="management"
              element={
                <PrivateRoute>
                  <ManagementPage />
                </PrivateRoute>
              }
            />

            {/* Table */}
            <Route
              path="table"
              element={
                <PrivateRoute>
                  <Table />
                </PrivateRoute>
              }
            />
          </Route>
          {/* <Route path="/404" element={<NotfoundPage />} />
          <Route path="/*" element={<Navigate to="/404" />} /> */}
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
