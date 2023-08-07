'use client'

import Web3Modal from "./components/web3modal";
import { useState, useEffect } from "react";
import axios from "axios";

import MdEditor from "./components/mdeditor"
import ReactMarkdown from 'react-markdown'

export default function Home() {

  const [receiver, setReceiver] = useState("");
  const [content, setContent] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState([]);

  const handleSend = async () => {
    if (userAddress) {
      try {
        console.log(userAddress)
        const response = await axios.post("/api/send", { receiver, content, userAddress });
        setResponseMessage("Mensaje enviado correctamente");

        setShowModal(false)
      } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        setResponseMessage("Ocurrió un error al enviar el mensaje");
      }
    }
  };

  const handleReceive = async () => {
    if (userAddress) {
      try {
        const response = await axios.get(`/api/receive?userAddress=${userAddress}`); // Aquí puedes ajustar el mensajeId para obtener nuevos mensajes
        const messages = response.data;
        // Actualizar el estado con los mensajes del usuario
        setReceivedMessages(messages);
      } catch (error) {
        console.error("Error al recibir mensajes:", error);
      }
    }

    else {
      console.log("no se ha encontrado la dirección de la wallet")
    }
  };

  // Llamada inicial al cargar la página y luego cada 1 minuto (60,000 ms)
  useEffect(() => {
    handleReceive();
    const interval = setInterval(handleReceive, 60000);
    return () => clearInterval(interval);
  }, []);

  // Dependencia en receivedMessages para que el componente se actualice cuando cambien los mensajes recibidos
  useEffect(() => {
    // No es necesario hacer nada aquí, ya que los mensajes se actualizan en la función handleReceive
    // El componente se volverá a renderizar automáticamente con los nuevos mensajes
  }, [receivedMessages]);

  return (
    <div>
      <Web3Modal onUserAddress={setUserAddress} />
      <div className="flex flex-row space-x-4 h-full">
        <div className="basis-1/4 mx-auto m-4 p-4 border rounded-lg">
          <div className="mt-4">
            <h2 className="text-2xl mb-4">Correos recibidos</h2>
            <div className="messagesList">
              {receivedMessages.length > 0 ? (
                receivedMessages.slice().reverse().map((message, index) => (
                  <div key={index} className="border p-2 rounded-lg mb-2" onClick={() => setExpandedMessage(message)}>
                    <p>Remitente: {message.realSender}</p>
                    <p>Contenido: {message.content.length > 100 ? `${message.content.substring(0, 100)}...` : message.content}</p>
                    <p>Timestamp: {new Date(message.timestamp * 1000).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p>No hay mensajes recibidos.</p>
              )}
            </div>
          </div>
        </div>

        <div className="basis-3/4 mx-auto m-4 p-4 border rounded-lg">
          <h1 className="text-3xl font-semibold mb-4">DegenMail</h1>
          <button data-modal-target="staticModal" data-modal-toggle="staticModal" className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button" onClick={() => setShowModal(true)}>
            Escribir un mensaje
          </button>

          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            onClick={handleReceive}
          >
            Actualizar
          </button>

          {expandedMessage.content ? (
            <div className="message">
              <h2>De: {expandedMessage.realSender}</h2>
              <h3>Fecha: {new Date(expandedMessage.timestamp * 1000).toLocaleString()}</h3>
              <div className="messageContent">
                <ReactMarkdown>{expandedMessage.content}</ReactMarkdown>
              </div>
            </div>
          ) : null}

          {showModal ? (
            <>
              <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
              >
                <div className="relative w-4/5 my-6 mx-auto">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-black outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                      <h3 className="text-3xl font-semibold">
                        Escribir un Email
                      </h3>
                      <button
                        className="p-1 ml-auto bg-transparent border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={() => setShowModal(false)}
                      >
                        <span className="bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none" onClick={() => setShowModal(false)}>
                          ×
                        </span>
                      </button>
                    </div>
                    {/*body*/}
                    <div className="relative p-6 flex-auto">
                      <div className="mb-4">
                        <label htmlFor="receiver" className="block mb-1 font-medium">
                          Receptor:
                        </label>
                        <input
                          type="text"
                          id="receiver"
                          className="w-full border rounded-lg p-2"
                          value={receiver}
                          onChange={(e) => setReceiver(e.target.value)}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="content" className="block mb-1 font-medium">
                          Contenido del mensaje:
                        </label>

                        <MdEditor id="content" content={content} onChange={setContent} />
                      </div>
                      {responseMessage && (
                        <p className="text-green-500 mb-4">{responseMessage}</p>
                      )}
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                        onClick={handleSend}
                      >
                        Enviar mensaje
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null}

        </div>
      </div>
    </div>
  )
}
