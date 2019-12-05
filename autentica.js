const express = require('express');
const server = express();
var jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors =require('cors');
let user;

        const pool =  new Pool({
          user:'postgres',
          host: 'database-2.canjd3k93p3n.us-east-2.rds.amazonaws.com',
          database: 'Autenticacao',
          password: 'postgres',
          port: '5432',
  })
  server.use(cors());
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));



server.post('/autentica',function(req, res ){
    console.log(req.body);

    
    pool.query(`select empresa_id from empresas where email = '${req.body.email}' and senha = '${req.body.senha}'` 
    , (error, ret) => {
     if (error) {
      
      return res.status(401).json('Login inválido!')
     
     }
     console.log('tamanho do array de respostas'+ret.rows.__proto__.length)
     if(ret.rows.length == '0'){
       user = 'undefined'
     }else{
       console.log('entrou no else')
      user =   JSON.parse(JSON.stringify (ret.rows[0]));               //ret.rows[0] ;
     console.log('Esse é o usuario '+user)
     }
  
     if( user == 'undefined'  ){
      return res.status(401).json({error: 'user not found'})
      }
      console.log('passou')
      var id = user.empresa_id ;
      var token = jwt.sign({ id }, 'teste', {
        expiresIn: '7d' // expires in 5min
      });
      res.status(200).send({  token: token });
      
    })
  
  
  })

  server.listen(5000, function(){
    console.log('Servidor rodando na porta 7000.');
  });