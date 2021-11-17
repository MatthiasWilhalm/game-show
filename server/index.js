// server/index.js

const {DataPackage} = require('./tools/DataPackage.js');

const webSocketsServerPort = 5110;
const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(webSocketsServerPort, "0.0.0.0");

const wsServer = new webSocketServer({httpServer: server});

const clients = new Map();

wsServer.on('request', function (request) {
  var userID = getUniqueID();
  console.log('Recieved new connection');
  const connection = request.accept(null, request.origin);

  connection.on('message', handleRequest);

  connection.on('close', () => handleDisconnect(userID));

  connection.send(DataPackage("getsessionid", userID, "welcome"));

  storeConnection(connection, userID);
});

function getUniqueID() {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
}

/**
 * manages all the incomming ws-requests
 * @param {import('websocket').IMessage} req 
 */
 function handleRequest(reqest) {

    let msg = DataPackage();
    msg.parse(reqest.utf8Data);
  
    // resyncClientData(msg);

    console.log("receiving client request...");
  
    // TODO: handel request

  }
  
  /**
   * 
   * @param {String} userID 
   */
  function handleDisconnect(userID) {
    console.log(userID + " disconnected");
    let c = clients.get(userID);
    let g = '';
    if(c!==undefined && c.game!==null)
      g = c.game;
    clients.delete(userID);
    if(g!=='')
      updateGamePlayerList(g);
    console.log(clients.size + " clients connected");
  }
  
  /**
   * store new connection in map 
   * @param {connection} connection 
   * @param {String} userID 
   */
  function storeConnection(connection, userID) {
      let client = { game: null, socket: connection, user: { id: null, name: '' } };
      clients.set(userID, client);
  
      console.log('connected: ' + userID);
      console.log(clients.size + " clients connected");
  }
  
  /**
   * send the newest gameobject to all players in game 
   * @param {String} gameID 
   */
   function sendGameUpdate(gameID) {
    dbc.getGame(gameID).then(game => {
      sendToAllInGame(gameID, "hi threre");
    });
  }
  
  /**
   * sends to all users in game with id gameID the current playerlist {id, name}
   * @param {String} userID 
   */
  function updateGamePlayerList(gameID) {
    let list = [];
    let debug_i = 0;
    clients.forEach(c => {
      //console.log(typeof gameID);
      //console.log(c.game.trim() == gameID.trim());
      if (c.game+'' === gameID+'') {
        debug_i++;
        list.push({ id: c.user.id, name: c.user.name });
      }
    });
    console.log("updateing playerlist for " + debug_i + " players; tot: " + clients.size);
    let s = SocketCommunication('updateplayerlist', '', '', list);
    sendToAllInGame(gameID, s);
  }
  
  /**
   * send msg to client with id msg.id in client list
   * @param {SocketCommunication} msg 
   */
  function sendToClient(msg) {
    debugListClients();
    let c = clients.get(msg.id);
    if (c !== undefined) c.socket.send(msg.getMsg());
    else return false;
    return true;
  }
  
  /**
   * send msg to all user in game with id gameID
   * @param {String} gameID 
   * @param {SocketCommunication} msg 
   */
  function sendToAllInGame(gameID, msg) {
    clients.forEach(c => {
      if (c.game+'' === gameID+'')
        c.socket.send(msg);
    });
  }
  
  function debugListClients() {
    Array.from(clients.keys()).forEach(a => {
      if(clients.get(a)!==undefined)
        console.log('sid: '+a+' game: '+clients.get(a).game+' user: '+clients.get(a).user.name);
      //console.log('sid: '+a);
  
    });
  }

/**
 * Takes the tokendata and resyncs it with the clients array
 * @param {SocketCommunication} msg 
 * @deprecated
 */
function resyncClientData(msg) {
    let c = clients.get(msg.id);
    if (c) {
      let user = am.getUser(msg.token);
      c.user = { id: user.id, name: user.name };
    }
  }