import loadEnv from "../../config/loadEnv"
loadEnv()

import { ethers, getAddress } from "ethers";
import { abi } from "../../../../../degenmail_hardhat/artifacts/contracts/Messages.sol/Messages.json"

import { NextResponse } from 'next/server';

export async function POST(req, res) {

    const data = await req.json()
    const { receiver, content, userAddress } = data;

    try {
        // Conexión al contrato en la red de Sepolia
        const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_KEY_URL);

        // Obtener el objeto Signer desde la clave privada
        const privateKey = process.env.SEPOLIA_PRIVATE_KEY;
        const signer = new ethers.Wallet(privateKey, provider);

        const contractAddress = process.env.CONTRACT; // Reemplaza por la dirección de tu contrato desplegado en Sepolia
        const contract = new ethers.Contract(contractAddress, abi, signer);

        console.log(getAddress(receiver))
        console.log(content)
        console.log(userAddress)
        // Envío del mensaje utilizando la función sendMessage del contrato
        await contract.sendMessage(getAddress(receiver), content, userAddress);

        return NextResponse.json({ message: "Message Sent", success: true });
    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        return NextResponse.json({ message: error, success: false });
    }
}