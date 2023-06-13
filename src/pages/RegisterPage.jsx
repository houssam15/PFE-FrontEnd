import React, { useState } from "react";
import { register, login } from "../assets";
import { motion } from "framer-motion";
import { message } from "react-message-popup";
import { createAcount } from "../service/api.js";
import { useNavigate } from "react-router-dom";

const RegisterPage = (props) => {
  const [acount, setAcount] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const navigate = useNavigate();
  const onValueChenge = (e) => {
    setAcount({ ...acount, [e.target.name]: e.target.value });
  };
  const createAccount = (e) => {
    e.preventDefault();

    if (
      acount.username === "" ||
      acount.password === "" ||
      acount.repeatPassword === "" ||
      acount.email === ""
    ) {
      message.warning("Champ empty");
      return;
    }

    if (acount.password !== acount.repeatPassword) {
      message.warning("Repeat password incorrect");
      return;
    }

    createAcount(acount).then((res) => {
      console.log(typeof res.data)
      if (res.data === 1) {
        
        message.success("acount created succesfully");
        navigate("/login");
      } else if (res.data === "-2") {
        message.warning("free sala");
        navigate("/login");
      }else if(res.data=='-1'){
        message.warning("user deja exist !!");

      }else if(res.data=='-3'){
        message.warning("échec liée au network !!");

      }
    });
  };
//hi
  return (
    <>
      <div className="relative min-h-screen grid">
        <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 ">
          {/* Left Side */}
          <div className="relative sm:w-1/2 xl:w-3/5 bg-dark-purple h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden  bg-no-repeat bg-cover">
            {/* <div className="absolute opacity-25 inset-0 z-0"></div> */}
            <div className="w-full lg:max-w-2xl md:max-w-md z-10 items-center text-center ">
              <motion.div
                whileInView={{ x: [-200, 0], opacity: [0, 0.5, 1] }}
                transition={{ duration: 1 }}
              >
                <img src={register} alt="" />
              </motion.div>
              {/* <motion.div
                whileInView={{ x: [-200, 0], opacity: [0, 0.5, 1] }}
                transition={{ duration: 1 }}
                className="mt-5"
              >
                <img src={login} alt="" />
              </motion.div> */}
            </div>
          </div>
          {/* Right Side */}

          <div className="md:flex md:items-center md:justify-left w-full sm:w-auto md:h-full xl:w-1/2 p-6 md:p-8 lg:p-14 sm:rounded-lg md:rounded-none">
            <div className="max-w-xl w-full space-y-10">
              <div className="lg:text-left text-center">
                <div className="flex items-center justify-center ">
                  {/* Form  */}
                  <div className=" flex flex-col w-full px-4 py-6">
                    <div className="font-bold text-4xl text-left pl-1">
                      S'inscrire
                    </div>
                    <form
                      onSubmit={createAccount}
                      className="flex flex-col space-y-6 mt-10"
                    >
                      <label className="font-bold text-lg  text-black">
                        Nom d'utilisateur
                      </label>
                      <input
                        type="text"
                        name="username"
                        defaultValue={""}
                        onChange={(e) => onValueChenge(e)}
                        placeholder="Username"
                        className="border-solid border-2 border-gray-300 rounded-lg p-3 mt-4 placeholder-white-500 outline-none focus:border-dark-purple"
                      />
                      <label className="font-bold text-lg  text-black">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={""}
                        onChange={(e) => onValueChenge(e)}
                        placeholder="Example@email.com"
                        className="border-solid border-2 border-gray-300 rounded-lg p-3 mt-4 placeholder-white-500 outline-none focus:border-dark-purple"
                      />
                      <label className="font-bold text-lg text-black">
                      Mot de passe
                      </label>
                      <input
                        type="password"
                        name="password"
                        defaultValue={""}
                        onChange={(e) => onValueChenge(e)}
                        placeholder="***********"
                        className="border-solid border-2 border-gray-300 rounded-lg p-3 mt-4 placeholder-white-500 outline-none focus:border-dark-purple"
                      />
                      <label className="font-bold text-lg text-black">
                        Répéter le mot de passe
                      </label>
                      <input
                        type="password"
                        name="repeatPassword"
                        defaultValue={""}
                        onChange={(e) => onValueChenge(e)}
                        placeholder="***********"
                        className="border-solid border-2 border-gray-300 rounded-lg p-3 mt-4 placeholder-white-500 outline-none focus:border-dark-purple"
                      />
                      <div className="text-right">
                        <span className="text-dark-purple">
                          Vous avez un compte ?{" "}
                        </span>
                        <a
                          onClick={() => navigate("/login")}
                          className="cursor-pointer text-blue-500 underline transition-"
                        >
                          Connectez-vous
                        </a>
                      </div>
                      <button className="border bg-dark-purple text-white drop-shadow-2xl rounded-lg py-3 font-semibold hover:border-dark-purple hover:bg-white hover:text-dark-purple">
                        Créer un compte
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
