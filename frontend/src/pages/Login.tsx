// import React from 'react'
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast/headless";
import { useNavigate} from "react-router-dom";

import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";


const Login = () => {
    const [loading, setLoading ] = useState(false) ;
    const navigate = useNavigate() ;

    const responseGoogle = async (authResult: any) =>{
        setLoading(true) ;

        try{
            const result = await axios.post('${authService}/api/auth/login', {
                code: authResult['code'],


            }) ;

            localStorage.setItem("token", result.data.token);
            toast.success(result.data.message);
            setLoading(false) ;
            navigate("/") ;

        } catch(error){
            console.log(error) ;
            toast.error("Pronlem while login");
            setLoading(false) ;
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: 'auth-code',
    }) ;    



  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 ">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-3xl font-bold text-[#E23774]">Login or sign up to continue </h1>

        <p> Login or Sign up to continue </p>
        <button onClick={googleLogin} disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 " >
          
          <FcGoogle size={20} />
          {loading ? "Sign In..." : "Login with Google"}
        </button>
        <p className="text-center text-xs text-gray-400">
          By continuing, you agree to our {" "}
          
          <span className="text-[#E23774]">  Terms of Service  </span> 
          &{" "}
          <span className="text-[#E23774]"> Privacy Policy. </span>
        </p>
      </div>
    </div>
  )
}

export default Login







