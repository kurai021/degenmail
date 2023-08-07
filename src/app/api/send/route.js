import loadEnv from "../../config/loadEnv"
loadEnv()

import { ethers, getAddress } from "ethers";
import { abi } from "../../../../../degenmail_hardhat/artifacts/contracts/Messages.sol/Messages.json"

import { NextResponse } from 'next/server';

export async function POST(req, res) {

    const data = await req.json()
    const { realSender, receiver, content } = data;

    console.log(data)
    try {
        // Conexión al contrato en la red de Sepolia
        const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_KEY_URL);

        // Obtener el objeto Signer desde la clave privada
        const privateKey = process.env.SEPOLIA_PRIVATE_KEY;
        const signer = new ethers.Wallet(privateKey, provider);

        const contractAddress = process.env.CONTRACT; // Reemplaza por la dirección de tu contrato desplegado en Sepolia
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // Envío del mensaje utilizando la función sendMessage del contrato
        await contract.sendMessage(getAddress(receiver), content, realSender);

        return NextResponse.json({ message: "Message Sent", success: true });
    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        return NextResponse.json({ message: error, success: false });
    }
}