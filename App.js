import React, { useState } from "react";
import Login from "./components/Login";
import Contacts from "./components/Contacts";
import { io } from "socket.io-client";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import Peer from "simple-peer";
import Dictionary from "./components/Dictionary";

const socket = io("http://localhost:5000");

const App = () => {
  const [user, setUser] = useState(null);
  const [peer, setPeer] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [showDictionary, setShowDictionary] = useState(false);

  const startCall = (contactEmail) => {
    socket.emit("request-user-id", contactEmail, (response) => {
      if (response.success) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
          setMyStream(stream);
          const newPeer = new Peer({ initiator: true, trickle: false, stream });
          newPeer.on("signal", (data) => {
            socket.emit("call-user", { to: response.socketId, signalData: data });
          });
          setPeer(newPeer);
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      {!user ? (
        <Login onAuth={(email) => { setUser(email); socket.emit("register-user", email); }} />
      ) : (
        <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Bem-vindo, {user}!</h2>
          <button className="bg-red-500 px-4 py-2 rounded-md mb-4" onClick={() => signOut(auth).then(() => setUser(null))}>
            Sair
          </button>
          <Contacts startCall={startCall} />

          {myStream && (
            <div className="mt-6 flex flex-col items-center">
              <video autoPlay playsInline className="rounded-lg mt-2 border border-gray-500 w-full max-w-lg" ref={(ref) => ref && (ref.srcObject = myStream)} />
              <button className="mt-4 bg-blue-500 px-4 py-2 rounded-md" onClick={() => setShowDictionary(!showDictionary)}>
                {showDictionary ? "Fechar Dicionário" : "Abrir Dicionário"}
              </button>
            </div>
          )}

          {showDictionary && <Dictionary />}
        </div>
      )}
    </div>
  );
};

export default App;
