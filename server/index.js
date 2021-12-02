// server/index.js

const { DataPackage } = require('./tools/DataPackage.js');
const { Event } = require('./tools/Event.js');
const { EventStatus, GameStatus } = require('./tools/EventStatus.js');
const { Game, PlayerProgress } = require('./tools/Game.js');

const webSocketsServerPort = 5110;
const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(webSocketsServerPort, "0.0.0.0");

const wsServer = new webSocketServer({ httpServer: server });

const clients = new Map();
const events = new Map();
const eventStatus = new Map();

const PlayerStates = {
  MOD: "mod",
  PLAYER: "player",
  SPECTATOR: "spectator"
}

wsServer.on('request', function (request) {
  var playerId = generatePlayerId();
  console.log('Recieved new connection');
  const connection = request.accept(null, request.origin);

  connection.on('message', handleRequest);

  connection.on('close', () => handleDisconnect(playerId));

  connection.send(DataPackage("getplayerid", playerId, {playerId: playerId, username: generateGenericUsername()}).toString());

  storeConnection(connection, playerId);
  debugListEvents();
});

function generateGenericUsername() {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return "User-"+s4();
}

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
  let client = clients.get(msg.playerId);
  // let event = events.get(client.event);

  console.log("receiving client request...");

  switch (msg.type) {
    case 'updateplayerdata':
      updatePlayerData(msg.payload.oldPlayerId, msg.playerId, msg.payload.username, msg.payload.playerState);
      debugListClients();
      break;
    case 'createandjoinevent':
      createAndJoinEvent(msg.payload, msg.playerId);
      debugListEvents();
      debugListClients();
      break;
    case 'geteventlist':
      sendEventList(msg.playerId);
      break;
    case 'eventupdate':
      sendEvent(msg.playerId, player.event);
      break;
    case 'eventstatusupdate':
      sendEventStatus(msg.playerId, client.event);
      break;
    case 'joinevent':
      joinEvent(msg.playerId, msg.payload.eventId);
      break;
    case 'seteventstatus':
      updateEventStatus(client.event, msg.payload);
      break;
    case 'triggerresultscreen':
      handleResultScreenTrigger(client.event, msg.playerId, msg.payload);
      break;
    case 'chat':
      handleChatMsg(client.event, msg.playerId, msg.payload);
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
  let eventId = null;
  if (c && c.event)
    eventId = c.event;
  clients.delete(playerId);
  if (!eventId)
    updateEventPlayerList(eventId);
  console.log(clients.size + " clients connected");
}

/**
 * store new connection in map 
 * @param {connection} connection 
 * @param {String} playerId 
 */
