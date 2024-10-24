import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSubmitEmail } from "../validation/autRegister";

function Verification() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false); 

    const navigate = useNavigate();
    const token = localStorage.getItem("ACCESS_TOKEN");

    useEffect(() => {
        if (token) {
            navigate("/login");
        }
    }, [token, navigate]);

    if (token) {
        return null;
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const emailData = await handleSubmitEmail(event, email, setEmail);

        if (emailData) {
            setTimeout(() => {
                navigate("/password");
            }, 3000);
        }

        setIsLoading(false); 
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white flex flex-col items-center justify-center">
            <header className="flex flex-col items-center text-center mb-8">
                <h1 className="text-4xl font-bold text-blue-500 mb-2">
                    Verificación de Correo Electrónico
                </h1>
                <p className="text-lg text-gray-200 mb-6 max-w-md">
                    Ingresa tu correo electrónico para recibir un enlace de verificación.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="mb-6">
                    <p
                        id="MensajeErr"
                        className="hidden text-red-500 text-sm font-medium rounded-lg text-center"
                    ></p>
                    <p
                        id="MensajeAct"
                        className="hidden text-green-500 text-sm font-medium rounded-lg text-center"
                    ></p>
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
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white py-3 px-4 rounded-full text-lg transition duration-300 transform hover:scale-105"
                    disabled={isLoading} 
                >
                    {isLoading ? "Enviando..." : "Enviar"} 
                </button>
                <p className="text-center text-gray-400 mt-4">
                    ¿Ya verificaste tu cuenta? <a href="/login" className="text-blue-500 hover:underline">Inicia sesión</a>
                </p>
            </form>
        </div>
    );
}

export default Verification;
