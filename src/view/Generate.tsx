import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSubmitChat, obtenerPropuestas } from "../validation/generate";
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

    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(20);
    const [isOpen, setIsOpen] = useState(false);

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [metas, setMetas] = useState("");
    const [presupuesto, setPresupuesto] = useState("");
    const [tono, setTono] = useState("");
    const [nombreCliente, setNombreCliente] = useState("");
    const [nombreEmpresa, setNombreEmpresa] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [displayedText, setDisplayedText] = useState("");

    const handleBack = () => {
        setStep((prevStep) => prevStep - 1);
        setProgress((prevProgress) => prevProgress - 40);
    };

    const toggleModal = () => {
        setIsOpen(!isOpen);
        setStep(1);
        setProgress(20);
        setTitulo("");
        setDescripcion("");
        setMetas("");
        setPresupuesto("");
        setTono("");
        setNombreCliente("");
        setNombreEmpresa("");
        setTelefono("");
        setCorreo("");
    };

    const animateText = (text: string) => {
        setDisplayedText("");
        let index = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + text[index]);
            index++;
            if (index === text.length) {
                clearInterval(interval);
            }
        }, 5);
    };

    const handleSubmitGpt = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        await handleSubmitChat(event, titulo, descripcion, metas, presupuesto, tono, nombreCliente, nombreEmpresa, telefono, correo, setTitulo, setDescripcion, setMetas, setPresupuesto, setTono, setNombreCliente, setNombreEmpresa, setTelefono, setCorreo, animateText);
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

    const handleDownloadPDF = async () => {
        try {

            const propuestas = await obtenerPropuestas();

            if (!propuestas || propuestas.length === 0) {
                alert("No hay propuestas para descargar.");
                return;
            }

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;
            const margin = 10;
            const textWidth = pageWidth - 2 * margin;
            let yOffset = 20;

            propuestas.forEach((propuesta:any, index:any) => {

                doc.setFontSize(14);
                doc.text(`Propuesta ${index + 1}: ${propuesta.titulo}`, margin, yOffset);
                yOffset += 10;

                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                doc.text("Descripción:", margin, yOffset);
                yOffset += 7;
                doc.setFont("helvetica", "normal");
                const descripcionLines = doc.splitTextToSize(propuesta.descripcion, textWidth);
                descripcionLines.forEach((line:any) => {
                    if (yOffset > doc.internal.pageSize.height - margin) {
                        doc.addPage();
                        yOffset = margin;
                    }
                    doc.text(line, margin, yOffset);
                    yOffset += 7;
                });

                if (propuesta.metas) {
                    yOffset += 10;
                    doc.setFont("helvetica", "bold");
                    doc.text("Metas:", margin, yOffset);
                    yOffset += 7;
                    doc.setFont("helvetica", "normal");
                    const metasLines = doc.splitTextToSize(propuesta.metas, textWidth);
                    metasLines.forEach((line:any) => {
                        if (yOffset > doc.internal.pageSize.height - margin) {
                            doc.addPage();
                            yOffset = margin;
                        }
                        doc.text(line, margin, yOffset);
                        yOffset += 7;
                    });
                }

                if (propuesta.presupuesto) {
                    yOffset += 10;
                    doc.setFont("helvetica", "bold");
                    doc.text("Presupuesto:", margin, yOffset);
                    yOffset += 7;
                    doc.setFont("helvetica", "normal");
                    doc.text(propuesta.presupuesto, margin, yOffset);
                }

                if (propuesta.tono) {
                    yOffset += 10;
                    doc.setFont("helvetica", "bold");
                    doc.text("Tono:", margin, yOffset);
                    yOffset += 7;
                    doc.setFont("helvetica", "normal");
                    doc.text(propuesta.tono, margin, yOffset);
                }

                yOffset += 20;
                if (yOffset > doc.internal.pageSize.height - margin) {
                    doc.addPage();
                    yOffset = margin;
                }
            });

            doc.save("propuestas.pdf");

        } catch (error) {
            console.error("Error al obtener propuestas:", error);
            alert("Hubo un error al intentar descargar las propuestas.");
        }
    };

    const handleNext = () => {
        if (step === 1 && (!titulo || !descripcion)) {
            alert('Por favor, complete todos los campos antes de continuar.');
            return;
        }
        if (step === 2 && (!metas || !presupuesto || !tono)) {
            alert('Por favor, complete todos los campos antes de continuar.');
            return;
        }

        if (step === 3 && (!nombreCliente || !nombreEmpresa || !telefono || !correo)) {
            alert('Por favor, complete todos los campos antes de enviar.');
            return;
        }

        setStep((prevStep) => prevStep + 1);
        setProgress((prevProgress) => prevProgress + 40);
    };

    return (
        <div className="relative flex flex-col justify-between h-screen bg-gray-900 p-4 border-2 border-gray-200 rounded-lg mt-14 shadow-md">

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
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-4">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <p
                                    id="MensajeErrCat"
                                    className=" hidden text-red-500 text-sm font-medium rounded-lg text-center"
                                ></p>
                                <p className="text-white text-center mb-4">Paso {step} de 3</p>
                                <form onSubmit={handleSubmitGpt}>
                                    {step === 1 && (
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-white">
                                                Título de la propuesta
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                value={titulo}
                                                onChange={(e) => setTitulo(e.target.value)}
                                                className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 placeholder-gray-400"
                                            />

                                            <label className="block mb-2 text-sm font-medium text-white">
                                                Descripción de la propuesta
                                            </label>
                                            <textarea
                                                value={descripcion}
                                                onChange={(e) => setDescripcion(e.target.value)}
                                                className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 placeholder-gray-400"
                                            ></textarea>

                                            <button
                                                type="button"
                                                onClick={handleNext}
                                                className="w-full p-2 bg-blue-600 text-white rounded mt-4"
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-white">
                                                Metas de la propuesta
                                            </label>
                                            <textarea
                                                value={metas}
                                                onChange={(e) => setMetas(e.target.value)}
                                                className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 placeholder-gray-400"
                                            ></textarea>

                                            <label className="block mb-2 text-sm font-medium text-white">
                                                Presupuesto
                                            </label>
                                            <input value={presupuesto}
                                                onChange={(e) => setPresupuesto(e.target.value)} className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 placeholder-gray-400" placeholder="Presupuesto del proyecto" />

                                            <label className="block mb-2 text-sm font-medium text-white">
                                                Tono de la propuesta
                                            </label>
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

                                            <div className="flex justify-between mt-4">
                                                <button
                                                    type="button"
                                                    onClick={handleBack}
                                                    className="p-2 bg-gray-600 text-white rounded"
                                                >
                                                    Atrás
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleNext}
                                                    className="p-2 bg-blue-600 text-white rounded"
                                                >
                                                    Siguiente
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-white">
                                                Nombre del cliente
                                            </label>
                                            <input
                                                type="text"
                                                value={nombreCliente}
                                                onChange={(e) => setNombreCliente(e.target.value)}
                                                className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 placeholder-gray-400"
                                            />

                                            <label className="block mb-2 text-sm font-medium text-white">
                                                Nombre de la empresa (si aplica)
                                            </label>
                                            <input
                                                type="text"
                                                value={nombreEmpresa}
                                                onChange={(e) => setNombreEmpresa(e.target.value)}
                                                className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 placeholder-gray-400"
                                            />

                                            <label className="block mb-2 text-sm font-medium text-white">
                                                Teléfono del cliente
                                            </label>
                                            <input
                                                type="number"
                                                value={telefono}
                                                onChange={(e) => setTelefono(e.target.value)}
                                                className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 placeholder-gray-400"
                                            />

                                            <label className="block mb-2 text-sm font-medium text-white">
                                                Correo del cliente
                                            </label>
                                            <input
                                                type="email"
                                                value={correo}
                                                onChange={(e) => setCorreo(e.target.value)}
                                                className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 block w-full p-2.5 placeholder-gray-400"
                                            />

                                            <div className="flex justify-between mt-4">
                                                <button
                                                    type="button"
                                                    onClick={handleBack}
                                                    className="p-2 bg-gray-600 text-white rounded"
                                                >
                                                    Atrás
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="p-2 bg-green-600 text-white rounded" disabled={isLoading}
                                                >
                                                    {isLoading ? "Enviando..." : "Enviar"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
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
