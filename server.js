const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const express = require("express");
var { ExpressPeerServer } = require("peer");
const { mongourl, port, users_allowed_in_room } = require("./config");
const TextEditor = require("./schema/TextEditorSchema");

//mongoose connection
mongoose.connect(`${mongourl}`, { useNewUrlParser: true });

// initialize the express server
const app = express();
app.use(cors());
const server = require("http").Server(app);

// setup CORS policy
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// setup peer server
const peerServer = ExpressPeerServer(server, {
  path: "/",
});
app.use("/peerjs", peerServer);

// constants
//initial text in every new text-editor (blank)
const DEFAULT_TEXT = "";
//users -> dictionary of roomID:[array of users(their socket ID's) in that room]
const users = {};
//socketID->roomID mapping
const socketToRoom = {};

io.on("connection", (socket) => {
  // for text-editor

  socket.on("get-text-editor-data", async (roomID) => {
    //find if the room exists, fetch text data from DB
    const document = await findOrCreateTextData(roomID);
    socket.join(roomID);

    //if room exists send text editor data to user
    socket.emit("load-text-editor-data", document.data);

    //if user makes changes -> broadcast delta changes to everyone in that room
    socket.on("send-text-changes", (delta) => {
      socket.broadcast.to(roomID).emit("receive-text-changes", delta);
    });

    //save received changes to mongo-database
    socket.on("save-text-editor-data", async (data) => {
      await TextEditor.findByIdAndUpdate(roomID, { data });
    });
  });

  // for video / audio calls

  socket.on("join-video-room", (roomID) => {
    //if room exists -> add user to room
    if (users[roomID]) {
      const length = users[roomID].length;
      //if room is full -> reject user (max 5 users allowed to avoid overload on client)
      if (length === users_allowed_in_room) {
        socket.emit("room-full-reject");
        return;
      }
      //else add user to room
      users[roomID].push(socket.id);
    } else {
      //create new room on backend
      users[roomID] = [socket.id];
    }

    //add roomID->socketID mapping
    socketToRoom[socket.id] = roomID;

    // send all other users to the user who just joined (except his own ID)
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);
    socket.emit("all-users-in-room", usersInThisRoom);
  });

  socket.on("sending-signal", (payload) => {
    io.to(payload.userToSignal).emit("user-joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning-signal", (payload) => {
    io.to(payload.callerID).emit("receiving-returned-signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    //remove user from room is user disconnects
    const roomID = socketToRoom[socket.id];
    var room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }
    //broadcast to everyone that this particular user has left
    socket.broadcast.emit("user-left", socket.id);
  });
});

// if room exists -> send text data of room, else send default text
const findOrCreateTextData = async (roomID) => {
  if (roomID == null) return;
  //fetch text editor data of room from mongoDB
  const textEditorData = await TextEditor.findById(roomID);
  if (textEditorData) return textEditorData;
  //if not present return new data
  return await TextEditor.create({ _id: roomID, data: DEFAULT_TEXT });
};

// serve client files
app.use(express.static(path.join(__dirname, "/client")));
// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/index.html"));
});

// listen
server.listen(port || 5000);
