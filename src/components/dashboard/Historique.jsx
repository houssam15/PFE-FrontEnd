import React, { useEffect, useState } from "react";
import { restoreData, getHistory, deleteHistory } from "../../service/api.js";
import { x ,restoreHistory} from "../../assets/index.js";
import { message } from "react-message-popup";
import { columnGroupsStateInitializer } from "@mui/x-data-grid/internals";

const Historique = () => {
  const [recherche, setRecherche] = useState("");
  const [data, setData] = useState([]);
  const [originData,setOriginData] = useState([])
  useEffect(() => {
    getHistory(JSON.parse(window.sessionStorage.getItem("user")).email)
      .then((re) => {
        setOriginData(re.data)
        setData(re.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (recherche=="") {
      setData(originData);
    }
  }, [recherche]);

  useEffect(() => {
    if (data === undefined) {
      setData([]);
    }
  }, [data]);

  const onValueChange = (e) => {
    setRecherche(e.target.value);
    let filteredData = data.filter((row) =>
      JSON.stringify(row).includes(recherche)
    );
    setData(filteredData);
  };
  const removeFromFiltered = (row) => {
    setData(data.filter((element) => element !== row));
  };

  const handleRestore = () => {
    const confirmation = window.confirm(
      `Do you want to restore ${data.length} elements?`
    );
    if (confirmation) {
      restoreData(data, JSON.parse(window.sessionStorage.getItem("user")))
        .then((res) => {
          
            message.success(JSON.stringify(res.data));

         
          setTimeout(() => {
          window.location.reload()
        }, 500);


          getHistory(JSON.parse(window.sessionStorage.getItem("user")).email)
            .then((re) => {
              setData(re.data);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
function restore(elm){
  const confirmation = window.confirm(
    `Restorer cette element ?`
  );
  if (confirmation) {
    let d=[]
    d.push(elm)
    restoreData(d, JSON.parse(window.sessionStorage.getItem("user")))
      .then((res) => {
        message.success(JSON.stringify(res.data));
        setTimeout(() => {
          window.location.reload()
        }, 500);
        getHistory(JSON.parse(window.sessionStorage.getItem("user")).email)
          .then((re) => {
            setData(re.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
  const VideHistory = () => {
    const confirmation = window.confirm(`Delete permanently?`);
    if (confirmation) {
      deleteHistory(
        data,
        JSON.parse(window.sessionStorage.getItem("user"))
      ).then((res) => {
        if (res.data.ok) {
          
          if (res.data.ok === 1) {
            getHistory(JSON.parse(window.sessionStorage.getItem("user")).email)
              .then((re) => {
                setData(re.data);
              })
              .catch((err) => {
                console.log(err);
              });
            if (message) {
              message.success("vider succés");
              setTimeout(() => {
                window.location.reload()
              }, 500);
            }
          } else {
            if (message) {
              message.error("Unable to clear the history!");
            }
          }
        }
      });
    }
  };
  

  if (data === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Search bar  */}
      <div className="  bg-[#f0f8ff]  flex justify-between  items-center p-5 rounded-lg mb-10  mx-10">
        <input
          name="recherche"
          type="text"
          placeholder="Enter a criteria"
          onChange={onValueChange}
          value={recherche}
          className="border border-1 md:w-[70%] border-solid rounded-md outline-none focus:border-dark-purple border-gray-300  px-2 py-4 focus:shadow-lg focus:shadow-gray-500/50"
        />
        <div className="space-x-3">
          <button
            onClick={handleRestore}
            className="py-2 px-10 text-white bg-slate-600 rounded-lg hover:bg-slate-700"
            disabled={data.length == 0 ? true : false}
          >
            Restore
          </button>
          <button
            onClick={VideHistory}
            className="py-2 px-10 text-white bg-slate-600 rounded-lg hover:bg-slate-700"
            disabled={data.length == 0 ? true : false}
          >
            Vider
          </button>
        </div>
      </div>
      {/* End Search bar  */}

      {/* History table */}
      <div  className="flex  items-center flex-col ">
        <h1 className="m-5 text-4xl no-underline uppercase font-bold">
          History
        </h1>

        {data.length > 0 ? (
          data.map((elm) => (
            <div className="relative overflow-x-auto max-w-[1050px]  pb-5 rounded-sm">
              <table className="w-full text-sm text-left  ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                  <tr className="border border-black text-center">
                    {Object.keys(elm.rowdeleted).map((key) => (
                      <th
                        scope="col"
                        className="px-6 py-3 border border-black"
                        key={key}
                      >
                        {key}
                      </th>
                    ))}
                    <th scope="col" className="px-6 py-3 border border-black">
                      databaseType
                    </th>
                    <th scope="col" className="px-6 py-3 border border-black">
                      databaseName
                    </th>
                    <th scope="col" className="px-6 py-3 border border-black">
                      tableName
                    </th>
                    <th scope="col" className="px-6 py-3 border border-black">
                      Restore
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-blue-200 border-b border border-black text-center">
                    {Object.values(elm.rowdeleted).map((value, index) => (
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border border-black text-center"
                        key={index}
                      >
                        {value}
                      </td>
                    ))}
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border border-black text-center"
                    >
                      {elm.databaseType}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border border-black text-center"
                    >
                      {elm.databaseName}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border border-black text-center"
                    >
                      {elm.tableName}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border border-black text-center"
                    >
                      <button
                        className="w-10  h-6 mr-5"
                        onClick={() => restore(elm)}
                      >
                        
                        <img  src={restoreHistory} alt="" />

                      </button>
                      <button
                                              onClick={() => removeFromFiltered(elm)}

                        className="w-9 h-6 "
                      >
                        <img className="w-8 mb-1" src={x} alt="" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center font-bold text-2xl h-[50vh]">
            Historique est vide!
          </div>
        )}
      </div>
    </>
  );
};

export default Historique;
