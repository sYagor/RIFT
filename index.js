var express = require('express');
var http = require('http');
var path = require('path');
var mysql = require('mysql');

var app = express();

//aceita requisicoes externas
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var con;

function hangleDisconnect() {
  con = mysql.createConnection({
    host: "sql10.freemysqlhosting.net", //endereço do 000webhost
    user: "sql10208513",
    password: "z3SyYGXSl5",
    database: "sql10208513"
  });

  con.connect(function (err) {
    if(err){
      console.log("error when connecting to db: ", err);
      setTimeout(hangleDisconnect, 2000);
    }
  });
  con.on('error', function (err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST'){
      hangleDisconnect();
    }else {
      throw err;
    }
  });
}

hangleDisconnect();

//ao acessar a pagina principal, redireciona para o site do jogo
app.get("/", function (req, res, next) {
  res.redirect("https://syagor.github.io/RIFT/");
});

//lista todos os jogadores
app.get('/players', function (req, res, next) {
  con.query("SELECT * FROM JOGADOR", function (err, result, fields) {
    if(err) throw err;
    //editar json para bater com o modelo
    //nao faço ideia de como =|
    res.json(result);
  });
});

//retorna jogador id = playerid
app.get('/player/:email', function (req, res, next) {
  var email = req.params.email;
  var sql = "SELECT * FROM JOGADOR WHERE EMAIL = '" + email + "'";
  con.query(sql, function (err, result, fields) {
    if(err) throw err
    res.json(result);
  });
});

//salva o jogador
app.post('/player/:name/:email', function (req, res, next) {
  var sql = "INSERT INTO JOGADOR (NOME, EMAIL) VALUES ('"+ req.params.name +"', '"+ req.params.email +"' )"
  con.query(sql, function (err, result) {
    if(err) throw err;
    console.log("1 record inserted");
    res.sendStatus(200)
  });
});

//lista os items
app.get("/items", function (req, res, next) {
  con.query("SELECT * FROM ITEM", function (err, result, fields) {
    if(err) throw err;
    res.json(result);
  });
});

//busca item por id
app.get("/item/:itemId", function (req, res, next) {
  var sql = "SELECT * FROM ITEM WHERE ID = " + req.params.itemId;
  con.query(sql,function (err, result) {
    if(err) throw err;
    res.json(result);
  });
});


// salva item no jogador
app.post('/player/:playerid/:itemid', function (req, res, next) {
  var idJogador = req.params.playerid;
  var idItem = req.params.itemid;
  var sql = "INSERT INTO JOGADOR_ITEM (ID_JOGADOR, ID_ITEM) VALUES (" + idItem + ", " + idJogador + ")";
  con.query(sql, function (err, resul) {
    if(err) throw err;
    console.log("An item was inserted into a player");
    res.sendStatus(200);
  });
});

app.get('/player/:id/items/', function (req, res, next) {
  var id = req.params.id;
  var sql = "SELECT  * FROM JOGADOR_ITEM WHERE ID_JOGADOR = " + id;
  con.query(sql, function (err, result) {
    if(err) throw err;
    res.json(result);
  });
});

// daki pra baixo é o sistema de ranking da demo
// lista jogadores da demo
app.get('/demo/players',function (req, res, next) {
  con.query("SELECT * FROM JOGADORDEMO", function (err, result, fields) {
    if(err) throw err;
    res.json(result);
  })
});

// salva jogador da demo
app.post('/demo/player/:nome/:score', function (req, res, next) {
  var nome = req.params.nome;
  var score = req.params.score;
  var sql ="INSERT INTO JOGADORDEMO (nome, score) VALUES ('"+nome+"', "+score+")";
  con.query(sql, function (err, result) {
    if(err) throw err;
    console.log("1 record inserted");
    res.sendStatus(200)
  });
});

//inicia a bagaça toda
app.listen(8080, function () {
  console.log('Executando!');
});
