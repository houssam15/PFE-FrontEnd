import React, { useState } from "react";
import { login as imglogin } from "../assets";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { message } from "react-message-popup";
import { connectUser } from "../service/api.js";
import useSessionStorage from "../util/useSessionStorage.js";

const LoginPage = () => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [user, setUser] = useSessionStorage({}, "user");

  const navigate = useNavigate();

  const onValueChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };
  const connect = (event) => {
    event.preventDefault();

    if (login.username == "" || login.password == "") {
      message.warning("Username or Password empty");
      return;
    }
    connectUser(login).then((res) => {
      if(res.data.result == "2"){
        message.warning("votre compte est expiré  ")
      }
      if (res.data.result == "1") {
        
        window.sessionStorage.setItem("isAuth", true);
        setTimeout(() => {
          window.sessionStorage.setItem(
            "user",
            JSON.stringify({
              username: res.data.user.username,
              email: res.data.user.email,
              activated:res.data.activated
            })
          );
          var username = JSON.parse(
            window.sessionStorage.getItem("user")
          ).username;
          message.success(`Welcome ${username}`);
          navigate("/dashboard");
        }, 1000);
      } else if (res.data.result == "-1") {
        message.error("User dons't exist ,Are you Create an Acount ?!");
        return;
      } else if (res.data.result == "-2") {
        message.warning("Password not correct ?!");
        return;
      }
    });
  };

  const modepassOublier = async () => {
    /**********************talmnba3d  */
  };
  return (
    <>
      <div className="relative min-h-screen grid">
        <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 ">
          {/* Left Side */}
          <div className="md:flex md:items-center md:justify-left w-full sm:w-auto md:h-full xl:w-1/2 p-6 md:p-8 lg:p-14 sm:rounded-lg md:rounded-none ">
            <div className="max-w-xl w-full space-y-10">
              <div className="lg:text-left text-center">
                <div className="flex items-center justify-center ">
                  {/* Form  */}
                  <div className=" flex flex-col w-full px-4 py-6 flex-1">
                    <div className="font-bold text-4xl text-left pl-1">
                      AliDanTeK
                    </div>
                    <form
                      onSubmit={connect}
                      className="flex flex-col space-y-6 mt-10"
                    >
                      <label className="font-bold text-lg  text-black">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={""}
                        onChange={(e) => onValueChange(e)}
                        placeholder="Your email here"
                        className="border-solid border-2 border-gray-300 rounded-lg p-3 mt-4 placeholder-white-500 outline-none focus:border-dark-purple"
                      />
                      <label className="font-bold text-lg text-black">
                        Mot de passe
                      </label>
                      <input
                        type="password"
                        name="password"
                        defaultValue={""}
                        onChange={(e) => onValueChange(e)}
                        placeholder="***********"
                        className="border-solid border-2 border-gray-300 rounded-lg py-3 px-4 mt-4 placeholder-white-500 outline-none focus:border-dark-purple"
                      />
                      {/* <div className="text-right">
                        <span className="text-dark-purple">
                          Mot de Passe oublier ?
                        </span>
                        <a
                          onClick={() => modepassOublier()}
                          className="cursor-pointer text-blue-500 underline"
                        >
                          click here
                        </a>
                      </div> */}
                      <div className="text-right">
                        <span className="text-dark-purple">
                          Vous n{"'"}avez pas de compte ?
                        </span>
                        <a
                          onClick={() => navigate("/register")}
                          className="cursor-pointer text-blue-500 underline"
                        >
                          Inscrivez-vous
                        </a>
                      </div>
                      <button className="border bg-dark-purple text-white drop-shadow-2xl rounded-lg py-3 font-semibold hover:border-dark-purple hover:bg-white hover:text-dark-purple">
                        Se Connecter
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative sm:w-1/2 xl:w-3/5 bg-dark-purple h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden  bg-no-repeat bg-cover">
            {/* <div className="absolute opacity-25 inset-0 z-0"></div> */}
            <div className="w-full lg:max-w-2xl md:max-w-md z-10 items-center text-center ">
              <motion.div
                whileInView={{ x: [200, 0], opacity: [0, 0.5, 1] }}
                transition={{ duration: 1 }}
              >
                <img src={imglogin} alt="" />
              </motion.div>{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
