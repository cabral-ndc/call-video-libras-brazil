const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const admin = require("firebase-admin");
const cors = require("cors");

// Inicializa Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Porta dinâmica para rodar no Koyeb
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota para testar se está rodando (Healthcheck)
app.get("/health", (req, res) => {
  res.send("Servidor está rodando!");
});

// Configuração do Firebase Admin usando variável de ambiente
const firebaseConfig = process.env.FIREBASE_CONFIG;

if (!firebaseConfig) {
  console.error("Erro: FIREBASE_CONFIG não foi definido nas variáveis de ambiente.");
  process.exit(1); // Finaliza a execução se não houver configuração
}

const serviceAccount = JSON.parse(firebaseConfig);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// WebRTC e Socket.IO - Gerenciamento de chamadas
io.on("connection", (socket) => {
  console.log("Novo usuário conectado:", socket.id);

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });

  socket.on("signal", (data) => {
    io.to(data.to).emit("signal", { from: data.from, signal: data.signal });
  });
});

// Rota para criar uma nova chamada no Firestore
app.post("/create-call", async (req, res) => {
  try {
    const callRef = db.collection("calls").doc();
    await callRef.set({ createdAt: admin.firestore.FieldValue.serverTimestamp() });

    res.status(201).json({ callId: callRef.id });
  } catch (error) {
    console.error("Erro ao criar chamada:", error);
    res.status(500).json({ error: "Erro ao criar chamada" });
  }
});

// Rota para buscar chamadas ativas
app.get("/calls", async (req, res) => {
  try {
    const snapshot = await db.collection("calls").orderBy("createdAt", "desc").get();
    const calls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.json(calls);
  } catch (error) {
    console.error("Erro ao buscar chamadas:", error);
    res.status(500).json({ error: "Erro ao buscar chamadas" });
  }
});
