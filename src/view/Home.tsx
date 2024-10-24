import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logoico.webp';
import { useEffect } from 'react';

function Home() {

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

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">

      <header className="flex flex-col items-center justify-center h-screen p-8 text-center">
        <img
          src={logoImage}
          alt="Interfaz de Aplicación Futurista para Propuestas"
          className="w-40 h-40 rounded-full shadow-lg mb-8 transform transition duration-500 hover:scale-105"
        />
        <h1 className="text-5xl font-bold text-blue-500 mb-4">
          Futuro de las Propuestas de Negocios
        </h1>
        <p className="text-xl mb-8 max-w-lg">
          Crea propuestas personalizadas con inteligencia artificial en cuestión de segundos. Aumenta tu productividad y lleva tus negocios al siguiente nivel.
        </p>
        <a href="/login">
          <button className="bg-blue-500 hover:bg-blue-700 text-white py-3 px-6 rounded-full text-lg transition duration-300 transform hover:scale-105">
            Comienza Ahora
          </button>
        </a>
      </header>

      <section className="flex flex-wrap justify-center items-center gap-8 py-20 px-6 bg-gray-900">
        <div className="max-w-sm bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">Automatización Completa</h2>
          <p className="text-gray-400">
            Genera propuestas de negocio rápidamente con solo unos pocos clics. La IA hace todo el trabajo por ti.
          </p>
        </div>
        <div className="max-w-sm bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">Personalización Avanzada</h2>
          <p className="text-gray-400">
            Ajusta cada propuesta a las necesidades de tus clientes para crear un impacto duradero.
          </p>
        </div>
        <div className="max-w-sm bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-blue-400 mb-4">Resultados Profesionales</h2>
          <p className="text-gray-400">
            Obtén documentos bien estructurados y listos para enviar a tus clientes en formato PDF o correo electrónico.
          </p>
        </div>
      </section>

      <section className="flex flex-col items-center py-16 bg-gradient-to-br from-blue-900 to-blue-800">
        <h2 className="text-3xl font-bold text-white mb-4">
          ¿Listo para revolucionar tus propuestas de negocios?
        </h2>
        <p className="text-lg text-gray-200 mb-8 max-w-md text-center">
          Únete a la plataforma de propuestas del futuro y empieza a optimizar tu tiempo y esfuerzo.
        </p>
        <a href="/login">
          <button className="bg-blue-500 hover:bg-blue-700 text-white py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105">
            Registrarse
          </button>
        </a>
      </section>
      <footer className="flex justify-center items-center py-4 bg-black text-gray-600">
        <p>&copy; 2024 Propuestas de negocios inteligentes. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;
