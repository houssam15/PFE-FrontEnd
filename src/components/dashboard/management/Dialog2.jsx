import React, { useEffect, useState } from "react";
import { addToDB } from "../../../service/api";
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

const Dialog2 = ({ value, isOpen, onClose }) => {
  const { schema, paramtres, table, primaryKey, sheetName } = value;
  const [editedValues, setEditedValues] = useState({});

  const onValueChange = (e) => {
    const { name, value } = e.target;
    setEditedValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  function add() {
    let check=false;
    if(Object.keys(editedValues).length==0){
      message.info("les champs est vide !")
      return;
    }else if(Object.keys(editedValues).length>0){
      for(let key of Object.keys(editedValues)){
          if(editedValues[key]!=""){
            check = true 
          }
      }
    }
    if(check==false){
      message.info("il faut au moins remplir un champ !")
      return;
    }
    for (let i = 0; i < schema.length; i++) {
      const propName = schema[i];
      if (!editedValues.hasOwnProperty(propName)) {
        editedValues[propName] = "";
      }
    }
    
    addToDB(editedValues, paramtres, table, sheetName)
      .then((res) => {
        if(paramtres.databasePara.databaseType=="mongo"){
          if(res.data.error==false  ){
            message.success(` ajouter avec succés`)
            window.location.reload()
          }
          else if(res.data.error==true ){
            message.error("échec d'ajoute")
            setTimeout(()=>{window.location.reload()
            },500)
          }else {
            message.error("serveur ne repond pas !")
          }
        }else{
          if(res.data.error==false && res.data.added>0){
            message.success(` ajouter avec succés`)
            window.location.reload()

          }else if(res.data.error==false && res.data.added==0){
            message.warning("aucun élement ajouté")
          }else {
            message.error("serveur ne repond pas !")
          }
        }
       
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div style={isOpen ? dialogStyles : null}>
      {isOpen && (
        <>
                  <img src={x} onClick={onClose} alt="x" className="w-7 self-end mb-2 cursor-pointer" />

         
          {schema
            .filter((e) => e != "_id")
            .map((elm) => (
              <input
                style={inputStyle}
                type="text"
                name={elm}
                placeholder={elm}
                onChange={(e) => onValueChange(e)}
                key={elm}
              />
            ))}
          <button className="border-double border-4 border-sky-500  bg-transparent w-4/5 self-center bg-blue-300 rounded-full  hover:bg-blue-500 text-white font-semibold  py-2 px-4 border border-white-500 hover:border-transparent " onClick={add}>
            Add
          </button>
        </>
      )}
    </div>
  );
};

export default Dialog2;
