import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSubmitChat, handleSubmitEmailChat } from "../validation/generate";
import jsPDF from "jspdf";

function Generate() {

    const navigate = useNavigate();

    const token = localStorage.getItem("ACCESS_TOKEN");

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    if (!token) {
        return null;
    }

    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
        setTitulo("");
        setDescripcion("");
        setMetas("");
        setPresupuesto("");
        setTono("");
    };

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [metas, setMetas] = useState("");
    const [presupuesto, setPresupuesto] = useState("");
    const [tono, setTono] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isLoading1, setIsLoading1] = useState(false);
    const [displayedText, setDisplayedText] = useState("");
    const [recipientEmail, setRecipientEmail] = useState("");
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);

    const animateText = (text: string) => {
        setDisplayedText("");
        let index = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + text[index]);
            index++;
            if (index === text.length) {
                clearInterval(interval);
            }
        }, 50);
    };

    const handleSubmitGpt = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        await handleSubmitChat(event, titulo, descripcion, metas, presupuesto, tono, setTitulo, setDescripcion, setMetas, setPresupuesto, setTono,  animateText);
        setIsLoading(false);
        setIsOpen(!isOpen);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(displayedText).then(() => {
            alert("Texto copiado al portapapeles");
        }).catch((error) => {
            console.error("Error al copiar el texto:", error);
        });
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const margin = 10;
        const textWidth = pageWidth - 2 * margin;

        const text = displayedText || "No hay texto para descargar";

        const lines = doc.splitTextToSize(text, textWidth);

        doc.setFontSize(14);
        doc.text("Propuesta de Negocio", margin, 20);

        doc.setFontSize(12);
        let yOffset = 30;

        lines.forEach((line: any) => {
            if (yOffset > doc.internal.pageSize.height - margin) {
                doc.addPage();
                yOffset = margin;
            }
            doc.text(line, margin, yOffset);
            yOffset += 10;
        });

        doc.save("propuesta.pdf");
    };

    const openSendModal = () => {
        setIsSendModalOpen(true);
    };

    const closeSendModal = () => {
        setIsSendModalOpen(false);
        setRecipientEmail("");
    };

    const handleSendEmail = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading1(true);
        await handleSubmitEmailChat(displayedText, recipientEmail);
        setIsSendModalOpen(!isSendModalOpen);
        setIsLoading1(false);
    };

    return (
        <div className="relative flex flex-col justify-between h-screen bg-gray-900 p-4 border-2 border-gray-200 border-dashed rounded-lg mt-14 shadow-md">

            <div className="text-black text-2xl mb-4 p-4 rounded-lg shadow-lg bg-gray-800 flex justify-center items-center">
                <p className="text-center text-white">Generador de propuestas</p>
            </div>

            <div className="relative flex-grow mb-4 rounded-lg bg-gray-800">
                <div className="absolute top-2 right-2 flex space-x-2 z-10">
                    <button
                        onClick={handleDownloadPDF}
                        className="transition duration-300 transform hover:scale-105 bg-green-500 text-white py-0.5 px-2 text-sm rounded hover:bg-green-700"
                    >
                        Descargar
                    </button>
                    <button
                        onClick={openSendModal}
                        className="transition duration-300 transform hover:scale-105 bg-blue-500 text-white py-0.5 px-2 text-sm rounded hover:bg-blue-700"
                    >
                        Enviar
                    </button>
                    <button onClick={handleCopy} className="transition duration-300 transform hover:scale-105 bg-yellow-500 text-white py-0.5 px-2 text-sm rounded hover:bg-yellow-700">
                        Copiar
                    </button>
                </div>
                <textarea
                    className="w-full h-full p-4 pt-12 text-white bg-transparent border-none resize-none outline-none"
                    placeholder="Tus propuestas se verán aquí..."
                    value={displayedText}
                    readOnly
                ></textarea>
            </div>

            {isSendModalOpen && (
                <div className="bg-gray-100 bg-opacity-50 formPer fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center">
                    <div className="relative w-full max-w-md max-h-full">
                        <div className="relative bg-gray-900 rounded-lg shadow-lg p-6">
                            <button
                                type="button"
                                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                                onClick={closeSendModal}
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
                                <span className="sr-only">Cerrar modal</span>
                            </button>
                            <h3 className="text-xl text-white font-bold mb-4">Enviar Propuesta</h3>
                            <form onSubmit={handleSendEmail} className="space-y-4">
                                <p
                                    id="MensajeActChat"
                                    className=" hidden text-green-500 text-sm font-medium rounded-lg text-center"
                                ></p>

                                <div>
                                    <label className="block text-sm font-medium text-white">Correo del destinatario</label>
                                    <input
                                        type="email"
                                        value={recipientEmail}
                                        required
                                        onChange={(e) => setRecipientEmail(e.target.value)}
                                        className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 placeholder-gray-400"
                                        placeholder="ejemplo@correo.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white">Contenido de la propuesta</label>
                                    <textarea
                                        value={displayedText}
                                        readOnly
                                        className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 placeholder-gray-400 resize-none"
                                        rows={5}
                                    ></textarea>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button type="button" onClick={closeSendModal} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition duration-300 transform hover:scale-105">Cancelar</button>

                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105" disabled={isLoading1} >
                                        {isLoading1 ? "Enviando..." : "Enviar"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-center mb-4">
                <button onClick={toggleModal} className="transition duration-300 transform hover:scale-105 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                    Generar Propuesta
                </button>
            </div>

            {isOpen && (
                <div
                    id="authentication-modal"
                    className="bg-gray-100 bg-opacity-50 formPer fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center"
                >
                    <div className="relative w-full max-w-md max-h-full">
                        <div className="relative bg-gray-900 rounded-lg shadow-lg">
                            <button
                                type="button"
                                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                                data-modal-hide="authentication-modal"
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
                            <div className="px-6 py-6 lg:px-8">
                                <h3 className="mb-4 text-xl font-medium text-white">
                                    Deja tus detalles, y tu propuesta lista en segundos
                                </h3>

                                <p
                                    id="MensajeErrCat"
                                    className=" hidden text-red-500 text-sm font-medium rounded-lg text-center"
                                ></p>
                                <form onSubmit={handleSubmitGpt} className="space-y-6">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-white">Título</label>
                                        <input value={titulo}
                                            onChange={(e) => setTitulo(e.target.value)} type="text" className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 placeholder-gray-400" placeholder="Título del proyecto o servicio" />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-white">Descripción</label>
                                        <textarea value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)} className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 placeholder-gray-400" placeholder="Describe brevemente el proyecto..."></textarea>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-white">Metas</label>
                                        <textarea value={metas}
                                            onChange={(e) => setMetas(e.target.value)} className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 placeholder-gray-400" placeholder="Las metas del proyecto"></textarea>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-white">Presupuesto</label>
                                        <input value={presupuesto}
                                            onChange={(e) => setPresupuesto(e.target.value)} className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 placeholder-gray-400" placeholder="Presupuesto del proyecto" />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-white">Tono</label>
                                        <select
                                            value={tono}
                                            onChange={(e) => setTono(e.target.value)}
                                            className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 placeholder-gray-400"
                                        >
                                            <option value="">Selecciona el tono...</option>
                                            <option value="formal">Formal</option>
                                            <option value="casual">Casual</option>
                                            <option value="tecnico">Técnico</option>
                                            <option value="amigable">Amigable</option>
                                        </select>
                                    </div>
                                    <div>
                                        <button type="submit" className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-300 transform hover:scale-105" disabled={isLoading} >
                                            {isLoading ? "Generando..." : "Generar propuesta"}
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
