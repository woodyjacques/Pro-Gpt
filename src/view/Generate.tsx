import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSubmitChat } from "../validation/generate";
import { saveAs } from "file-saver";

function Generate() {
    const navigate = useNavigate();
    const token = localStorage.getItem("ACCESS_TOKEN");

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [descripcion, setDescripcion] = useState("");
    const [metas, setMetas] = useState("");
    const [displayedText, setDisplayedText] = useState("");

    const toggleModal = () => {
        setIsOpen(!isOpen);
        setDescripcion("");
        setMetas("");
    };

    const animateText = (text: string) => {
        const cleanText = text.replace(/\bundefined\b/gi, '').trim();
        let index = 0;
        const typingSpeed = 10;

        function typeEffect() {
            if (index < cleanText.length) {
                setDisplayedText(cleanText.slice(0, index + 1));
                index++;
                setTimeout(typeEffect, typingSpeed);
            }
        }
        typeEffect();
    };

    const handleSubmitGpt = async (event: FormEvent) => {
        event.preventDefault();
        if (!token) {
            navigate("/login");
            return;
        }

        if (!descripcion || !metas) {
            alert('Por favor, complete todos los campos antes de enviar.');
            return;
        }

        setIsLoading(true);

        await handleSubmitChat(
            event,
            descripcion,
            metas,
            setDescripcion,
            setMetas,
            animateText
        );
        setIsLoading(false);
        setIsOpen(!isOpen);
    };

    const handleCopy = () => {
        if (!token) {
            navigate("/login");
            return;
        }
        navigator.clipboard.writeText(displayedText).then(() => {
            alert("Texto copiado al portapapeles");
        }).catch((error) => {
            console.error("Error al copiar el texto:", error);
        });
    };

    const handleDownloadDocx = () => {
        if (!token) {
            navigate("/login");
            return;
        }

        if (!displayedText) {
            alert("No hay texto disponible para descargar.");
            return;
        }

        const blob = new Blob([displayedText], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        saveAs(blob, "propuesta.docx");
    };


    return (
        <div className="relative flex flex-col justify-between h-1/2 bg-gray-100 p-4 border-2 border-gray-200 rounded-lg mt-14 shadow-md">

            <div className="relative flex-grow mb-4 rounded-lg bg-white h-[70vh]">
                <div className="absolute top-2 right-2 flex space-x-2 z-10">
                    <button
                        onClick={handleDownloadDocx}
                        className="transition duration-300 transform hover:scale-105 bg-green-500 text-white py-0.5 px-2 text-sm rounded hover:bg-green-700"
                    >
                        Descargar DOCX
                    </button>
                    <button
                        onClick={handleCopy}
                        className="transition duration-300 transform hover:scale-105 bg-yellow-500 text-white py-0.5 px-2 text-sm rounded hover:bg-yellow-700"
                    >
                        Copiar
                    </button>
                </div>
                <textarea
                    className="w-full h-full p-4 pt-12 text-black bg-transparent border-none resize-none outline-none"
                    value={displayedText}
                    readOnly
                ></textarea>
            </div>

            <div className="flex justify-center mb-4">
                <button
                    onClick={() => {
                        if (!token) {
                            navigate("/login");
                        } else {
                            toggleModal();
                        }
                    }}
                    className="transition duration-300 transform hover:scale-105 w-64 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                    Generar Propuesta
                </button>
            </div>

            {isOpen && (
                <div
                    id="authentication-modal"
                    className="bg-gray-100 bg-opacity-50 fixed inset-0 z-50 flex justify-center items-center overflow-y-auto"
                >
                    <div className="relative w-full max-w-4xl mx-auto">
                        <div className="relative bg-white rounded-lg shadow-lg">

                            <button
                                type="button"
                                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center"
                                onClick={toggleModal}
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>

                            <div className="px-8 py-10">
                                <h3 className="mb-4 text-2xl font-semibold text-black text-center">
                                    Deja tus detalles, y tu propuesta lista en segundos
                                </h3>
                                <p
                                    id="MensajeErrCat"
                                    className="hidden text-red-500 text-sm font-medium rounded-lg text-center"
                                ></p>

                                <form onSubmit={handleSubmitGpt}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="block mb-2 text-sm font-medium text-black">
                                                Detalles de tu propuesta:
                                            </label>
                                            <textarea
                                                value={descripcion}
                                                onChange={(e) => setDescripcion(e.target.value)}
                                                className="bg-gray-100 border border-gray-300 text-black text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-3 placeholder-gray-400"
                                                rows={4}
                                            ></textarea>
                                        </div>

                                        <div className="col-span-1 md:col-span-2">
                                            <label className="block mb-2 text-sm font-medium text-black">
                                                ¿A quién va dirigido?
                                            </label>
                                            <textarea
                                                value={metas}
                                                onChange={(e) => setMetas(e.target.value)}
                                                className="bg-gray-100 border border-gray-300 text-black text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-3 placeholder-gray-400"
                                                rows={4}
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-center">
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Enviando..." : "Enviar"}
                                        </button>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Generate;
