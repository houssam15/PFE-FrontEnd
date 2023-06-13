import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { deleteFromAllDb } from "../../service/api.js";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { message } from "react-message-popup";


function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  let data =
    location.state && location.state.data
      ? location.state.data
      : "No data found";
  let parametres =
    location.state && location.state.parametres
      ? location.state.parametres
      : "No data found";
  parametres === "No data found"
    ? (parametres = "No data found")
    : (parametres.user = JSON.parse(window.sessionStorage.getItem("user")));
  let resultDbs = [];
  let resultExcel = [];
  if (data !== "No data found") {
    resultDbs = [];
    var keys = Object.keys(data);
    for (let key of keys) {
      if (key !== "excel") {
        for (let database of data[key]) {
          for (let table of database.values) {
            let elm = {
              values: [],
              schema: [],
            };
            let schema = new Set(); // Use a Set to ensure unique keys
            for (let doc of table.docs) {
              doc.tableName = table.tableName;
              doc.database = database.database;
              doc.databaseType = key;
              elm.values.push(doc);
              Object.keys(doc).forEach((k) => schema.add(k)); // Add keys to the set
            }
            elm.schema = Array.from(schema); // Convert the set back to an array
            resultDbs.push(elm);
          }
        }
      } else {
        for (let row of data.excel) {
          let elm = {
            values: [],
            schema: [],
          };
          let schema = new Set(); // Use a Set to ensure unique keys
          for (let found of row.foundRows) {
            found.fileName = row.filePath.split("\\").pop();
            found.fileType = "EXCEL";
            found.location = row.filePath;
            elm.values.push(found);
            Object.keys(found).forEach((k) => schema.add(k)); // Add keys to the set
          }
          elm.schema = Array.from(schema); // Convert the set back to an array
          resultDbs.push(elm);
        }
      }
    }
  }
  async function deleteALl() {
    await deleteFromAllDb(parametres).then((res) => {
      if(res.data.compte!=undefined && res.data.compte=="expired"){
          message.error(res.data.message)
          return
      }
      message.success(`${res.data.deleted} ITEMS DELETED SUCCESSFULLY`);
      navigate("/dashboard");
    });
  }

  if (resultDbs.length === 0 && resultExcel.length === 0) {
    return (
      <div className="flex items-center justify-center text-4xl font-semibold h-[70vh]">
        No data found
      </div>
    );
  }

  const uniqueTables = [...new Set(resultDbs.map((doc) => doc.tableName))];

  console.log(resultDbs);

  // resultDbs = [{schema: ["email", "user"], values: [{ "email": "@dsa", "user": "mohamed"}] }];
  const tables = resultDbs.map((table, index) => {
    let columns = [];
    let rows = [];
    table.schema.map((key) => {
      columns.push({ field: key, headerName: key, flex: 1 });
    });

    let id = 0;
    table.values.map((value) => {
      rows.push({ id, ...value });
      id++;
    });

    if (rows.length !== 0 && columns.length !== 0) {
      return (
        <DataGrid
          columns={columns}
          rows={rows}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      );
    }
  });
  return (
    <>
      {/* <h1 className="m-0 mb-10 ml-10 text-4xl no-underline font-bold">
        Le résultat
      </h1> */}
      <div className="mx-5 flex-col space-y-10">
        {tables}
        {/* Delete Button */}
        {resultDbs.length !== 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => deleteALl()}
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
                Delete
              </span>
              <span className="relative invisible">Delete</span>
            </button>
          </div>
        )}
      </div>
    </>
  );





 }

export default ResultPage;
