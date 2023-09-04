import React, { useEffect, useState } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import { accesToDB, addToDB, deleteFromDb } from "../../../service/api";
import Dialog from "./Dialog.jsx";
import Dialog2 from "./Dialog2.jsx";
import { message } from "react-message-popup";
import DynamiqueAddForm from "./DynamiqueAddForm.jsx";
import { deleteFromTable, systemUpdate, ajoutetUneDb } from "../../../assets";
const Table = () => {
  const navigate = useNavigate();
  const [table, setTable] = useState({
    values: [],
    schema: [],
    primaryKey: "",
  });
  const location = useLocation();
  const [elmToAdd, setElmToAdd] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [primaryKey, setPrimaryKey] = useState("");
  const [addSchema, setAddSchema] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  useEffect(() => {
    accesToDB(
      location.state.elm,
      location.state.recherche,
      JSON.parse(window.sessionStorage.getItem("user"))
    )
      .then((res) => {
        let dataFromMana = res.data.data;
        if (
          location.state.elm.databasePara.databaseType !== "mongo" &&
          location.state.elm.databasePara.databaseType !== "excel"
        ) {
          setTable({
            values: dataFromMana,
            schema: res.data.schema,
            primaryKey: res.data.primaryKey,
          });
        } else if (location.state.elm.databasePara.databaseType == "mongo") {
          setTable((prevState) => ({
            ...prevState,
            values: res.data.data,
            primaryKeys: res.data.primaryKeys,
          }));
        } else {
          setTable((prevState) => ({
            ...prevState,
            values: dataFromMana,
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [location.state.data]);

  function add(row) {
    if (
      location.state.elm.databasePara.databaseType != "mongo" &&
      location.state.elm.databasePara.databaseType != "excel"
    ) {
      addToDB(elmToAdd, location.state.elm, location.state.recherche)
        .then((res) => {
          if (res.data.error == false) {
            message.success("ajouté succés");
            window.location.reload();
          } else if (res.data.error == true) {
            message.warning("ajouté failed : error de duplication");
          } else {
            message.error("serveur ne repond pas !!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setSelectedRow(row);
      setOpen2(true);
    }
  }

  function deleteF(row, elm) {
    let sheetName = elm.sheetName || "";
    deleteFromDb(
      row,
      location.state.elm,
      location.state.recherche,
      JSON.parse(window.sessionStorage.getItem("user")),
      sheetName
    ).then((res) => {
      if (res.data.ok == true && res.data.deleted > 0) {
        message.success("delete succés");
        window.location.reload();
      } else if (res.data.ok == true && res.data.deleted == 0) {
        message.warning("déja delete, refrecher la page !");
      } else {
        message.error("serveur ne repond pas !!");
      }
    });
  }

  function updateF(row) {
    setSelectedRow(row);
    setOpen(true);
  }

  const onValueChange = (e) => {
    setElmToAdd({ ...elmToAdd, [e.target.name]: e.target.value });
  };

  if (
    location.state.elm.databasePara.databaseType !== "mongo" &&
    location.state.elm.databasePara.databaseType !== "excel"
  ) {
    return (
      <div className="flex flex-col mx-10 mb-10">
        <div className="flex justify-between items-center p-3 px-10 rounded-3xl mb-10 bg-[#f0f8ff]">
          <button
            className="py-2 px-10 text-white bg-slate-600 rounded-lg hover:bg-slate-700 font-bold"
            onClick={() => {
              setTimeout(() => {
                navigate("/dashboard/management");
              }, 500);
            }}
          >
            Back
          </button>
          <div className="flex-1 text-center font-bold text-2xl">
            {location.state.elm.databasePara.databaseType.toUpperCase()} →{" "}
            {location.state.elm.databaseName.toUpperCase()} →{" "}
            {location.state.recherche.toUpperCase()}
          </div>
        </div>

        <div className="flex gap-5 mb-10">
          <div className="w-[30%] text-center px-5 rounded-md min-h-screen bg-[#f0f8ff] ">
            {table.schema.map((elm) => (
              <input
                type="text"
                className="mt-5 border border-1 border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50 w-full"
                name={elm}
                placeholder={elm}
                onChange={onValueChange}
                key={elm}
              />
            ))}
            <button
              className="py-1 bg-slate-600  font-semibold hover:bg-slate-700 w-5/6 h-12 text-xl text-white mt-5 rounded-full"
              onClick={() => add()}
              disabled={
                JSON.parse(window.sessionStorage.getItem("user")).activated ===
                false
              }
            >
              AJOUTER
            </button>
          </div>

          <div className="flex-1 text-center">
            <table className="w-full text-sm text-left ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr className="border border-black text-center">
                  {table.schema.map((elm) => (
                    <th
                      scope="col"
                      className="px-6 py-3 border border-black"
                      key={elm}
                    >
                      {elm}
                    </th>
                  ))}
                  <th scope="col" className="px-6 py-3 border border-black">
                    Actions {JSON.parse(window.sessionStorage.getItem("user")).activated===false ? <span>(Désactivé)</span>:null}
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.values.map((row, index) => (
                  <tr
                    class="bg-blue-200 border-b border border-black text-center"
                    key={index}
                  >
                    {Object.keys(row).map((key, index) => (
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border border-black text-center"
                        key={index}
                      >
                        {row[key]}
                      </td>
                    ))}
                    <td className="flex justify-center items-center gap-4">
                      
                      <button
                        disabled={
                          JSON.parse(window.sessionStorage.getItem("user"))
                            .activated === false
                        }
                        onClick={() => deleteF(row, "")}
                        className="cursor-pointer"
                      >
                        <img src={deleteFromTable} alt="" className="w-10 m-2 cursor-pointer" />
                      </button>
                      <button
                        disabled={
                          JSON.parse(window.sessionStorage.getItem("user"))
                            .activated === false
                        }
                        onClick={() => updateF(row)}
                        className="cursor-pointer"
                      >
                        <img src={systemUpdate} alt="" className="w-10" />
                      </button>

                      <Dialog
                        value={{
                          selectedRow,
                          schema: table.schema,
                          paramtres: location.state.elm,
                          table: location.state.recherche,
                          primaryKey: table.primaryKey,
                        }}
                        isOpen={open}
                        onClose={(e) => setOpen(false)}
                      ></Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } else if (location.state.elm.databasePara.databaseType == "mongo") {
    return (
      <div className="flex flex-col mx-10 mb-10">
        <div className="flex justify-between items-center p-3 px-10 rounded-3xl mb-10 bg-[#f0f8ff]">
          <button
            className="py-2 px-10 text-white bg-slate-600 rounded-lg hover:bg-slate-700 font-bold"
            onClick={() => {
              setTimeout(() => {
                navigate("/dashboard/management");
              }, 500);
            }}
          >
            Back
          </button>
          <div className="flex-1 text-center font-bold text-2xl">
            {location.state.elm.databasePara.databaseType.toUpperCase()} →{" "}
            {location.state.elm.databaseName.toUpperCase()} →{" "}
            {location.state.recherche.toUpperCase()}
          </div>
          <button
            disabled={
              JSON.parse(window.sessionStorage.getItem("user")).activated ===
              false
            }
            onClick={(e) => setOpen3(true)}
            className="py-2 px-10 text-white bg-slate-600 rounded-lg hover:bg-slate-700 font-bold"
          >
            NOUVEAU{" "}
          </button>
        </div>

        <div className="text-center mb-10">
          {Array.isArray(table.values) && table.values.length > 0 ? (
            table.values.map((elm) => (
              <table className="w-full text-sm text-left " key={elm.sheetName}>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                  <tr className="border border-black text-center">
                    {elm.schema
                      .filter((e) => e != "_id")
                      .map((el) => (
                        <th
                          scope="col"
                          className="px-6 py-3 border border-black"
                          key={el}
                        >
                          {el}
                        </th>
                      ))}
                    <th scope="col" className="px-6 py-3 border border-black">
                      Actions {JSON.parse(window.sessionStorage.getItem("user")).activated===false ? <span>(Désactivé)</span>:null}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {elm.values.map((row, index) => (
                    <tr
                      class="bg-blue-200 border-b border border-black text-center"
                      key={index}
                    >
                      {Object.keys(row)
                        .filter((e) => e != "_id")
                        .map((key, index) => (
                          <td
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border border-black text-center"
                            key={index}
                          >
                            {row[key]}
                          </td>
                        ))}
                      <td className="flex justify-center items-center gap-4 ">
                        <button
                         onClick={() => deleteF(row, "")}
                         disabled={
                          JSON.parse(window.sessionStorage.getItem("user"))
                            .activated === false
                        }
                        >
                        <img
                          src={deleteFromTable}
                          alt=""
                          className="w-10 mr-5 m-2 cursor-pointer"
                        />
                        </button>
                       <button
                        onClick={() => updateF(row)}
                        disabled={
                          JSON.parse(window.sessionStorage.getItem("user"))
                            .activated === false
                        }
                       >
                       <img
                          src={systemUpdate}
                          alt=""
                          className="w-10  mr-5 cursor-pointer"
                        />
                       </button>
                        
                        {/* <img src={ajoutetUneDb} alt="" onClick={() => add(row)}  className="w-10 cursor-pointer" /> */}
                      </td>
                    </tr>
                  ))}

                  {selectedRow !== undefined && (
                    <>
                      <Dialog
                        value={{
                          selectedRow,
                          schema: selectedRow ? Object.keys(selectedRow) : [],
                          paramtres: location.state.elm,
                          table: location.state.recherche,
                          primaryKey: table.primaryKeys
                            ? table.primaryKeys
                            : ["_id"],
                          sheetName: elm.sheetName,
                        }}
                        isOpen={open}
                        onClose={(e) => setOpen(false)}
                      ></Dialog>
                      <Dialog2
                        value={{
                          schema: selectedRow ? Object.keys(selectedRow) : [],
                          paramtres: location.state.elm,
                          table: location.state.recherche,
                          primaryKey: "_id",
                          sheetName: elm.sheetName,
                        }}
                        isOpen={open2}
                        onClose={(e) => setOpen2(false)}
                      ></Dialog2>
                    </>
                  )}
                </tbody>
              </table>
            ))
          ) : (
            <div
              style={{
                margin: "0 auto ",
                width: "30%",
                marginTop: "15vh",
                textAlign: "center",
                lineHeight: "7vh",
                fontSize: "x-large",
                fontWeight: "900",
              }}
            >
              NO DATA FOUND !!
            </div>
          )}
          <DynamiqueAddForm
            value={{
              paramtres: location.state.elm,
              table: location.state.recherche,
            }}
            isOpen={open3}
            onClose={(e) => setOpen3(false)}
          ></DynamiqueAddForm>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col mx-10 mb-10">
        <div className="flex justify-between items-center p-3 px-10 rounded-3xl mb-10 bg-[#f0f8ff]">
          <button
            className="py-2 px-10 text-white bg-slate-600 rounded-lg hover:bg-slate-700 font-bold"
            onClick={() => {
              setTimeout(() => {
                navigate("/dashboard/management");
              }, 500);
            }}
          >
            Back
          </button>
          <div className="flex-1 text-center font-bold text-2xl">
            {location.state.elm.databasePara.databaseType.toUpperCase()} →{" "}
            {location.state.recherche.substring(
              location.state.recherche.lastIndexOf("\\") + 1
            )}
          </div>
          <button
            disabled={
              JSON.parse(window.sessionStorage.getItem("user")).activated ===
              false
            }
            onClick={(e) => setOpen3(true)}
            className="py-2 px-10 text-white bg-slate-600 rounded-lg hover:bg-slate-700 font-bold"
          >
            NOUVEAU SHEET{" "}
          </button>
        </div>
        <div className="text-center mb-10">
          {table.values.length > 0 ? (
            table.values.map((elm) => (
              <div key={elm}>
                <h3
                  style={{
                    margin: "0 auto",
                    width: "20%",
                    textAlign: "center",
                    marginTop: "2vh",
                    marginBottom: "2vh",
                  }}
                  className="bg-slate-300 py-2 rounded-full font-bold text-lg cursor-grab"
                >
                  {elm.sheetName}
                </h3>
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr className="border border-black text-center">
                      {elm.schema.map((key) => (
                        <th
                          scope="col"
                          className="px-6 py-3 border border-black"
                          key={key}
                        >
                          {key}
                        </th>
                      ))}
                      <th scope="col" className="px-6 py-3 border border-black">
                        Actions {JSON.parse(window.sessionStorage.getItem("user")).activated===false ? <span>(Désactivé)</span>:null}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {elm.data.map((row, index) => (
                      <tr
                        class="bg-blue-200 border-b border border-black text-center"
                        key={index}
                      >
                        {Object.keys(row).map((key, index) => (
                          <td
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border border-black text-center"
                            key={index}
                          >
                            {row[key]}
                          </td>
                        ))}
                        <td className="flex justify-center items-center gap-4">
                          <button
                          disabled={
                            JSON.parse(window.sessionStorage.getItem("user"))
                              .activated === false
                          }
                          onClick={() => deleteF(row, elm)}
                          >
                          <img
                            src={deleteFromTable}
                            alt=""
                            className="w-10 mr-5 m-2 cursor-pointer"
                          />
                          </button>
                         <button
                          onClick={() => updateF(row)}
                          disabled={
                            JSON.parse(window.sessionStorage.getItem("user"))
                              .activated === false
                          }
                         >
                         <img
                            src={systemUpdate}
                            alt=""
                            className="w-10  mr-5 cursor-pointer"
                          />
                         </button>
                          <button
                          disabled={
                            JSON.parse(window.sessionStorage.getItem("user"))
                              .activated === false
                          }
                          onClick={() => add(row)}
                          >
                          <img
                            src={ajoutetUneDb}
                            alt=""
                            
                            className="w-10 cursor-pointer"
                          />
                          </button>
                          
                        </td>
                      </tr>
                    ))}
                    {selectedRow !== undefined && (
                      <>
                        <Dialog
                          value={{
                            selectedRow,
                            schema: selectedRow ? Object.keys(selectedRow) : [],
                            paramtres: location.state.elm,
                            table: location.state.recherche,
                            primaryKey: "_id",
                            sheetName: elm.sheetName,
                          }}
                          isOpen={open}
                          onClose={(e) => setOpen(false)}
                        ></Dialog>
                        <Dialog2
                          value={{
                            schema: selectedRow ? Object.keys(selectedRow) : [],
                            paramtres: location.state.elm,
                            table: location.state.recherche,
                            primaryKey: "_id",
                            sheetName: elm.sheetName,
                          }}
                          isOpen={open2}
                          onClose={(e) => setOpen2(false)}
                        ></Dialog2>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <div
              style={{
                margin: "0 auto ",
                width: "30%",
                marginTop: "15vh",
                textAlign: "center",
                lineHeight: "7vh",
                fontSize: "x-large",
                fontWeight: "900",
              }}
            >
              NO DATA FOUND !!
            </div>
          )}
          <DynamiqueAddForm
            value={{
              paramtres: location.state.elm,
              table: location.state.recherche,
            }}
            isOpen={open3}
            onClose={(e) => setOpen3(false)}
          ></DynamiqueAddForm>
        </div>
      </div>
    );
  }
};

export default Table;
