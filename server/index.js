// server/index.js

const {DataPackage} = require('./tools/DataPackage.js');
const {Event} = require('./tools/Event.js');
const {Game, PlayerProgress} = require('./tools/Game.js');

const webSocketsServerPort = 5110;
const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(webSocketsServerPort, "0.0.0.0");

const wsServer = new webSocketServer({httpServer: server});

const clients = new Map();
const events = new Map();



wsServer.on('request', function (request) {
  var playerId = generatePlayerId();
  console.log('Recieved new connection');
  const connection = request.accept(null, request.origin);

  connection.on('message', handleRequest);

  connection.on('close', () => handleDisconnect(playerId));

  connection.send(DataPackage("getplayerid", playerId, playerId).toString());

  storeConnection(connection, playerId);
  debugListEvents();
});

function generatePlayerId() {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
}

function generateEventId() {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4();
}

/**
 * manages all the incomming ws-requests
 * @param {import('websocket').IMessage} req 
 */
 function handleRequest(reqest) {

    let msg = DataPackage();
    msg.parse(reqest.utf8Data);
  
    console.log("receiving client request...");
  
    switch (msg.type) {
      case "createandjoinevent":
        createAndJoinEvent(msg.payload, msg.playerId);
        debugListEvents();
        debugListClients();
        break;
      case 'updateplayerdata':
        updatePlayerData(msg.payload.oldPlayerId, msg.playerId, msg.payload.username);
        debugListClients();
        break;
      default:
        break;
    }

  }
  
  /**
   * 
   * @param {String} playerId 
   */
  function handleDisconnect(playerId) {
    console.log(playerId + " disconnected");
    let c = clients.get(playerId);
    let g = '';
    if(c!==undefined && c.event!==null)
      g = c.event;
    clients.delete(playerId);
    if(g!=='')
      updateEventPlayerList(g);
    console.log(clients.size + " clients connected");
  }
  
  /**
   * store new connection in map 
   * @param {connection} connection 
   * @param {String} playerId 
   */
  function storeConnection(connection, playerId) {
      let client = { event: null, socket: connection, username: '' };
      clients.set(playerId, client);
  
      console.log('connected: ' + playerId);
      console.log(clients.size + " clients connected");
  }
  
  /**
   * send the newest eventobject to all players in event 
   * @param {String} eventID 
   */
   function sendEventUpdate(eventID) {
      sendToAllInEvent(eventID, DataPackage('eventupdate', '', events.get(eventID)));
  }
  
  /**
   * sends to all users in event with id eventID the current playerlist {id, name}
   * @param {String} playerId 
   */
  function updateEventPlayerList(eventID) {
    let list = [];
    let debug_i = 0;
    clients.forEach(c => {
      if (c.event+'' === eventID+'') {
        debug_i++;
        list.push({ id: c.user.id, name: c.user.name });
      }
    });
    console.log("updateing playerlist for " + debug_i + " players; tot: " + clients.size);
    let s = DataPackage('updateplayerlist', '', list);
    sendToAllInEvent(eventID, s);
  }
  
  /**
   * send msg to client with id msg.id in client list
   * @param {DataPackage} msg 
   */
  function sendToClient(msg) {
    debugListClients();
    let c = clients.get(msg.playerId);
    if (c) c.socket.send(msg.toString());
    else return false;
    return true;
  }
  
  /**
   * send msg to all user in event with id eventID
   * @param {String} eventID 
   * @param {DataPackage} msg 
   */
  function sendToAllInEvent(eventID, msg) {
    clients.forEach(c => {
      if (c.event+'' === eventID+'')
        c.socket.send(msg);
    });
  }
  
  function debugListClients() {
    Array.from(clients.keys()).forEach(a => {
      if(clients.get(a))
        console.log('uid: '+a+' event: '+clients.get(a).event+' user: '+clients.get(a).username);
    });
  }

  function debugListEvents() {
    if(events.size===0)
      console.log("no events open");
    else {
      Array.from(events.keys()).forEach(a => {
        if(events.get(a))
          console.log('eid: '+a+' event name: '+events.get(a).title);
      });
    }
  }

function createAndJoinEvent(rawEvent, playerId) {
  let player = clients.get(playerId);
  if(player && rawEvent) {
    let games = [];
    rawEvent.games.forEach(game => {
      games.push(Game(game.title, game.desciption, game.type, game.useTeams, game.content));
    });
    let event = Event(rawEvent.title, games);
    let eventId = generateEventId();
    events.set(eventId, event);
    player.event = eventId;
    sendToClient(DataPackage("eventcreated", playerId, {eventId: eventId}));
  }
}

function updatePlayerData(oldPlayerId, newPlayerId, username) {
  let c = clients.get(oldPlayerId);
  if(c) {
    if(oldPlayerId!==newPlayerId) {
      console.log("update Client...");
      let nc = {};
      Object.assign(nc, [c]);
      nc.username = username;
      nc.socket = c.socket;
      clients.set(newPlayerId, nc);
      clients.delete(oldPlayerId);
    } else {
      c.username = username;
    }
  }
}