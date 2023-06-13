import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LastoperationsCompenent from "./Lastoperations.jsx";
import {
  ConnectToDbs,
  getHistory,
  getLastOperations,
} from "../../service/api.js";
import { message } from "react-message-popup";

import { add, remove } from "../../assets";

const AddDB = () => {
  const [data, setData] = useState({
    databases: [
      {
        databaseType: "",
        username: "",
        password: "",
        connectionString: "",
        directory: "",
      },
    ],
    recherche: { email: "", nom: "", prenom: "", telephone: "" },
  });

  const [formFields, setFormFields] = useState([
    {
      databaseType: "",
      username: "",
      password: "",
      connectionString: "",
      directory: "",
      port: "",
      host: "",
    },
  ]);

  const [recherche, setRecherche] = useState({
    email: "",
    nom: "",
    prenom: "",
    telephone: "",
  });

  /******************************** */
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getLastOperations(
          JSON.parse(window.sessionStorage.getItem("user")).email
        );
        if (res.data.length > 0) {
          setHistory(res.data);
        } else {
          setHistory([]);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);
  /********************************** */

  const navigate = useNavigate();
  const handleFormChange = (event, index) => {
    let form = [...formFields];
    form[index][event.target.name] = event.target.value;
    setFormFields(form);
  };
  const onValueChenge = (e) => {
    setRecherche({ ...recherche, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    data.databases = formFields;
    data.recherche = recherche;
    let check = false;
    for (let database of data.databases) {
      if (database.databaseType == "") {
        check = true;
      } else if (
        !["excel", "mongo"].includes(database.databaseType) &&
        database.port == "" &&
        database.host == ""
      ) {
        message.warning("Port ou Host est vide pour " + database.databaseType);
        return;
      } else if (
        !["mongo", "excel"].includes(database.databaseType) &&
        database.username == ""
      ) {
        message.warning(`Enter USERNAME for ${database.databaseType}  !!!`);
        return;
      } else if (
        database.databaseType == "mongodb" &&
        database.connectionString == ""
      ) {
        message.warning(
          `Enter the CONNECTION STRING for ${database.databaseType} !!!`
        );
        return;
      } else if (database.databaseType == "excel" && database.direction == "") {
        message.warning(`Enter  DIRECTION for ${database.databaseType} !!!`);
        return;
      }
    }
    if (check == true) {
      message.info("DATABASE TYPE are empty !!!");
      return;
    }
    let hasDuplicates = false;
    if (formFields.length > 1) {
      for (let i = 0; i < formFields.length; i++) {
        for (let j = i + 1; j < formFields.length; j++) {
          if (formFields[i].databaseType === formFields[j].databaseType) {
            hasDuplicates = true;
            break;
          }
        }
      }
      if (hasDuplicates == true) {
        message.warning("duplicate DATABASE TYPE !!!");
        return;
      }
    }
    let notempty = 0
    for(let key of Object.keys(recherche)){
      if(recherche[key]!=""){
        notempty+=1;
      }
    }
    if(notempty==0){
      message.error("Veuillez fournir au moins un critère de recherche !!")
      return;
    }
    ConnectToDbs(data)
      .then((res) => {
        var keys = Object.keys(res.data);
        let var1 = [];
        for (let key of keys) {
          
          if (key == "mysql" && res.data[key] == -1) {
            var1.push("MYSQL");
          } else if (key == "mongo" && res.data[key] == -1) {
            var1.push("MONGO");
          } else if (key == "postgre" && res.data[key] == -1) {
            var1.push("POSTGRE");
          } else if (key == "sqlserver" && res.data[key] == -1) {
            var1.push("SQLSERVER");
          }
        }
        if (var1.length >= 1) {
          message.error(`AUTHOTIFICATION ERROR IN : ${var1}`);
          return;
        }
        let var2 = [];
        for (let key of keys) {
          if (key == "mysql" && res.data[key] == -2) {
            var2.push("MYSQL");
          } else if (key == "mongo" && res.data[key] == -2) {
            var2.push("MONGO");
          } else if (key == "postgre" && res.data[key] == -2) {
            var2.push("POSTGRE");
          } else if (key == "sqlserver" && res.data[key] == -2) {
            var2.push("SQLSERVER");
          }
        }
        if (var2.length >= 1) {
          message.error(
            `ERROR :  " ${var2} DATABASE  DON'T HAVE THESE COLUMNS" `
          );
          return;
        }

        if (
          !recherche.email &&
          !recherche.nom &&
          !recherche.prenom &&
          !recherche.telephone
        ) {
          message.warning("Please enter somting");
          return;
        }
        let leng =0

        for(let elm of Object.keys(res.data)){
          for(let elmm of res.data[elm]){
           if(elmm.values==undefined){
            for(let elmmm of elmm.foundRows){
              leng+=elmmm.length 
         }
           }else{
            for(let elmmm of elmm.values){
                 leng+=elmmm.docs.length 
            }
           }  
          }
        }
        if(leng==0){
          message.error("NO DATA FOUND !!")
          return ;
        }  
        message.success("succesfully");
        navigate("result", { state: { data: res.data, parametres: data } });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addFields = () => {
    let object = { databaseType: "", username: "", password: "" };
    if (formFields.length == 6) {
      message.warning("You can't ADD AGAIN !!!");
      return;
    }
    setFormFields([...formFields, object]);
  };
  const removeFields = (index) => {
    let data = [...formFields];
    if (formFields.length == 1) {
      message.warning("You can't DELETE AGAIN !!!");
      return;
    }
    data.splice(index, 1);
    setFormFields(data);
  };
  return (
    <>
      <div className="mx-auto w-full border border-spacing-1 border-gray-400 rounded-xl mt-10 p-12">
        <h1 className="m-2 text-2xl no-underline uppercase font-bold mb-2">
          Database
        </h1>
        {/* ADD NEW DATABASE */}
        <div className="">
          {formFields.map((form, index) => {
            return (
              <div
                className="flex flex-wrap items-center justify-center gap-4 border border-spacing-1 border-gray-400 rounded-xl p-4 shadow-lg shadow-gray-500/50 mb-5"
                id={form.databaseType}
                key={index}
              >
                <select
                  name="databaseType"
                  id={form.databaseType + "Select"}
                  placeholder="select"
                  value={form.databaseType}
                  onChange={(event) => handleFormChange(event, index)}
                  className="border border-1 border-solid rounded-md outline-none focus:border-dark-purple focus:shadow-lg focus:shadow-gray-500/50 border-gray-300  px-2 py-4"
                >
                  <option disabled value="">
                    Select a type
                  </option>
                  <option value="mysql">MySQL</option>
                  <option value="mongo">MongoDB</option>
                  <option value="postgres">PostgreSQL</option>
                  <option value="excel">Excel</option>
                  <option value="sqlserver">Sql Server</option>
                </select>
                
                {form.databaseType === "mongo" ? (
                  <input
                    name="connectionString"
                    placeholder="Connection String"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.connectionString}
                    type="text"
                    className="border border-1 md:w-[650px] border-solid rounded-md outline-none focus:border-dark-purple focus:shadow-lg focus:shadow-gray-500/50 border-gray-300  px-2 py-4"
                  />
                 
                ) : form.databaseType === "excel" ? (
                  <input
                    name="directory"
                    placeholder="Directory"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.directory}
                    className="border border-1 md:w-[650px] border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50"
                  />
                ) : (
                  <>
                    <input
                      id={form.databaseType + "ost"}
                      name="host"
                      type="text"
                      placeholder="Host"
                      onChange={(event) => handleFormChange(event, index)}
                      value={form.host}
                      className="border border-1 md:max-w-[150px]  border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50"
                    />
                    <input
                      id={form.databaseType + "port"}
                      name="port"
                      type="text"
                      placeholder="Port"
                      onChange={(event) => handleFormChange(event, index)}
                      value={form.port}
                      className="border border-1 md:max-w-[150px]  border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50"
                    />
                    <input
                      name="username"
                      placeholder="Username"
                      onChange={(event) => handleFormChange(event, index)}
                      value={form.username}
                      className="border border-1 md:max-w-[150px] border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50"
                    />
                    <input
                      name="password"
                      placeholder="Password"
                      onChange={(event) => handleFormChange(event, index)}
                      value={form.password}
                      type="password"
                      className="border border-1 md:max-w-[150px] border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50"
                    />
                  </>
                )}

                <div className="place-self-center ">
                  <button
                    onClick={() => removeFields(index)}
                    className="w-12 h-12 bg-white mr-3 hover:p-1"
                  >
                    <img src={remove} />
                  </button>
                  <button
                    onClick={addFields}
                    className="w-12 h-12 bg-white hover:p-1"
                  >
                    <img src={add} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {/* END ADD NEW DATABASE */}

        {/* Search USER DATA */}
        <div className="flex flex-col gap-5 w-[80%] m-auto">
          <h1 className="m-2 text-2xl no-underline uppercase font-bold">
            Informations
          </h1>
          <input
            type="text"
            placeholder="Email"
            name="email"
            onChange={(e) => onValueChenge(e)}
            className="lg:w-3/5 w-full border border-1 border-solid rounded-md outline-none focus:border-dark-purple border-gray-300 px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50 self-center h-12"
          />
          <input
            type="text"
            placeholder="Nom"
            name="nom"
            onChange={(e) => onValueChenge(e)}
            className="lg:w-3/5 w-full border border-1 border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50 self-center h-12"
          />
          <input
            type="text"
            placeholder="Prenom"
            name="prenom"
            onChange={(e) => onValueChenge(e)}
            className="lg:w-3/5 w-full border border-1 border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50 self-center h-12"
          />
          <input
            type="number"
            placeholder="Phone Number"
            name="telephone"
            onChange={(e) => onValueChenge(e)}
            className="lg:w-3/5 w-full border border-1 border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50 self-center h-12"
          />
          <button
            disabled={JSON.parse(window.sessionStorage.getItem("user")).activated==false}
            onClick={submit}
            className="lg:w-3/5 w-full bg-white relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-dark-purple rounded-full shadow-md group self-center"
          >
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-dark-purple group-hover:translate-x-0 ease">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className=" bg-white absolute flex items-center justify-center w-full h-full text-dark-purple transition-all duration-300 transform group-hover:translate-x-full ease">
              Search
            </span>
            <span className="relative invisible">Search</span>
          </button>
        </div>
        {/* End Search USER DATA */}
      </div>

  {/* <LastoperationsCompenent history={history} /> */}
    </>
  );
};

export default AddDB;
