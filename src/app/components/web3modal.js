'use client'

import { useEffect, useState } from "react";
import web3ModalConfig from "./web3modal.config";

function Web3Modal({ onUserAddress }) {
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        const connectWallet = async () => {
            try {
                const newProvider = await web3ModalConfig.connect();
                setProvider(newProvider);

                // Obtener la dirección del usuario actual del proveedor y pasarla a la función onUserAddress
                const userAddress = newProvider.selectedAddress;
                onUserAddress(userAddress);
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        };

        connectWallet();
    }, [onUserAddress]);

    return null; // Devolvemos null ya que no necesitamos renderizar ningún elemento en este componente
}

export default Web3Modal;