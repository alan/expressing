var express = require('express');

var UserProvider = require('./user_provider_memory').UserProvider;
var WebsocketServer = require('./websocket_server').WebsocketServer;

var userProvider = new UserProvider();
var websocketServer = new WebsocketServer();
var app = express.createServer();

app.configure(function(){
	app.use(express.staticProvider(__dirname + '/public'));
	app.use(express.bodyDecoder());
    app.use(express.logger({format: ':method:uri'}));
    app.set('view engine', 'ejs');
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true}));
});


function loadUser(req, res, next){
  userProvider.findById(
      req.params.id,
    function(error, doc){
      if(error || doc === null){
        next(new Error('Failed to load user ' + req.params.id));
      }
      req.user = doc;
      next(); 
  });
}

app.get('/', function(req, res){
	res.send('hello world');
});

app.get("/users", function(req, res){
  userProvider.findAll(function(error, docs){
    res.render('users', {
      locals: {users: docs}
    });
  });
});

app.get("/users/new", function(req, res){
    res.render('user_new');
});

app.post("/user", function(req, res){
  userProvider.save({
    name: req.body.user.name
  }, function(error, docs){
    res.redirect("/users");
  });
});


app.get("/users/:id?", loadUser, function(req, res){
    res.render('hello_user', {
      locals: {user: req.user}
    });
});

app.post("/json_request", function(req, res){
	res.send(req.body);
});

var websocket = websocketServer.fayeServer();

websocket.attach(app);
app.listen(3000);
