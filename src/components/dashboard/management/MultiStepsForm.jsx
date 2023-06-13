import React, { useEffect, useState } from "react";
import { addDbStep1, AddDatabase } from "../../../service/api.js";
import "./MultiStepsForm.scss";
import { message } from "react-message-popup";

function MultiStepsForm() {
  const [step, setStep] = useState(1);
  const [databasePara, setDatabasePara] = useState({
    username: "",
    password: "",
    host: "",
    port: "",
    connectionString: "",
    databaseType: "",
    directory: "",
  });
  const [disabled, setDisabled] = useState({
    dis1: false,
    dis2: false,
  });
  const [databases, setDatabases] = useState([]);
  const [filesName, setFilesName] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState([]);
  const [informations, setInformations] = useState({
    title: "",
  });

  const nextStep = async () => {
    if (step === 1) {
      if (
        databasePara.databaseType === "mongo" &&
        databasePara.connectionString === ""
      ) {
        message.warning("Connection string is empty!");
        return;
      } else if (
        databasePara.databaseType === "excel" &&
        databasePara.directory === ""
      ) {
        message.warning("Directory is empty!");
        return;
      } else if (databasePara.databaseType === "") {
        message.warning("Please choose the database type!");
        return;
      } else if (
        databasePara.databaseType !== "mongo" &&
        databasePara.databaseType !== "excel" &&
        (databasePara.username === "" ||
          databasePara.host === "" ||
          databasePara.port === "")
      ) {
        message.warning("One or more fields are empty!");
        return;
      }

      const dbs = await addDbStep1(
        databasePara,
        JSON.parse(window.sessionStorage.getItem("user"))
      );
      if (dbs.data.error === false) {
        if (dbs.data.docs.filesPath.length == 0) {
          message.warning("Aucun Base de Donnée available dans ce serveur!!");
          return;
        }
        setDatabases(dbs.data.docs.filesPath);
        if (databasePara.databaseType === "excel") {
          setFilesName(dbs.data.docs.filesName);
        }
      } else {
        message.warning("Username or other field is incorrect!");
        return;
      }
    } else if (step === 2) {
      if (!selectedDatabase) {
        message.warning("Please select a database");
        return;
      }

      if (databasePara.databaseType == "excel") {
        if (filesName.length == 0) {
          message.warning("you can acces files in <<Votre Database>> ↑↑↑");
          return;
        }
      } else {
        if (databases.length == 0) {
          message.warning(
            "you can acces yourDatabases in <<Votre Database>> ↑↑↑"
          );
          return;
        }
      }
    }
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  function handleFormChange(event) {
    setDatabasePara((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));

    if (
      databasePara.username !== "" ||
      databasePara.password !== "" ||
      databasePara.host !== "" ||
      databasePara.port !== ""
    ) {
      setDisabled({ dis1: false, dis2: false });
    }
  }

  const handleInformationsChange = (event) => {
    setInformations((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  function submit() {
    if (step === 3) {
      if (informations.title === "") {
        message.warning("s'il vous plait donnée un titre a votre database !");
        return;
      }
    }

    AddDatabase(
      databasePara,
      selectedDatabase,
      informations,
      JSON.parse(window.sessionStorage.getItem("user"))
    ).then((res) => {
      if(res.data.error==false){
        message.success("ajoute success");
        window.location.reload()

      }else if(res.data.error==true){
        message.warning("échec d'ajoute ");
      }else{
        message.error("serveur ne repond pas !")
      }
    });
  }

  function addTablesSelected(event) {
    if (event.target.checked) {
      setSelectedDatabase((prevSelected) => [
        ...prevSelected,
        event.target.value,
      ]);
    } else {
      setSelectedDatabase((prevSelected) =>
        prevSelected.filter((element) => element !== event.target.value)
      );
    }
  }



  return (
    <div id="msform">
      <ul id="progressbar">
        <li className={step === 1 ? "active" : ""}>Connect</li>
        <li className={step === 2 ? "active" : ""}>Database</li>
        <li className={step === 3 ? "active" : ""}>Information</li>
      </ul>
      {step === 1 && (
        <fieldset className="flex justify-center items-center bg-white box-border w-full border border-gray-500 shadow-2xl rounded-md px-5 py-7">
          <div className="flex flex-col space-y-6 w-[70%]">
            <div className="w-full bg-[#f0f8ff] text-center p-3 rounded-3xl">
              <h2 className="self-center font-bold text-xl">
                Connect To Server
              </h2>
            </div>
            <h3 className="self-center text-gray-400 font-serif tracking-widest">
              This is step 1
            </h3>
            <select
              name="databaseType"
              placeholder="select"
              onChange={handleFormChange}
              className="border border-1 border-solid rounded-md outline-none focus:border-dark-purple focus:shadow-lg focus:shadow-gray-500/50 border-gray-300  px-2 py-4"
              value={databasePara.databaseType}
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
            {databasePara.databaseType === "excel" ? (
              <>
                <p className="">Enter a directory:</p>

                <input
                  className="border border-1 border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50 w-full"
                  type="text"
                  name="directory"
                  placeholder="Directory"
                  value={databasePara.directory}
                  onChange={handleFormChange}
                />
              </>
            ) : databasePara.databaseType === "mongo" ? (
              <>
                <p className="Title">Enter the Connection String:</p>
                <input
                  className="border border-1 border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50 w-full"
                  type="text"
                  name="connectionString"
                  placeholder="ConnectionString"
                  value={databasePara.connectionString}
                  onChange={handleFormChange}
                />
              </>
            ) : (
              <>
                <input
                  className="border border-1 border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50 w-full"
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleFormChange}
                  value={databasePara.username}
                />
                <input
                  className="border border-1 border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50 w-full"
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleFormChange}
                  value={databasePara.password}
                />
                <input
                  className="border border-1 border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50 w-full"
                  type="text"
                  name="host"
                  placeholder="Host"
                  onChange={handleFormChange}
                  value={databasePara.host}
                />
                <input
                  className="border border-1 border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50 w-full"
                  type="text"
                  name="port"
                  placeholder="Port"
                  onChange={handleFormChange}
                  value={databasePara.port}
                />
              </>
            )}
            {/* <input
              type="button"
              name="next"
              className="next action-button"
              value="Next"
              onClick={nextStep}
            /> */}

            {/* Button */}
            <button
              onClick={nextStep}
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
                Next
              </span>
              <span className="relative invisible">Next</span>
            </button>
          </div>
        </fieldset>
      )}
      {step === 2 && (
        <fieldset className="flex justify-center items-center bg-white box-border w-full border border-gray-500 shadow-2xl rounded-md px-5 py-7">
          <div className="flex flex-col space-y-6 w-[70%]">
            <div className="w-full bg-[#f0f8ff] text-center p-3 rounded-3xl">
              <h2 className="self-center font-bold text-xl">
                Choose a Database
              </h2>
            </div>
            <h3 className="self-center text-gray-400 font-serif tracking-widest">
              This is step 2
            </h3>
            <div style={{ overflowY: "scroll", maxHeight: "40vh" }}>
              {databases.length > 0 &&
                databases.map((elm) => (
                  <div
                    className="tooltip"
                    style={{
                      width: "60%",
                      height: "50px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#f0f8ff",
                      margin: "0 auto",
                      marginBottom: "10px",
                      padding: "0 10px",
                      borderRadius: "5px",
                      borderBottom: "1px solid white",
                      fontSize: "x-large",
                    }}
                    key={elm}
                  >
                    {databasePara.databaseType === "excel" ? (
                      <>
                        {/* <span className="tooltiptext">{elm}</span> */}
                        <h3 htmlFor="" className="text-lg">
                          {filesName[databases.indexOf(elm)]}
                        </h3>
                        <input
                          type="checkbox"
                          name={elm}
                          value={elm}
                          checked={selectedDatabase.includes(elm)}
                          onChange={addTablesSelected}
                          className="text-xl"
                        />
                      </>
                    ) : (
                      <>
                        <h3 htmlFor="" className="text-lg">
                          {elm}
                        </h3>
                        <input
                          type="radio"
                          name="selectedDatabase"
                          value={elm}
                          checked={selectedDatabase.includes(elm)}
                          onChange={(event) =>
                            setSelectedDatabase([event.target.value])
                          }
                          className="text-xl"
                        />
                      </>
                    )}
                  </div>
                ))}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={prevStep}
                className="w-1/4 bg-white relative inline-flex items-center justify-center p-2 px-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-dark-purple rounded-full shadow-md group self-center"
              >
                <span className="bg-white absolute flex items-center justify-center w-full h-full text-dark-purple transition-all duration-300 transform group-hover:-translate-x-full ease">
                  Previous
                </span>
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 translate-x-full bg-green-500 group-hover:translate-x-0 ease">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                  </svg>
                </span>
                <span className="relative invisible">Previous</span>
              </button>

              <button
                onClick={nextStep}
                className="w-1/4 bg-white relative inline-flex items-center justify-center p-2 px-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-dark-purple rounded-full shadow-md group self-center"
              >
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-dark-purple group-hover:translate-x-0 ease">
                  <svg
                    className="w-4 h-4"
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
                <span className="bg-white absolute flex items-center justify-center w-full h-full text-dark-purple transition-all duration-300 transform group-hover:translate-x-full ease">
                  Next
                </span>
                <span className="relative invisible">Next</span>
              </button>
            </div>
          </div>
        </fieldset>
      )}
      {step === 3 && (
        <fieldset className="flex justify-center items-center bg-white box-border w-full border border-gray-500 shadow-2xl rounded-md px-5 py-7">
          <div className="flex flex-col space-y-6 w-[70%]">
            <div className="w-full bg-[#f0f8ff] text-center p-3 rounded-3xl">
              <h2 className="self-center font-bold text-xl">
                Enter Some Information
              </h2>
            </div>
            <h3 className="self-center text-gray-400 font-serif tracking-widest">
              Last step 3
            </h3>
            <input
              type="text"
              name="title"
              onChange={handleInformationsChange}
              placeholder="Title"
              className="border border-1 border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50 w-full"
            />
                        <div className="flex justify-center space-x-4">

           <button
                onClick={prevStep}
                className="w-1/4 bg-white relative inline-flex items-center justify-center p-2 px-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-dark-purple rounded-full shadow-md group self-center"
              >
                <span className="bg-white absolute flex items-center justify-center w-full h-full text-dark-purple transition-all duration-300 transform group-hover:-translate-x-full ease">
                  Previous
                </span>
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 translate-x-full bg-green-500 group-hover:translate-x-0 ease">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                  </svg>
                </span>
                <span className="relative invisible">Previous</span>
              </button>
              <button className="rounded-full bg-slate-300 border-double border-4 border-sky-500 w-1/4  hover:bg-sky-200" onClick={submit}> Submit</button>





              
            </div>
          </div>
        </fieldset>
      )}
    </div>
  );
}

export default MultiStepsForm;


