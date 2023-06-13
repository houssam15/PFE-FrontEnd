import React, { useEffect, useState } from "react";
import {getNumberSuppression} from "../service/api.js"
import StripeCheckout from "react-stripe-checkout"
import axios from "axios"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)


function Prolongment(){
    const [openDialog,setOpenDialog]=useState({open:false,e:false,rest:0})
 
    useEffect(() => {
        const checkSuppression = async () => {
          try {
            const res = await getNumberSuppression(JSON.parse(window.sessionStorage.getItem('user')));
            if (res.data.suppression === 1000) {
              setOpenDialog(prevState => ({ ...prevState, open: true ,e:false}));
            } else if (res.data.suppression < 1000) {
              setOpenDialog(prevState => ({ ...prevState, open: false ,e:false,rest:res.data.suppression}));
            } else {
              setOpenDialog(prevState => ({ ...prevState, e: false ,e:true}));
            }
          } catch (err) {
            console.log(err);
          }
        };
    
        checkSuppression();
      }, []);
    
    const [product,setProduct] = useState({
        name : "Réactivation",
        price :10
    })
    const priceForStripe = product.price*100;
    const handleSuccess = ()=>{
        MySwal.fire({
            icon : 'success',
            title:'Payment was successful',
            time:4000,
        })
    }
    const handleFailure = ()=>{
        MySwal.fire({
            icon : 'error',
            title:'Payment was not successful',
            time:4000,
        })
    }
    
    const handleError = ()=>{
        MySwal.fire({
            icon : 'error',
            title:'Server don\'t respose',
            time:4000,
        })
    }
    const handleSuppression = (s)=>{
        MySwal.fire({
            icon : 'info',
            title:`vous avez encore ${1000-s} suppression ✌️`,
            time:4000,
        })
    }
    const payNow = async token => {
        try{
            const response = await axios({
                url:"http://localhost:4002/payement",
                method:'post',
                data: {
                    amount : product.price*100,
                    token,
                    user:JSON.parse(window.sessionStorage.getItem("user"))
                }
                })
            if(response.status===200){
                handleSuccess()
            }
            // if(res.data.suppression==1000){

            
            // }else if(res.data.suppression<1000){
            //     handleSuppression(res.data.suppression)
            // }else{
            //     handleError()
            // }
            
        }catch(err){
            handleFailure()
            console.log(err)
        }
    }
    
      
    
    
 return(
 <>
    {/* <div className="w-2/3 bg-[#edf2f8] min-h-[50%] text-center mx-auto h-80 rounded-lg text-2xl font-mono font-bold bg-gradient-to-r from-cyan-500 to-blue-200 leading-loose mt-36 p-5 "> */}
    <div className="w-2/3 bg-[#edf2f8] min-h-[50%] text-center mx-auto h-80 rounded-lg text-2xl  font-bold  leading-loose mt-36 pt-16 ">
            
            <h2>Réactiver votre compte pour profiter de notre service</h2>
            <p>
                <span>Service  : </span>
                {product.name}
            </p>
            <p>
                <span>Prix : </span>
                {product.price+" $"}
            </p>
            {openDialog.open ? (
          <StripeCheckout
            className="w-1/3 h-15 py-2 mt-10"
            stripeKey="pk_test_51NHFz6HTNcCgI8IVe8rkmlahe5KeSXvRtjOePwrAz8shwJca3nDaMWgDe6gWr2QEmV2LHYxdn2nl82PAH4y59CCP00whbGueK3"
            label="Pay Now"
            name="Pay with Credit card"
            billingAddress
            amount={priceForStripe}
            description={`Your total is ${product.price} $`}
            token={payNow}
          />
        ) : (
          <button className="w-1/3 h-12  mt-10 bg-sky-500 hover:bg-sky-400 rounded-lg" onClick={() => {if(openDialog.e==false){ handleSuppression(openDialog.rest)}else if(openDialog.e){ handleError()}} }>
            Pay Now  
          </button>
        )}
           
            

    </div>

 </>
 )   
}

export default Prolongment;