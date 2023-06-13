import React, { useEffect, useState } from "react";
import { addToDB } from "../../../service/api.js";
import { message } from "react-message-popup";
import { minus, plus, x } from "../../../assets";
const dialogStyles = {
  width: "1000px",
  maxHeight: "70vh",
  maxWidth: "100%",
  margin: "0 auto",
  position: "fixed",
  left: "50%",
  top: "50%",
  transform: "translate(-50%,-50%)",
  zIndex: "999",
  backgroundColor: "#eee",
  padding: "10px 20px 40px",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  overflowY: "scroll",
  border: " 3px solid rgb(3 7 18)",
  boxShadow: " 0px 4px 10px 0px rgba(0, 0, 0, 0.5)",
};

const dialogCloseButtonStyles = {
  marginBottom: "15px",
  padding: "3px 8px",
  cursor: "pointer",
  borderRadius: "50%",
  border: "none",
  width: "30px",
  height: "30px",
  fontWeight: "bold",
  alignSelf: "flex-end",
};

const inputStyle = {
  width: "30%",
  height: "6vh",
  marginBottom: "2vh",
};

const buttonStyle = {
  width: "10%",
  margin: "0 auto",
  marginRight: "60px",
  height: "5vh",
  width: "auto",
  marginTop: "10px",
};
const buttonStyle_add = {
  width: "50%",
  margin: "0 auto",
  height: "7vh",
  backgroundColor: "whitesmoke",
  color: "black",
};

const DynamiqueAddForm = ({ value, isOpen, onClose }) => {
  const [formFields, setFormFields] = useState([{ key: "", value: "" }]);
  const { paramtres, table } = value;
  const [sheetName, setSheetName] = useState({
    sheetName: "",
    dejaexist: false,
  });
  //pour handle change
  const handleFormChange = (event, index) => {
    let form = [...formFields];
    form[index][event.target.name] = event.target.value;
    setFormFields(form);
  };
  //handle sheet name
  function onValueChange(e) {
    if (e.target.name == "sheetName") {
      setSheetName({ ...sheetName, [e.target.name]: e.target.value });
    } else {
      setSheetName({ ...sheetName, [e.target.name]: e.target.checked });
    }
  }

  //pour delete une key value
  const removeFields = (index) => {
    let data = [...formFields];
    if (formFields.length == 1) {
      message.error("you can't DELETE AGAIN !!!");
      return;
    }

    data.splice(index, 1);
    setFormFields(data);
  };
  //pour add une key value
  const addFields = () => {
    let object = { key: "", value: "" };
    setFormFields([...formFields, object]);
  };
  /************************ */
  function add() {
    const elm = {};
    formFields.forEach((item) => {
      elm[item.key] = item.value;
    });
    if (paramtres.databasePara.databaseType == "excel") {
      if (sheetName.name == "") {
        message.error("le nom de sheet est vide  !!");
        return;
      }
      if (formFields.length == 0) {
        message.error("entrer des valeurs !! ");
        return;
      }
      const isEmptyField = formFields.some(
        (e) => e.key === "" || e.value === ""
      );
      if (isEmptyField) {
        message.error("Un <key> ou <value> est vide !!");
        return;
      }
      addToDB(elm, paramtres, table, sheetName)
        .then((res) => {
          if(res.data.error==false && res.data.added>0){
            message.success("ajouter succés")
            setTimeout(() => {
              window.location.reload()
            }, 500);
          }else if(res.data.error==false && res.data.added==0){
            message.warning("aucun element ajouter !")

          }else if(res.data.error==true){
            message.error("sheet déja exist !")
          }else{
            message.error("serveur ne repond pas !")
          }

        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      if (formFields.length == 0) {
        message.error("entrer quelque keys !! ");
        return;
      }
      const isEmptyField = formFields.some(
        (e) => e.key === "" || e.value === ""
      );
      if (isEmptyField) {
        message.error("Un <key> ou <value> est vide !!");
        return;
      }
      addToDB(elm, paramtres, table)
        .then((res) => {
          
          if(res.data.error==false){
            message.success("ajoute succés")
            setTimeout(() => {
              window.location.reload()
            }, 500);
          }else if(res.data.error==true){
            message.warning("échec de l'ajoute !")
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  /************************** */
  if (paramtres.databasePara.databaseType == "excel") {
    return (
      <div style={isOpen ? dialogStyles : null}>
        {isOpen && (
          <>
            <img
              src={x}
              onClick={onClose}
              alt="x"
              className="w-7 self-end mb-2 cursor-pointer"
            />

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "85%",
                marginLeft: "7.5%",
              }}
            >
              <div style={{ width: "80%", textAlign: "start" }}>
                <h5>Entrer le Nom de Sheet : </h5>
                <input
                  onChange={(e) => onValueChange(e)}
                  style={{ width: "32.7em", height: "7vh" }}
                  type="text"
                  name="sheetName"
                  placeholder=" Sheet Name"
                />

                <h5> Entrer un nouveau élement : </h5>
              </div>
              <div>
                <h5>Crée si il n'exist pas ? </h5>
                <input
                  type="checkbox"
                  name="dejaexist"
                  onChange={(e) => onValueChange(e)}
                />
              </div>
            </div>

            {formFields.map((form, index) => {
              return (
                <div className="flex mx-7 my-0 ms-10 w-70% ps-10">
                  <input
                    name="key"
                    placeholder="Key"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.key}
                    type="text"
                    style={inputStyle}
                    className="mx-5 my-2"
                  />
                  <input
                    name="value"
                    placeholder="Value"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.value}
                    type="text"
                    style={inputStyle}
                    className="mx-5 my-2"
                  />
                  <div className="flex flex-row w-20 align-middle ml-10 ">
                    <img
                      src={minus}
                      onClick={() => removeFields(index)}
                      alt="x"
                      style={buttonStyle}
                    />
                    <img
                      src={plus}
                      onClick={addFields}
                      alt="x"
                      style={buttonStyle}
                    />
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => add()}
              className="border-double border-4 border-sky-500  bg-transparent w-1/4 self-center bg-blue-300 rounded-full  hover:bg-blue-500 text-white font-semibold  py-2 px-4 border border-white-500 hover:border-transparent "
            >
              Add
            </button>
          </>
        )}
      </div>
    );
  } else {
    return (
      <div style={isOpen ? dialogStyles : null}>
        {isOpen && (
          <>
            <img
              src={x}
              onClick={onClose}
              alt="x"
              className="w-7 self-end mb-2 cursor-pointer"
            />

            {formFields.map((form, index) => {
              return (
                <div className="flex mx-7 my-0 ms-10 w-70% ps-10">
                  <input
                    name="key"
                    placeholder="Key"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.key}
                    type="text"
                    style={inputStyle}
                    className="mx-5 my-2"
                  />
                  <input
                    name="value"
                    placeholder="Value"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.value}
                    type="text"
                    style={inputStyle}
                    className="mx-5 my-2"
                  />
                  <div className="flex flex-row w-20 align-middle ml-10 ">
                    <img
                      src={minus}
                      onClick={() => removeFields(index)}
                      alt="x"
                      style={buttonStyle}
                    />
                    <img
                      src={plus}
                      onClick={addFields}
                      alt="x"
                      style={buttonStyle}
                    />
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => add()}
              className="border-double border-4 border-sky-500  bg-transparent w-4/5 self-center bg-blue-300 rounded-full  hover:bg-blue-500 text-white font-semibold  py-2 px-4 border border-white-500 hover:border-transparent "
            >
              Add
            </button>
          </>
        )}
      </div>
    );
  }
};

export default DynamiqueAddForm;