function storeConnection(connection, playerId) {
  let client = { event: null, socket: connection, username: '', playerState: PlayerStates.PLAYER};
  clients.set(playerId, client);

  console.log('connected: ' + playerId);
  console.log(clients.size + " clients connected");
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
 * @param {String} eventId 
 * @param {DataPackage} msg 
 */
function sendToAllInEvent(eventId, msg) {
  clients.forEach(c => {
    if (c.event + '' === eventId + '') {
      msg.playerId = c.playerId;
      c.socket.send(msg.toString());
    }
  });
}

/**
 * send msg to all user in no event
 * @param {DataPackage} msg 
 */
function sendAllInNoEvent(msg) {
  clients.forEach(c => {
    if (!c.event || c.event+'' === '') {
      msg.playerId = c.playerId;
      c.socket.send(msg.toString());
    }
  });
}

/**
 * send the eventobject to all players in event 
 * @param {String} eventID 
 */
function sendEventToAllInEvent(eventId) {
  sendToAllInEvent(eventId, DataPackage('eventupdate', '', events.get(eventId)));
}

/**
 * send the eventobject to specific player
 * @param {String} playerId
 * @param {String} eventID 
 */
function sendEvent(playerId, eventId) {
  sendToClient(DataPackage('eventupdate', playerId, events.get(eventId)));
}

/**
 * send the status to all players in event 
 * @param {String} eventID 
 */
function sendEventStatusToAllInEvent(eventId) {
  sendToAllInEvent(eventId, DataPackage('eventstatusupdate', '', eventStatus.get(eventId)));
}

/**
 * send the eventstatus to specific player
 * @param {String} playerId
 * @param {String} eventID 
 */
function sendEventStatus(playerId, eventId) {
  sendToClient(DataPackage('eventstatusupdate', playerId, eventStatus.get(eventId)));
}

/**
 * Sends all active events to client {id, title, onlinecount}
 * @param {String} playerId 
 */
function sendEventList(playerId) {
  sendToClient(DataPackage('geteventlist', playerId, getEventList()));
}

function sendEventListToAllInNoEvent() {
  const eventList = getEventList();
  clients.forEach((client, playerId) => {
    if(!client.event || client.event === '') {
      sendToClient(DataPackage('geteventlist', playerId, eventList));
    }
  });
}

/**
 * sends to all users in event with id eventID the current playerlist {id, name}
 * @param {String} playerId 
 */
function updateEventPlayerList(eventID) {
  let list = [];
  let debug_i = 0;
  clients.forEach((c, playerId) => {
    if (c.event + '' === eventID + '') {
      debug_i++;
      list.push({ playerId: playerId, username: c.username, playerState: c.playerState });
    }
  });
  console.log("updateing playerlist for " + debug_i + " players; tot: " + clients.size);
  sendToAllInEvent(eventID, DataPackage('updateplayerlist', '', list));
}

function mapToObject(map) {
  let ret = {};
  if(map instanceof Map) {
    map.forEach((a, k) => {
      ret[k] = a;
    });
  }
  return ret;
}

function getEventList() {
  let ev = mapToObject(events);
  let eventlist = [];
  Object.keys(ev).forEach(eventId => {
    let c = 0;
    clients.forEach(cl => cl.event === eventId ? c++ : null);
    eventlist.push({ eventId: eventId, title: ev[eventId].title, online: c });
  });
  return eventlist;
}

function getPlayerByStateInEvent(eventId, playerState) {
  let ret = [];
  clients.forEach((c, id) => {
    if(c.event+'' === eventId && c.playerState === playerState) {
      ret.push({ playerId: playerId, username: c.username, playerState: c.playerState });
    }
  });
}

function debugListClients() {
  Array.from(clients.keys()).forEach(a => {
    if (clients.get(a))
      console.log('uid: ' + a + ' event: ' + clients.get(a).event + ' user: ' + clients.get(a).username);
  });
}

function debugListEvents() {
  if (events.size === 0)
    console.log("no events open");
  else {
    Array.from(events.keys()).forEach(a => {
      if (events.get(a))
        console.log('eid: ' + a + ' event name: ' + events.get(a).title);
    });
  }
}

function updatePlayerData(oldPlayerId, newPlayerId, username, playerState) {
  let c = clients.get(oldPlayerId);
  if (c) {
    if (oldPlayerId !== newPlayerId) {
      console.log("update Client...");
      let nc = {};
      Object.assign(nc, [c]);
      nc.socket = c.socket;
      if(username)
        nc.username = username;
      if(playerState)
        nc.playerState = playerState;
      clients.set(newPlayerId, nc);
      clients.delete(oldPlayerId);
    } else {
      if(username)
        c.username = username;
      if(playerState)
        c.playerState = playerState;
    }
    if(c.event) {
      updateEventPlayerList(c.event);
    }
  }
}

function createAndJoinEvent(rawEvent, playerId) {
  let player = clients.get(playerId);
  if (player && rawEvent) {
    let games = [];
    rawEvent.games.forEach(game => {
      games.push(Game(game.title, game.desciption, game.type, game.useTeams, game.content));
    });
    let event = Event(rawEvent.title, games);
    let eventId = generateEventId();
    events.set(eventId, event);
    player.event = eventId;
    player.playerState = PlayerStates.MOD;
    
    let es = EventStatus(playerId);
    games.forEach(() => {
      es.gameStatus.push(GameStatus());
    });
    eventStatus.set(eventId, es);

    sendEvent(playerId, eventId);
    sendEventStatus(playerId, eventId);
    updateEventPlayerList(eventId);
    sendEventListToAllInNoEvent();
    // sendToClient(DataPackage("createandjoinevent", playerId, { eventId: eventId }));
  }
}

function joinEvent(playerId, eventId) {
  let c = clients.get(playerId);
  if (c) {
    let es = eventStatus.get(eventId);
    if(es) {
      c.event = eventId;
      c.playerState = PlayerStates.PLAYER;

      es.globalScores[playerId] = 0;
  
      sendEvent(playerId, eventId);
      sendEventStatusToAllInEvent(eventId);
      sendToClient(DataPackage('updateplayerdata', playerId, {playerState: PlayerStates.PLAYER}));
      updateEventPlayerList(eventId);

    }

  }
}

function updateEventStatus(eventId, status) {
  eventStatus.set(eventId, status);
  sendEventStatusToAllInEvent(eventId);
}

function handleChatMsg(eventId, playerId, chatMsg) {
  let shouldSend = true;
  if(chatMsg.text.startsWith('/')) {
    let cmd = chatMsg.text.substring(1);
    switch (cmd) {
      case 'roll':
        let r = Math.trunc(Math.random()*100);
        chatMsg.username = ">" + chatMsg.username;
        chatMsg.text = "rolled "+r;
        break;

      case 'flip':
        let r2 = Math.round(Math.random());
        chatMsg.username = ">" + chatMsg.username;
        chatMsg.text = "flipped "+(r2?"tail":"head");
        break;
      default:
        shouldSend = false;
        break;
    }
  }
  if(shouldSend)
    sendToAllInEvent(eventId, DataPackage('chat', playerId, chatMsg));
}

function handleResultScreenTrigger(eventId, playerId, roundDataObj) {
  sendToAllInEvent(eventId, DataPackage('triggerresultscreen', playerId, roundDataObj));
}