# 📹 Aplicativo de Videochamada com WebRTC e Firebase

Este é um aplicativo de videochamada em tempo real utilizando **WebRTC**, **Socket.IO** e **Firebase Authentication**.

## 🚀 Tecnologias Utilizadas
- **React.js** (Frontend)
- **Express.js** (Backend)
- **Socket.IO** (Comunicação em tempo real)
- **WebRTC** (Transmissão de vídeo e áudio)
- **Firebase Authentication** (Login de usuários)
- **Firestore** (Banco de dados)

## 🔧 Instalação e Uso

### 1️⃣ Configurar Firebase
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Ative **Authentication** (Login por Email/Senha).
3. Ative **Firestore** e crie uma coleção `users`.
4. Vá em **Configurações do Projeto > Contas de Serviço** e gere um arquivo `serviceAccountKey.json`.

### 2️⃣ Instalar dependências
```bash
npm install
cd frontend && npm install
