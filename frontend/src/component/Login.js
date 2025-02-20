

import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Login = ({ onAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onAuth(email);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">{isRegister ? "Criar Conta" : "Login"}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form className="flex flex-col" onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          className="p-2 mb-2 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="p-2 mb-2 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 px-4 py-2 rounded-md mt-2">{isRegister ? "Registrar" : "Entrar"}</button>
      </form>
      <button className="text-sm mt-4 text-gray-300" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Já tem conta? Faça login" : "Não tem conta? Registre-se"}
      </button>
    </div>
  );
};

export default Login;
