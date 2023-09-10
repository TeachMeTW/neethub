import Input from "@/components/input";
import axios from "axios";
import { useCallback, useState } from "react"
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NextPageContext } from 'next';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';


export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}


const Auth = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    
    const [variant, setVariant] = useState('login');

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
    }, [])

    const login = useCallback(async () => {
        try {
          await signIn('credentials', {
            email,
            password,
            redirect: false,
            callbackUrl: '/'
          });
    
          router.push('/profiles');
        } catch (error) {
          console.log(error);
        }
      }, [email, password, router]);
    
      const register = useCallback(async () => {
        try {
          await axios.post('/api/register', {
            email,
            name,
            password
          });
    
          login();
        } catch (error) {
            console.log(error);
        }
      }, [email, name, password, login]);



    return (
        <div style={{ backgroundImage: `url('/images/hero.jpeg')` }} className="relative w-full h-screen bg-cover bg-center bg-no-repeat bg-fixed">
            <div className="bg-black w-full h-full lg:bg-opacity-50">
                <nav className="px-12 py-5">
                    <img src="/images/logo.png" alt="logo" className="h-20" />
                </nav>
                <div className="flex justify-center transform -translate-x-20">
                    <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
                        <h2 style={{ color: '#fff1dd' }} className="text-4xl mb-8 font-semibold">
                            {variant === 'login' ? 'Sign In' : 'Register'}
                        </h2>
                        <div className="flex flex-col gap-4">
                            {variant === 'register' && (
                            <Input 
                                label="Username" 
                                id="name" 
                                value={name}
                                onChange={(ev) => setName(ev.target.value)}
                            />
                            )}
                            <Input 
                                label="Email" 
                                id="email" 
                                type="email" 
                                value={email}
                                onChange={(ev) => setEmail(ev.target.value)}
                            />
                            <Input 
                                label="Password" 
                                id="password" 
                                type="password" 
                                value={password}
                                onChange={(ev) => setPassword(ev.target.value)}
                            />
                        </div>
                        <button onClick={variant === 'login' ? login : register} className="bg-purple-600 py-3 text-white rounded-md w-full mt-10 hover:bg-purple-700 transition">
                            {variant === 'login' ? 'Login' : 'Sign Up'}
                        </button>
                        
                        <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                                <div 
                                onClick={() => signIn('google', { callbackUrl: '/profiles' })}
                                className="
                                    w-10
                                    h-10
                                    bg-white
                                    rounded-full
                                    flex
                                    items-center
                                    justify-center
                                    cursor-pointer
                                    hover:opacity-80
                                    transition">
                                    <FcGoogle size={30} />
                                </div>
                                <div 
                                
                                onClick={() => signIn('github', { callbackUrl: '/profiles' })}
                                className="
                                    w-10
                                    h-10
                                    bg-white
                                    rounded-full
                                    flex
                                    items-center
                                    justify-center
                                    cursor-pointer
                                    hover:opacity-80
                                    transition">
                                    <FaGithub size={30} />
                                </div>
                        </div>

                        <p className="text-neutral-500 mt-12">
                            {variant === 'login' ? 'Don\'t have an account?' : 'Already have an account?'}
                            <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                                {variant === 'login' ? 'Create an account!' : 'Login here!'}
                            </span>
                        </p>


                    </div>
                </div>
            </div>


        </div>
    );
}

export default Auth;
