import React, { useState } from "react";
import { logout } from "../../assets";
import { message } from "react-message-popup";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { isactivated } from "../../service/api.js";
const MySwal = withReactContent(Swal);

const DashNav = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "Prolongement",
    price: 10,
  });
  const priceForStripe = product.price * 100;
  let user = JSON.parse(sessionStorage.getItem("user"));

  const signout = () => {
    window.sessionStorage.setItem("isAuth", false);
    setTimeout(() => {
      message.success(`See you later ${user.username}`);
      navigate("/login");
    }, 1000);
  };
  const handleSucces = (s) => {
    MySwal.fire({
      icon: "success",
      title: `Vous Compte est activé `,
      time: 4000,
    });
  };
  const handleActivated = (s) => {
    MySwal.fire({
      icon: "info",
      title: `votre compte est déja activé !`,
      time: 4000,
    });
  };

  const handleFailed = (s) => {
    MySwal.fire({
      icon: "error",
      title: `le payement n'est pas effecué  !`,
      time: 4000,
    });
  };
  const activeAccount = async (token) => {
    try {
      //see if count is activted
      const resOfcount = await isactivated(
        JSON.parse(window.sessionStorage.getItem("user"))
      );
      if (resOfcount.data.activated == false) {
        const response = await axios({
          url: "https://server-admin-vf.vercel.app/activeAccount",
          method: "post",
          data: {
            amount: product.price * 100,
            token,
            user: JSON.parse(window.sessionStorage.getItem("user")),
          },
        });
        if (response.status === 200) {
          const response = await axios.post("http://localhost:4001/activer",{reponse:JSON.parse(window.sessionStorage.getItem("user"))})
          if(response.data.success==true){
            handleSucces();
            setTimeout(()=>signout(),3000)
          }else{
            handleFailed();
          }
         
        }
      } else if (resOfcount.data.activated == true) {
        handleActivated();
        setTimeout(()=>signout(),3000)
      }
    } catch (err) {
      console.log(err);
      handleFailed();
    }
  };

  return (
    <motion.div
      whileInView={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center content-center px-10 py-5 bg-[#edf2f8] mb-10"
    >
      <div className="ml-20">
        <h1 className="no-underline m-0 text-2xl font-bold">
          WELCOME {user.username}{" "}
          {JSON.parse(window.sessionStorage.getItem("user")).activated ===
          false ? (
            <>
              {" "}
              <span className=" font-serif text-xl ml-16 font-extrabold underline decoration-double decoration-pink-500">
                Votre compte n'est pas encore activé. Veuillez activer votre
                compte pour continuer.
              </span>{" "}
              <StripeCheckout
                className="text-xl bg-slate-400 mx-5 rounded-lg px-10 py-2 hover:bg-slate-300"
                stripeKey="pk_test_51NHFz6HTNcCgI8IVe8rkmlahe5KeSXvRtjOePwrAz8shwJca3nDaMWgDe6gWr2QEmV2LHYxdn2nl82PAH4y59CCP00whbGueK3"
                label="Activer"
                name="Pay with Credit card"
                billingAddress
                amount={priceForStripe}
                description={`Your total is ${product.price} $`}
                token={activeAccount}
              />
            </>
          ) : null}
        </h1>
      </div>
      <div className="flex items-center justify-center content-center h-8 gap-10">
        <div className="w-8 h-8 cursor-pointer">
          <img onClick={signout} src={logout} alt="logout" className="w-full" />
        </div>
      </div>
    </motion.div>
  );
};

export default DashNav;
