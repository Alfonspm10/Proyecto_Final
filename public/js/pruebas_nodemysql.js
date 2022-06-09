var crypto = require('crypto');
var mysql = require('mysql');

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');




var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "krono",
  database: "balumba"
});



function imprimeUsuarios(result)
{
    function imprimeUsuario(u)
    {
        console.log(`UsuSaurios: ${u.username} -- ${u.hash}`)
    }

    for (i in result)
    {
        imprimeUsuario(result[i]);
    }
}





con.connect(function(err) {
  if (err) throw err;


    var newUser = {
        username: 'usuarioSecurisado',
        pass: '1234',
        salt: crypto.randomBytes(22).toString("hex"),
    }

    var queryIns = `
    INSERT INTO usuarios
    (username, hash, salt)
    VALUES
    (
        '${newUser.username}',
        '${crypto.createHash('sha256').update(newUser.pass + newUser.salt).digest('hex')}',
        '${newUser.salt}'
    );`;


  con.query(queryIns, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });

  var querySel = "SELECT * FROM balumba.usuarios;";

  con.query(querySel, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    imprimeUsuarios(result)
  });


});






/*
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
*/
