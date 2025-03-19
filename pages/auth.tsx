import { useState, useCallback } from "react";
import axios from "axios";
import Input from "@/components/input";
import { signIn } from "next-auth/react"

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const Auth = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const [variant, setVariant] = useState('login');
    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant ==='login' ? 'register' : "login")
    }, [])

    const login = useCallback(async () => {
        try {
          setErrorMessage('');
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
            callbackUrl: '/profiles'
          });
      
          if (result?.error) {
            setErrorMessage('Invalid email or password.');
          } else if (result?.ok) {
            window.location.href = '/profiles'; // manually redirect
          }
        } catch (error) {
          console.log(error);
          setErrorMessage('Something went wrong during login.');
        }
      }, [email, password]);
      
 

    const register = useCallback(async () => {
        try {
          setErrorMessage(''); 
          await axios.post('/api/register', {
            email,
            name,
            password
          });
          login();
        } catch (error: any) {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 422) {
           
              const backendMessage = error.response.data?.Error || 'Email already in use.';
              setErrorMessage(backendMessage);
            } else {
              setErrorMessage('Something went wrong. Please try again.');
            }
          } else {
            setErrorMessage('Unexpected error occurred.');
          }
          console.log(error);
        }
      }, [email, name, password, login]);
      

 

 
  
    return (
        <div className="relative h-full w-full bg-[url('/images/netflix_bg.png')] bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black w-full h-full lg:bg-opacity-50">
                <nav className="px-12 py-5">
                    logo
                </nav>
                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-70 px-16 py-16 lg:w-2/5 lg:max-w-md rounded-md w-full">
                        <h2 className="text-white text-4xl mb-8 font-semibold">{variant === 'login' ? 'Sign In' : 'Register'} </h2>
                        <div className="flex flex-col gap-4">
                            {variant  === 'register' && (
                                <Input id="name"  value={name} label="Username" onChange={(e) => {setName(e.target.value)}}/>
                            )}
                            <Input id="email" type="email" value={email} label="Email" onChange={(e) => {setEmail(e.target.value)}}/>
                            <Input id="password" type="password" value={password} label="Password" onChange={(e) => {setPassword(e.target.value)}}/>
                            <button onClick={variant === "login" ? login : register} className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">{variant == 'login' ? 'Log in' : 'Sign Up'}</button>
                            {errorMessage && (
                                 <p className="text-red-500 mt-4 text-sm text-center">{errorMessage}</p>
                            )}

                            <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                                <div onClick={() => signIn('google',{callbackUrl: '/profiles'})} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                                    <FcGoogle size={30} />
                                </div>
                                <div onClick={() => signIn('github', {callbackUrl: '/profiles'})} className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                                    <FaGithub size={30} />
                                </div>
                            </div>
                            <p className="text-neutral-500 mt-12">{variant === 'login' ? 'First time using Netflix' : 'Already have an account?'}<span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">{variant === 'login' ? 'Create an account' : 'Login'}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth;
