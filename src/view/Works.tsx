import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleClickEl, obtenerPropuestas } from "../validation/generate";
import { Modal } from "../Components/toast";
import { saveAs } from "file-saver";
import axios from "axios";
import { api } from "../validation/url";

function Works() {
  const navigate = useNavigate();
  const token = localStorage.getItem("ACCESS_TOKEN");
  const userSession = localStorage.getItem("USER_SESSION");
  const userEmail = userSession ? JSON.parse(userSession).email : "";

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  const [propuesta, setPropuesta] = useState<
    { id: number; titulo: string; descripcion: string; favorito: boolean }[]
  >([]);

  const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDescriptionModalVisible, setIsDescriptionModalVisible] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState<string>("");

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
    } catch (error) {
      console.error("Error al eliminar la propuesta:", error);
      alert("Hubo un problema al eliminar la propuesta. Inténtalo de nuevo.");
    } finally {
      setIsModalVisible(false);
      setSelectedProposalId(null);
    }
  };

  const filteredPro = propuesta.filter((product) =>
    (product.titulo?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleDownloadDocx = (descripcion: string) => {
    const content = `
      Descripción:\n
      ${descripcion}\n
    `;

    const blob = new Blob([content], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    saveAs(blob, `propuesta.docx`);
  };

  const handleFavorito = async (propuestaId: number) => {
    try {
      const updatedProposals = propuesta.map((propuesta) => {
        if (propuesta.id === propuestaId) {
          return { ...propuesta, favorito: !propuesta.favorito };
        }
        return propuesta;
      });

      setPropuesta(updatedProposals);

      const favorito = updatedProposals.find((p) => p.id === propuestaId)?.favorito;
      await axios.patch(`${api}/chat-gpt/${propuestaId}`, {
        favorito,
        email: userEmail,
      });

      alert(`La propuesta ha sido ${favorito ? "agregada" : "quitada"} de favoritos.`);

    } catch (error) {
      console.error("Error al actualizar favorito:", error);
      alert("Hubo un problema al actualizar el favorito.");
    }
  };

  const showDescriptionModal = (description: string) => {
    setSelectedDescription(description);
    setIsDescriptionModalVisible(true);
  };

  const closeDescriptionModal = () => {
    setSelectedDescription("");
    setIsDescriptionModalVisible(false);
  };

  return (
    <div className=" bg-white p-4 border-2 border-gray-200 rounded-lg mt-14 shadow-md">
      <div className="text-black text-2xl mb-4 p-4 rounded-lg shadow-lg bg-blue-200 flex items-center justify-between border border-solid border-gray-700">
        <form className="w-full">
          <div className="relative w-full">
            <p className="text-center text-black mb-2">Historial de propuestas</p>
            <input
              type="search"
              id="default-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-lg bg-white text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar..."
              required
            />
          </div>
        </form>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-black">
          <thead className="text-xs text-black uppercase bg-blue-200">
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
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPro.map((cate) => (
              <tr key={cate.id} className="border-b bg-gray-100 border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap text-black"
                >
                  {cate.titulo}
                </th>
                <td
                  className="px-6 py-4 cursor-pointer text-black-500"
                  onClick={() => showDescriptionModal(cate.descripcion)}
                >
                  {cate.descripcion.slice(0, 50)}...
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDownloadDocx(cate.descripcion)}
                    className="transition duration-300 transform hover:scale-105 bg-green-500 text-white py-0.5 px-2 text-sm rounded hover:bg-green-700"
                  >
                    Descargar
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleFavorito(cate.id)}
                    className={`transition duration-300 transform hover:scale-105 ${cate.favorito ? "bg-blue-500 hover:bg-blue-700" : "bg-yellow-500 hover:bg-yellow-700"
                      } text-white py-0.5 px-2 text-sm rounded`}
                  >
                    {cate.favorito ? "Agregado" : "Agregar"}
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

      {isDescriptionModalVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeDescriptionModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl"
            onClick={(e) => e.stopPropagation()}  
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Descripción completa</h2>
            <div className="max-h-96 overflow-y-auto">
              <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed">
                {selectedDescription}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeDescriptionModal}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default Works;
