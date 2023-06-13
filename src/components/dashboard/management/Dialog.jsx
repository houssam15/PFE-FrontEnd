import React, { useEffect, useState } from "react";
import { updateDb } from "../../../service/api";
import { message } from "react-message-popup";
import {x} from "../../../assets"
const dialogStyles = {
  width: "500px",
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
  border:" 3px solid rgb(3 7 18)",
  boxShadow:" 0px 4px 10px 0px rgba(0, 0, 0, 0.5)"
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
  width: "80%",
  margin: "0 auto",
  height: "7vh",
  marginBottom: "2vh",
};

const buttonStyle = {
  width: "80%",
  margin: "0 auto",
};

const Dialog = ({ value, isOpen, onClose }) => {
  const { selectedRow, schema, paramtres, table, primaryKey ,sheetName} = value;
  const [editedValues, setEditedValues] = useState({});

  useEffect(()=>{
    if(paramtres.databasePara.databaseType!="excel"){
      if(selectedRow!=null){
        editedValues[primaryKey] = selectedRow[primaryKey]
        setEditedValues(editedValues)
    }
    }
   
    
  })

  const onValueChange = (e) => {
    const { name, value } = e.target;
    setEditedValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const update = () => {
    if(paramtres.databasePara.databaseType!="excel"){
      if (Object.keys(editedValues).length === 1) {
        message.warning("aucun changement éffectue !");
        return;
      }
      
      updateDb(editedValues, paramtres, table, primaryKey)
        .then((res) => {
          if(res.data.ok==true){
            message.success("update succés")
            window.location.reload()

          }else if(res.data.ok==false){
            message.warning("échec de update ")
          }else{
            message.error("error dans le serveur !!")
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }else{
      if (Object.keys(editedValues).length === 0 ) {
        message.warning("aucun changement éffectue !");
        return;
      }
      
      updateDb(editedValues, paramtres, table, primaryKey,sheetName,selectedRow)
        .then((res) => {
          if(res.data.ok==true && res.data.updated>0){
            message.success("update succés")
            window.location.reload()

          }else if(res.data.ok==true && res.data.updated==0){
            message.warning(" update  n'est pas ètè effectuè")
          }else {
            message.error("serveur ne repond pas ")
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    
  };

  return (
    <div style={isOpen ? dialogStyles : null} >
      {isOpen && (
        <>
          
          <img src={x} onClick={onClose} alt="x" className="w-7 self-end mb-2 cursor-pointer" />
          {selectedRow &&
            schema.map((elm) => (
              <input
                 value={editedValues[elm] !== undefined ? editedValues[elm] : selectedRow[elm]}
                readOnly={primaryKey.includes(elm) || elm=="_id"}
                style={inputStyle}
                type="text"
                name={elm}
                placeholder={elm}
                onChange={(e) => onValueChange(e)}
                key={elm}
                className="border-slate-200 placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 w-5"
              />
            ))}
          <button className="border-double border-4 border-sky-500  bg-transparent w-4/5 self-center bg-blue-300 rounded-full  hover:bg-blue-500 text-white font-semibold  py-2 px-4 border border-white-500 hover:border-transparent " onClick={update}>
            Update
          </button>
        </>
      )}
    </div>
  );
};

export default Dialog;
