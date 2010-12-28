var Faye = require('faye');

WebsocketServer = function(){};

WebsocketServer.prototype.fayeServer = function(){
  var server = new Faye.NodeAdapter({mount: '/faye'});
  return server;
};

exports.WebsocketServer = WebsocketServer;
