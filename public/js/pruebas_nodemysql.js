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

