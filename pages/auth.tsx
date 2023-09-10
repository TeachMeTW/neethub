import Input from "@/components/input";
import { useCallback, useState } from "react"

const Auth = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    
    const [variant, setVariant] = useState('login');

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
    }, [])


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
                        <button className="bg-purple-600 py-3 text-white rounded-md w-full mt-10 hover:bg-purple-700 transition">
                            {variant === 'login' ? 'Login' : 'Sign Up'}
                        </button>
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
