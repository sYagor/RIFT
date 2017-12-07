var express = require('express');
var http = require('http');
var path = require('path');
var mysql = require('mysql');

var app = express();

// PARA ACEITAR RQUISIÇÕES EXTERNAS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var con;

// CONEXÃO COM SERVER MYSQL GRATIS POR 30 DIAS, MAS LENTO D+, O 000WEBHOST NAO FUNCIONOU COM HEROKU
function hangleDisconnect() {
  con = mysql.createConnection({
    host: "sql10.freemysqlhosting.net", // SERVER MYSQL 
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

// LISTA TODOS JOGADORES
app.get('/players', function (req, res, next) {
  con.query("SELECT * FROM JOGADOR", function (err, result, fields) {
    if(err) throw err;
    // FALTA FAZER PARSE DO JSON NA UNITY
    res.json(result);
  });
});

// RETORNA 1 JOGADOR PELO E-MAIL DE CADASTRO (STRING SALVA NO PREFS DA UNITY)
// É PRECISO FAZER O PARSE DO JSON PARA SALVAR OS DADOS LOCALMENTE E TER INFORMAÇÕES DE ACESSO
// LEMBRAR QUE NO CADASTRO EU NÃO SEI QUAL ID O JOGADOR TERÁ NA TABELA SQL, BEM MAIS COMPLICADO BUSCAR POR ID
app.get('/player/:email', function (req, res, next) {
  var email = req.params.email;
  var sql = "SELECT * FROM JOGADOR WHERE EMAIL = '" + email + "'";
  con.query(sql, function (err, result, fields) {
    if(err) throw err
    res.json(result);
  });
});

// REGISTRA UM NOVO JOGADOR NOVO COM NOME E E-MAIL, ATRIBUINDO UMA ID.
app.post("/player/:name/:email", function (req, res, next) {
  var sql = "INSERT INTO JOGADOR (NOME, EMAIL) VALUES ('"+ req.params.name +"', '"+ req.params.email +"' )"
  con.query(sql, function (err, result) {
    if(err) throw err;
    console.log("1 record inserted");
    res.sendStatus(200);
  });
});

//RETORNA UMA LISTA COM TODOS OS ITEMS DA TABELA
app.get("/items", function (req, res, next) {
  con.query("SELECT * FROM ITEM", function (err, result, fields) {
    if(err) throw err;
    res.json(result);
  });
});

// BUSCA UM ITEM DE ACORDO COM A ID
app.get("/item/:itemId", function (req, res, next) {
  var sql = "SELECT * FROM ITEM WHERE ID = " + req.params.itemId;
  con.query(sql,function (err, result) {
    if(err) throw err;
    res.json(result);
  });
});


// SALVA UM 1 ITEM NO JOGADOR
app.post("/add/:playerid/:itemid", function (req, res, next) {
  var idJogador = req.params.playerid;
  var idItem = req.params.itemid;
  // DESTROCAR PORQUE O JOGADOR ESTA SENDO SALVO NO ITEM
  var sql = "INSERT INTO JOGADOR_ITEM (ID_JOGADOR, ID_ITEM) VALUES (" + idItem + ", " + idJogador + ")";
  con.query(sql, function (err, resul) {
    if(err) throw err;
    console.log("An item was inserted into a player");
    res.sendStatus(200);
  });
});

// RETORNA TODOS OS ITEMS DE UM PLAYER ATRAVÉS DA ID DO MESMO
app.get('/player/:id/items/', function (req, res, next) {
  var id = req.params.id;
  var sql = "SELECT  * FROM JOGADOR_ITEM WHERE ID_JOGADOR = " + id;
  con.query(sql, function (err, result) {
    if(err) throw err;
    res.json(result);
  });
});

// RANKING DA DEMO DO SITE
// LISTA DE JOGADORES DA DEMO
app.get('/demo/players',function (req, res, next) {
  con.query("SELECT * FROM JOGADORDEMO", function (err, result, fields) {
    if(err) throw err;
    res.json(result);
  })
});

// SALVA JOGADOR E PONTUAÇÃO NA DEMO
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

// INICIA TUDO
app.listen(8080, function () {
  console.log('Executando!');
});
