import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  circleArrow,
  logo,
  calendar,
  dashboard,
  result,
  logoClient,
  management,
  customer
} from "../../assets";

const MENUS = [
  { title: "Dashboard", src: dashboard, TO: "" },
  { title: "History", src: calendar, TO: "history" },
  { title: "Management", src: management, TO: "management" },
  {title: "Réactivation", src: customer, TO: "prolongment" }
];

const SideBar = ({ isOpen, setOpen }) => {
  const [currentMenu, setCurrentMenu] = useState("Dashboard");
  return (
    <>
      <aside
        className={`h-screen ${isOpen ? "md:w-60" : "md:w-[100px]"}
         bg-dark-purple  p-5 pt-8  duration-300 text-center fixed top-0 left-0 z-20`}
      >
        <img
          src={circleArrow}
          className={`hidden md:inline-block absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
             border-2 rounded-full  ${!isOpen && "rotate-180"} duration-500 `}
          onClick={() => setOpen(!isOpen)}
        />
        <div className="flex gap-x-4 items-center">
          <img
            src={logoClient}
            className={`cursor-pointer duration-500 w-30 ${
              isOpen && "rotate-[360deg]"
            } w-8 h-8 md:w-14 md:h-14 bg-teal-50 rounded-lg`}
          />
          <div
            className={`hidden md:inline-block duration-200 ${
              !isOpen && "scale-0"
            }`}
          >
            <h1
              className={`text-white origin-left inline no-underline font-medium text-lg`}
            >
              AliDanTek
            </h1>
          </div>
        </div>
        <ul className="pt-6 m-auto text-center">
          {MENUS.map((menu, index) => (
            <NavLink
              key={index}
              to={`${menu.TO}`}
              onClick={() => setCurrentMenu(menu.title)}
            >
              <li
                key={index}
                className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
                ${menu.gap ? "mt-9" : "mt-2"} ${
                  menu.title === currentMenu && "bg-light-white"
                } 
                w-8 h-8 md:w-10 md:h-10`}
              >
                <img src={menu.src} />

                <span
                  className={`${!isOpen && "hidden"} origin-left duration-200`}
                >
                  {menu.title}
                </span>
              </li>
            </NavLink>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default SideBar;
