import { FormEvent, useEffect, useState } from 'react';
import { handleSubmitUsers } from '../validation/autRegister';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isVerified, setisVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false); 

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const navigate = useNavigate();
    const token = localStorage.getItem("ACCESS_TOKEN");

    useEffect(() => {
        if (token) {
            navigate("/generate");
        }
    }, [token, navigate]);

    if (token) {
        return null;
    }

    const handleSubmitRegister = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true); 

        const registrationSuccessful = await handleSubmitUsers(event, name, email, password, isVerified, setName, setEmail, setPassword, setisVerified);

        if (registrationSuccessful) {
            setTimeout(() => {
                navigate("/verifi");
            }, 3000);
        }

        setIsLoading(false);
    };

    return (
        <section className="flex flex-col items-center py-16 bg-gradient-to-br from-blue-900 to-blue-800">
            <h2 className="text-3xl font-bold text-white mb-4">
                Regístrate Ahora
            </h2>
            <p className="text-lg text-gray-200 mb-8 max-w-md text-center">
                Únete a la plataforma de propuestas del futuro y empieza a optimizar tu tiempo y esfuerzo.
            </p>
            <form onSubmit={handleSubmitRegister} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <p id="MensajeErrUsuario" className="hidden text-red-500 text-sm font-medium rounded-lg text-center"></p>
                <p id="MensajeActUsuario" className="hidden text-green-500 text-sm font-medium rounded-lg text-center"></p>

                <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="name">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-900 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingresa tu nombre"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">
                        Correo
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-900 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingresa tu correo"
                    />
                </div>
                <div className="mb-6 relative">
                    <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="password">
                        Contraseña
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-900 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingresa tu contraseña"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-10 text-gray-500 hover:text-gray-300 focus:outline-none"
                    >
                        {showPassword ? "Ocultar" : "Ver"}
                    </button>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white py-3 px-4 rounded-full text-lg transition duration-300 transform hover:scale-105"
                    disabled={isLoading} 
                >
                    {isLoading ? "Registrando..." : "Registrarse"} 
                </button>
                <p className="text-center text-gray-400 mt-4">
                    ¿Ya tienes una cuenta? <a href="/login" className="text-blue-500 hover:underline">Inicia sesión</a>
                </p>
            </form>
        </section>
    );
}

export default Register;
