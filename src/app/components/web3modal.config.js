'use client'

import Web3Modal from "web3modal";
import Metamask from "@metamask/providers"

const providerOptions = {
    metamask: {
        package: Metamask,
        options: {
            appName: "DegenMail",
            defaultNetwork: 'ethereum'
        }
    }
};

const web3ModalConfig = new Web3Modal({
    network: "sepolia", // Configura la red a la que deseas conectar tu web app (puedes cambiarlo a "mainnet" una vez que estés listo para la producción)
    cacheProvider: true, // Almacena en caché la sesión de la billetera para una experiencia de usuario más fluida
    providerOptions, // Pasa las opciones del proveedor
});

export default web3ModalConfig;