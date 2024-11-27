import { FormEvent } from "react";
import { mostrarMensaje } from "../Components/toast";
import axios from "axios";
import { api } from "./url";

export const handleSubmitChat = async (
    event: FormEvent,
    descripcion: string,
    metas: string,
    setDescripcion: React.Dispatch<React.SetStateAction<string>>,
    setMetas: React.Dispatch<React.SetStateAction<string>>,
    animateText: (text: string) => void
) => {
    event.preventDefault();

    function resetForm() {
        setDescripcion("");
        setMetas("");
    }

    try {
        const userSession = localStorage.getItem("USER_SESSION");
        let email = '';

        if (userSession) {
            const userData = JSON.parse(userSession);
            email = userData.email;
        }

        const responseRegister = await axios.post(`${api}/chat-gpt`, { descripcion, metas, email });
        const mensaje = responseRegister.data.message;
        animateText(mensaje);
        return true;
    } catch (error) {
        if (error instanceof Error) {
            const message = (error as any).response?.data.message;
            console.error("Error al generar la propuesta:", message);
        } else {
            console.error("Error desconocido:", error);
        }
        resetForm();
        return false;
    }

};

export async function obtenerPropuestas() {
    try {
        const userSession = localStorage.getItem("USER_SESSION");
        let emailUser = '';

        if (userSession) {
            const userData = JSON.parse(userSession);
            emailUser = userData.email;
        }

        const response = await axios.get(`${api}/chat-gpt/${emailUser}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export function handleClickEl(cate: any) {
    const id = cate.id;
    const MensajeNegToast = document.getElementById("toast-negative");

    axios
        .delete(`${api}/chat-gpt/${id}`)
        .then((response) => {
            console.log(response);
            window.location.reload();
        })
        .catch((error) => {
            if (error.response) {
                mostrarMensaje(error.response.data.error, MensajeNegToast);
            }
        });
}




