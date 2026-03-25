// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require('cors')


const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://fr-voice-video.vercel.app"
];


app.use(cors({
  origin: [
    "http://localhost:5173",
     "https://fr-voice-video.vercel.app/"
  ],
  credentials: true
}));


app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket.io/",
  cors: {
    origin: [
      "http://localhost:5173",
      "https://fr-voice-video.vercel.app" 
    ],
    methods: ["GET", "POST"],
    credentials: true
  }, // ✅ comma added here
  allowEIO3: true,
  transports: ["polling", "websocket"]
});




app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));


app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    res.status(200).json({ Msg: "updated 22  , " })
});

io.on('connection', (socket) => {
    console.log('connected ', socket.id)

    socket.on('sendMsg', ({ msg: { msg, room } }) => {
        console.log(msg)
        io.to(room).emit('receiveMsg', msg)

        // io.emit('receiveMsg', msg);
        // socket.emit('receiveMsg', msg);
    })
    socket.on("offer", (offer) => {
        // console.log("offer RTC", offer)
        io.emit('offer', offer)
    })
    socket.on("answer", ({ roomId, answer }) => {
        console.log('sended ', answer)
        socket.emit("answer", { answer });
    });
    socket.on("ice-candidate", ({ roomId, candidate }) => {
        socket.emit("ice-candidate", { candidate });
    });
    socket.on("end-call", () => {
        socket.emit("call-ended");
    });
    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });
})


// server.listen(5000, () => {
//     console.log("Server running on http://localhost:5000");
// });
module.exports = app;
