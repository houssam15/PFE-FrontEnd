import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AddDB from "./AddDB";
import { cards } from "../../service/api.js";
import { logoClient } from "../../assets";

const MainDashboard = () => {
  const [numSupRestant, setNumSupRestant] = useState(0);
  const [derSupDate, setDerSupDate] = useState(0);
  const [numSup, setNumSup] = useState(0);
  const [maxsup, setMaxsup] = useState(0);

  useEffect(() => {
    cards(JSON.parse(window.sessionStorage.getItem("user")).email).then(
      (res) => {
        setNumSupRestant(res.data.remaining);
        setDerSupDate(res.data.lastDelete);
        setNumSup(res.data.numberDeleted);
        setMaxsup(res.data.maxDel);
      }
    );
  });
  
  return (
    <div>
      <h1 className="m-0 mb-10 ml-10 text-4xl no-underline font-bold">
        Overview
      </h1>
      <div className="p-4">
        {/* Head */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-full cursor-help border border-spacing-1 border-gray-100 shadow-lg shadow-gray-500/50 rounded-md md:p-4 p-6"
          >
            <p className="text-[0.9rem] text-gray-500 capitalize">
              Nombre de suppressions restantes
            </p>
            <div className="text-center text-4xl font-bold my-4">
              {numSupRestant}
            </div>
            
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-full cursor-help border border-spacing-1 border-gray-100 shadow-lg shadow-gray-500/50 rounded-md md:p-4 p-6"
          >
            <p className="text-[0.9rem] text-gray-500 capitalize">
              suppression N°
            </p>
            <div className="text-center text-4xl font-bold my-4">{numSup}</div>
            <p className={`text-[12px] text-black capitalize`}>
              number Max De suppression :{" "}
              <span className="text-green-600">{maxsup}</span>
            </p>
          </motion.div>
        </motion.div>
        {/*  */}
        <AddDB />
      </div>
      <div
        style={{
          alignItems: "center",
          position: "absolute",
          top: "16vh",
          right: "10%",
        }}
      >
        <img
          src={logoClient}
          alt=""
          style={{ width: "50vh", height: "90%", marginLeft: "25%" }}
        />
      </div>
    </div>
  );
};

export default MainDashboard;
