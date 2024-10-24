import { FormEvent } from "react";
import { mostrarMensaje } from "../Components/toast";
import axios from "axios";
// const api = "https://pro-gpt-backend.vercel.app";
const api = "http://localhost:4000"

export const handleSubmitUsers = async (
    event: FormEvent,
    name: string,
    email: string,
    password: string,
    isVerified: boolean,
    setName: React.Dispatch<React.SetStateAction<string>>,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
    setisVerify: React.Dispatch<React.SetStateAction<boolean>>
): Promise<boolean> => {
    event.preventDefault();
    const MensajeErrUsuario = document.getElementById("MensajeErrUsuario");
    const MensajeActUsuario = document.getElementById("MensajeActUsuario");

    if (name === "") {
        mostrarMensaje("Ingrese su nombre", MensajeErrUsuario);
        return false;
    }

    if (email === "") {
        mostrarMensaje("Ingrese su correo", MensajeErrUsuario);
        return false;
    }

    if (password === "") {
        mostrarMensaje("Ingrese su password", MensajeErrUsuario);
        return false;
    }

    function resetForm() {
        setName("");
        setEmail("");
        setPassword("");
        setisVerify(false);
    }

    try {
        const responseRegister = await axios.post(`${api}/auth/register`, { name, email, password, isVerified });
        const mensaje = responseRegister.data.message;
        mostrarMensaje(mensaje, MensajeActUsuario);
        resetForm();
        return true;
    } catch (error: any) {
        const message = error.response?.data.message;
        mostrarMensaje(message, MensajeErrUsuario);
        resetForm();
        return false;
    }
};

export interface emailData {
    email: string
}

export const handleSubmitEmail = async (
    event: FormEvent,
    email: string,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
): Promise<emailData | null> => {
    event.preventDefault();
    const MensajeErr = document.getElementById("MensajeErr");
    const MensajeAct = document.getElementById("MensajeAct");

    if (email === "") {
        mostrarMensaje("Ingrese su correo electrónico", MensajeErr);
        return null;
    }

    function resetForm() {
        setEmail("");
    }

    try {
        const responseEmail = await axios.post(`${api}/auth/email`, { email });
        resetForm();
        mostrarMensaje(responseEmail.data.message, MensajeAct);
        return { email };
    } catch (error: any) {
        const message = error.response?.data.message;
        mostrarMensaje(message, MensajeErr);
        resetForm();
        return null;
    }
};

export interface upEmailData {
    tokens: any;
    name: string;
    email: string;
    telefone: string;
}

export const handleSubmitPassUpEmail = async (
    event: FormEvent,
    password: string,
    verPassword: string,
    setVerPassword: React.Dispatch<React.SetStateAction<string>>,
    setPassword: React.Dispatch<React.SetStateAction<string>>
): Promise<upEmailData | null> => {
    event.preventDefault();
    const MensajeErr = document.getElementById("MensajeErrEmail");
    const MensajeAct = document.getElementById("MensajeActEmail");

    if (password === "") {
        mostrarMensaje("Ingrese su nueva contraseña", MensajeErr);
        return null;
    }

    if (verPassword === "") {
        mostrarMensaje("Ingrese la verificación", MensajeErr);
        return null;
    }

    if (password !== verPassword) {
        mostrarMensaje("Las contraseñas no coinciden", MensajeErr);
        return null;
    }

    function resetForm() {
        setPassword("");
        setVerPassword("");
    }

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const responseSesion = await axios.patch(`${api}/auth/update-password-email`, { password, verPassword }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        resetForm();
        mostrarMensaje(responseSesion.data.message, MensajeAct);

        const tokens = responseSesion.data.tokens;
        const name = responseSesion.data.name;
        const emaile = responseSesion.data.email;
        const telefone = responseSesion.data.telefone;

        return { tokens, name, email: emaile, telefone };
    } catch (error: any) {
        const message = error.response?.data.message;
        mostrarMensaje(message, MensajeErr);
        resetForm();
        return null;
    }

};