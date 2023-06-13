import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { SideBar, DashNav } from "../components";

const DashboardUserPage = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div className="flex">
        <SideBar isOpen={isOpen} setOpen={setOpen} />
        <div className={`h-screen flex-1 ${isOpen ? "pl-60" : "pl-16"}`}>
          <DashNav />
          <div className="ml-10">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardUserPage;
