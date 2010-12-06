var express = require('express');

var app = express.createServer();

var users = [{ name: "alan" }];

app.configure(function(){
	app.use(express.staticProvider(__dirname + '/public'));
	app.use(express.bodyDecoder());
    app.use(express.logger({format: ':method:uri'}));
    app.set('view engine', 'ejs');
  //  app.register(".html", require('ejs'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true}));
});

function loadUser(req, res, next){
  var user = users[req.params.id -1];
  if(user){
    req.user = user;
    next();
  }else{
    next(new Error('Failed to load user ' + req.params.id));
  }
}

app.get('/', function(req, res){
	res.send('hello world');
});

app.get("/user/new", function(req, res){
    res.render('user_new');
});

app.post("/user", function(req, res){
    console.log(req.body);
    index = users.push({name: req.body.user.name});
    res.redirect("/user/" + index);
});


app.get("/user/:id?", loadUser, function(req, res){
    res.render('hello_user', {
      locals: {user: req.user}
    });
});

app.post("/json_request", function(req, res){
	res.send(req.body);
});

app.listen(3000);
