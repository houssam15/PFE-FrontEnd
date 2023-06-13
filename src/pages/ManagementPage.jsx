import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabaseInfo, deleteDatabaseService } from "../service/api.js";
import { close } from "../assets";
import { message } from "react-message-popup";
import { MultiStepsForm } from "../components/index.js";

const ManagementPage = () => {
  const navigate = useNavigate();
  const [recherche, setRecherche] = useState("");
  const [form, setForm] = useState({
    databaseType: "",
    username: "",
    password: "",
    host: "",
    port: "",
    connectionString: "",
  });
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await getDatabaseInfo(
        JSON.parse(window.sessionStorage.getItem("user"))
      );
      const newData = removeDuplicateObjects(response.data.databases);
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (recherche == "") {
      fetchData();
    }
  }, [recherche]);
  function onValueChange(event) {
    setRecherche(event.target.value);
    let filtredData = data.filter((row) =>
      JSON.stringify(row).includes(recherche)
    );
    setData(filtredData);
  }
  function removeDuplicateObjects(array) {
    const uniqueTitles = new Set();
    const resultArray = [];
    for (const obj of array) {
      if (!uniqueTitles.has(obj.id)) {
        uniqueTitles.add(obj.id);
        resultArray.push(obj);
      }
    }
    return resultArray;
  }
  function deleteDatabase(elm) {
    deleteDatabaseService(
      elm,
      JSON.parse(window.sessionStorage.getItem("user"))
    )
      .then((res) => {
        if(res.data.deleted>0){
          message.success("suppression succés")
          setTimeout(() => {
            window.location.reload()
          }, 500);
    }else if(res.data.deleted==0){
          message.warning("déja supprimé !")
        }else{
          message.error("serveur ne répond pas ")
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const handleChange = (event) => {
    setRecherche(event.target.value);
  };
  function access(elm) {
    if (recherche == "") {
      message.warning("Choose a table !!");
      return;
    }
    navigate("/dashboard/table", { state: { elm: elm, recherche: recherche } });
  }

  return (
    <div className="px-8 pb-10 ">
      {/* Search bar */}

      <div className="w-full bg-[#f0f8ff] flex justify-between items-center p-5 rounded-lg mb-10">
        <input
          name="recherche"
          type="text"
          placeholder="Rechercher"
          onChange={onValueChange}
          className="border border-1 md:w-[80%] border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50"
        />
        <div className="flex justify-center items-center w-14 h-14 bg-dark-purple rounded-full">
          <p className="text-xl text-white">{data.length}</p>
        </div>
      </div>

      {/* Databases */}

      <div className="w-full bg-[#f0f8ff] text-center p-3 rounded-3xl mb-10">
        <p className="font-bold text-2xl">Your Databases</p>
      </div>
      <div style={{width:"100%"}} className="overflow-hidden  block">
        {data.length > 0 ? (
          <ul  className="px-10 py-5 flex flex-no-wrap gap-10 max-w-[1500px] overflow-x-auto  scrolling-touch">
            {data.map((elm, index) => (
              <li 
                className="flex flex-col min-w-[400px] p-3 space-y-5 justify-around rounded-lg"
                style={{ backgroundColor: `${elm.color}` }}
                key={index}
              >
                <div className="flex justify-between items-center">
                  {" "}
                  <p className="font-bold text-lg">
                    {elm.databasePara.databaseType}
                  </p>
                  <h3
                    className={`text-white flex-1 text-center   ${
                      elm.informations.title.length > 20
                        ? "font-bold text-xl"
                        : "font-bold text-3xl"
                    }`}
                  >
                    {elm.informations.title}
                  </h3>
                  <div
                    className="w-6 h-6 mr-2 cursor-pointer hover:p-1 transition-all"
                    onClick={() => deleteDatabase(elm)}
                  >
                    <img src={close} alt="" />        
                  </div>
                </div>
               
                <div className="flex justify-around items-center">
                  <select
                    name="databaseType"
                    placeholder="Choisir un Tableaux"
                    defaultValue={""}
                    className="flex-1 max-w-[50%] py-3 px-2 rounded-lg"
                    onChange={handleChange}
                  >
                    <option disabled value="">
                      Choisir un Tableau
                    </option>
                    {elm.tables.map((table, tableIndex) => (
                      <option value={table} key={tableIndex}>
                        {table}
                      </option>
                    ))}
                  </select>
                  <button
                    className="py-2 px-10 bg-slate-100 rounded-lg hover:bg-slate-200"
                    onClick={() => access(elm)}
                  >
                    <span className="font-bold">Accés</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No databases found.</p>
        )}
      </div>

      <div className="w-full bg-[#f0f8ff] text-center p-3 rounded-3xl my-10">
        <p className="font-bold text-2xl">Ajouter une database</p>
      </div>

      <div className="">
        <MultiStepsForm />
      </div>
    </div>
  );
};

export default ManagementPage;
