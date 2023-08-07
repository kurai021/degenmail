import loadEnv from "../../config/loadEnv"
loadEnv()

import { ethers } from "ethers";
import { abi } from "../../../../../degenmail_hardhat/artifacts/contracts/Messages.sol/Messages.json"

import { NextResponse } from 'next/server';

export async function GET(req, res) {
    try {
        // Conexión al contrato en la red de Sepolia
        const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_KEY_URL);

        const contractAddress = process.env.CONTRACT; // Reemplaza por la dirección de tu contrato desplegado en Sepolia
        const contract = new ethers.Contract(contractAddress, abi, provider);

        // Obtenemos la dirección del usuario actual desde el request
        const url = new URL(req.url)
        const userAddress = url.searchParams.get("userAddress")

        // Obtener el último ID de mensaje del usuario actual (último mensaje recibido)
        const userMessages = await contract.getUserMessages(userAddress);
        const lastMessageId = userMessages[userMessages.length - 1];

        // Crear un array para almacenar los mensajes del usuario
        const messages = [];

        // Recorrer todos los mensajes del usuario desde el primer mensaje hasta el último
        for (let messageId = 1; messageId <= lastMessageId; messageId++) {
            // Obtener el mensaje utilizando la función getMessage del contrato
            const result = await contract.getMessage(messageId);


            // Verificar si el mensaje pertenece al usuario actual (es el destinatario)
            if (result[1].toLowerCase() === userAddress.toLowerCase()) {
                // Los datos del mensaje
                const sender = result[0];
                const receiver = result[1];
                const realSender = result[2]
                const timestamp = Number(result[3]);
                const content = result[4];

                // Agregar el mensaje al array de mensajes del usuario
                messages.push({
                    messageId,
                    sender,
                    realSender,
                    receiver,
                    timestamp,
                    content
                });
            }
        }

        //console.log(messages)

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error al obtener los mensajes del usuario:", error);
        return NextResponse.json({ message: error, success: false });
    }
}