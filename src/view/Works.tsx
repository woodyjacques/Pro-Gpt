import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleClickEl, obtenerPropuestas, handleSubmitEmailChat } from "../validation/generate";
import { Modal } from "../Components/toast";
import jsPDF from "jspdf";

function Works() {
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

  const [propuesta, setPropuesta] = useState<
    { id: number; name: string; description: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [selectedProposalDescription, setSelectedProposalDescription] = useState<string>("");
  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    obtenerPropuestas()
      .then((data) => {
        setPropuesta(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const showModal = (id: number) => {
    setSelectedProposalId(id);
    setIsModalVisible(true);
  };

  const handleDeleteProposal = async () => {
    if (selectedProposalId === null) return;

    try {
      await handleClickEl({ id: selectedProposalId });
      setPropuesta(propuesta.filter((item) => item.id !== selectedProposalId));
      alert("Propuesta eliminada con éxito.");
    } catch (error) {
      console.error("Error al eliminar la propuesta:", error);
      alert("Hubo un problema al eliminar la propuesta. Inténtalo de nuevo.");
    } finally {
      setIsModalVisible(false);
      setSelectedProposalId(null);
    }
  };

  const showEmailModal = (description: string) => {
    setSelectedProposalDescription(description);
    setIsEmailModalVisible(true);
  };

  const handleSendEmail = async () => {
    setIsLoading(true);
    if (!selectedProposalDescription || !recipientEmail) {
      setIsLoading(false);
      return;
    }
    try {
      await handleSubmitEmailChat(selectedProposalDescription, recipientEmail);
      alert("Propuesta enviada con éxito");
      setIsEmailModalVisible(false);
      setRecipientEmail("");
    } catch (error) {
      console.error("Error al enviar el email:", error);
      alert("Hubo un problema al enviar el correo. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const filteredPro = propuesta.filter((product) =>
    (product.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = (name: string, description: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    const textWidth = pageWidth - 2 * margin;

    doc.setFontSize(14);
    doc.text(`Propuesta: ${name}`, margin, 20);

    const lines = doc.splitTextToSize(description, textWidth);
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

    doc.save(`${name}.pdf`);
  };

  return (
    <div className=" bg-gray-900 p-4 border-2 border-gray-200 border-dashed rounded-lg mt-14 shadow-md">
      <div className="text-black text-2xl mb-4 p-4 rounded-lg shadow-lg bg-gray-800 flex items-center justify-between">
        <form className="w-full">
          <div className="relative w-full">
            <p className="text-center text-white mb-2">Historial de propuestas</p>
            <input
              type="search"
              id="default-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar"
              required
            />
          </div>
        </form>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3">
                Descripción
              </th>
              <th scope="col" className="px-6 py-3">
                Descargar
              </th>
              <th scope="col" className="px-6 py-3">
                Favoritos
              </th>
              <th scope="col" className="px-6 py-3">
                Enviar por correo
              </th>
              <th scope="col" className="px-6 py-3">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>

            {filteredPro.map((cate) => (
              <tr
                key={cate.id}
                className=" border-b bg-gray-900 border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap text-white"
                >
                  {cate.name}
                </th>
                <td className="px-6 py-4">{cate.description.slice(0, 50)}...</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDownloadPDF(cate.name, cate.description)}
                    className="transition duration-300 transform hover:scale-105 bg-green-500 text-white py-0.5 px-2 text-sm rounded hover:bg-green-700"
                  >
                    Descargar
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => showEmailModal(cate.description)}
                    className="transition duration-300 transform hover:scale-105 bg-yellow-500 text-white py-0.5 px-2 text-sm rounded hover:bg-yellow-700"
                  >
                    Agregar
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => showEmailModal(cate.description)}
                    className="transition duration-300 transform hover:scale-105 bg-blue-500 text-white py-0.5 px-2 text-sm rounded hover:bg-blue-700"
                  >
                    Enviar
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => showModal(cate.id)}
                    className="transition duration-300 transform hover:scale-105 bg-red-500 text-white py-0.5 px-2 text-sm rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                  <Modal
                    onConfirm={handleDeleteProposal}
                    isVisible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    message="¿Estás seguro de eliminar la propuesta?"
                  />
                </td>
              </tr>
            ))}
            
          </tbody>
        </table>
      </div>

      {isEmailModalVisible && (
        <div className="bg-gray-100 bg-opacity-50 formPer fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center">
          <div className="relative w-full max-w-md max-h-full">
            <div className="relative bg-gray-900 rounded-lg shadow-lg p-6">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                onClick={() => setIsEmailModalVisible(false)}
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
              <div className="space-y-4">
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
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSendEmail}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Works;
