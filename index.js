var express = require('express');
var http = require('http');
var path = require('path');
var mysql = require('mysql');
var app = express();

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
  })
}

hangleDisconnect();

//lista todos os jogadores
app.get('/players', function (req, res) {
  con.query("SELECT * FROM JOGADOR", function (err, result, fields) {
    if(err) throw err;
    //editar json para bater com o modelo
    //nao faço ideia de como =|
    res.json(result);
  });
});

//retorna jogador id = playerid
app.get('/player/:playerid', function (req, res) {
  var id = req.params.playerid;
  var sql = "SELECT * FROM JOGADOR WHERE id = " + id;
  con.query(sql, function (err, result, fields) {
    if(err) throw err
    res.json(result);
  })
});

//salva o jogador
app.put('/player/:name/:email', function (req, res) {
  var sql = "INSERT INTO JOGADOR (NOME, EMAIL) VALUES ('"+ req.params.name +"', '"+ req.params.email +"' )"
  con.query(sql, function (err, result) {
    if(err) throw err;
    console.log("1 record inserted");
  });
  res.send('salva usuario');
});

//lista os items
app.get("/items", function (req, res) {
  con.query("SELECT * FROM ITEM", function (err, result, fields) {
    if(err) throw err;
    res.json(result);
  });
});

//busca item por id
app.get("/item/:itemId", function (req, res) {
  var sql = "SELECT * FROM ITEM WHERE ID = " + req.params.itemId;
  con.query(sql,function (err, result) {
    if(err) throw err;
    res.json(result);
  });
});


// salva item no jogador
app.put('/player/:playerid/:itemid', function (req, res) {
  var idJogador = req.params.playerid;
  var idItem = req.params.itemid;
  var sql = "INSERT INTO JOGADOR_ITEM (ID_JOGADOR, ID_ITEM) VALUES (" + idItem + ", " + idJogador + ")";
  con.query(sql, function (err, resul) {
    if(err) throw err;
    console.log("An item was inserted into a player");
  })
});


// daki pra baixo é o sistema de ranking da demo
// lista jogadores da demo
app.get('/demo/players',function (req, res) {
  con.query("SELECT * FROM JOGADORDEMO", function (err, result, fields) {
    if(err) throw err;
    res.json(result);
  })
});

// salva jogador da demo
app.get('/demo/player/:nome/:score', function (req, res) {
  var nome = req.params.nome;
  var score = req.params.score;
  var sql ="INSERT INTO JOGADORDEMO (nome, score) VALUES ('"+nome+"', "+score+")";
  con.query(sql, function (err, result) {
    if(err) throw err;
    console.log("1 record inserted");
  })
});

//inicia a bagaça toda
app.listen(8080, function () {
  console.log('Running!');
});
