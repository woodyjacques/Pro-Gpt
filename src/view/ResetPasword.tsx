import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSubmitPassUpEmail } from '../validation/autRegister';

export interface UserData {
  name: string;
  email: string;
}

function ResetPassword() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState("");

  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  const handleSubmitPassEmail = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true); 

    const emailData = await handleSubmitPassUpEmail(event, password, verPassword, setPassword, setVerPassword);

    if (emailData) {
      const { tokens, name, email } = emailData;
      localStorage.setItem("ACCESS_TOKEN", tokens);
      const sessionData: UserData = {
        name, email
      };

      localStorage.setItem("USER_SESSION", JSON.stringify(sessionData));
      setTimeout(() => {
        navigate("/generate");
      }, 3000);
    }

    setIsLoading(false); 
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white flex flex-col items-center justify-center">
      <header className="flex flex-col items-center text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-500 mb-2">
          Restablece tu Contraseña
        </h1>
        <p className="text-lg text-gray-200 mb-6 max-w-md">
          Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
        </p>
      </header>

      <form onSubmit={handleSubmitPassEmail} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-4 relative">
          <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="new-password">
            Nueva Contraseña
          </label>
          <input
            type={showNewPassword ? "text" : "password"}
            id="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-900 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa tu nueva contraseña"
          />
          <button
            type="button"
            onClick={toggleNewPasswordVisibility}
            className="absolute right-3 top-10 text-gray-500 hover:text-gray-300 focus:outline-none"
          >
            {showNewPassword ? "Ocultar" : "Ver"}
          </button>
        </div>
        <div className="mb-6 relative">
          <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="confirm-password">
            Confirmar Contraseña
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirm-password"
            value={verPassword}
            onChange={(e) => setVerPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-900 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirma tu nueva contraseña"
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-3 top-10 text-gray-500 hover:text-gray-300 focus:outline-none"
          >
            {showConfirmPassword ? "Ocultar" : "Ver"}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white py-3 px-4 rounded-full text-lg transition duration-300 transform hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? "Restableciendo..." : "Restablecer Contraseña"} 
        </button>
        <p className="text-center text-gray-400 mt-4">
          ¿Ya tienes acceso? <a href="/login" className="text-blue-500 hover:underline">Inicia sesión</a>
        </p>
      </form>
    </div>
  );
}

export default ResetPassword;
