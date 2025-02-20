const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const admin = require("firebase-admin");

// Inicializa o Firebase Admin
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const users = {}; // Mapa local para armazenar usuários conectados
const waitingQueue = []; // Fila para chamadas aleatórias

io.on("connection", async (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  // Registrar usuário no mapa local e Firestore
  socket.on("register-user", async (email) => {
    users[email] = socket.id;
    console.log(`${email} registrado como ${socket.id}`);

    // Salvar no Firestore
    await db.collection("users").doc(email).set({
      socketId: socket.id,
      online: true,
    });
  });

  // Buscar ID de contato para chamada direta
  socket.on("request-user-id", async (email, callback) => {
    const userDoc = await db.collection("users").doc(email).get();
    if (userDoc.exists && userDoc.data().online) {
      callback({ success: true, socketId: userDoc.data().socketId });
    } else {
      callback({ success: false, message: "Usuário offline" });
    }
  });

  // Adicionar usuário à fila de chamadas aleatórias
  socket.on("join-random-call", () => {
    waitingQueue.push(socket);

    if (waitingQueue.length >= 2) {
      const user1 = waitingQueue.shift();
      const user2 = waitingQueue.shift();

      io.to(user1.id).emit("random-call-found", { partnerId: user2.id });
      io.to(user2.id).emit("random-call-found", { partnerId: user1.id });

      console.log("Chamada aleatória iniciada entre", user1.id, "e", user2.id);
    }
  });

  // Encaminhar sinais WebRTC
  socket.on("signal", (data) => {
    io.to(data.to).emit("signal", { from: socket.id, signal: data.signal });
  });

  // Desconectar e remover usuário do mapa e Firestore
  socket.on("disconnect", async () => {
    for (const email in users) {
      if (users[email] === socket.id) {
        delete users[email];

        // Atualizar Firestore para marcar o usuário como offline
        await db.collection("users").doc(email).update({
          online: false,
        });

        break;
      }
    }
    console.log(`Usuário desconectado: ${socket.id}`);
  });
});

server.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});
