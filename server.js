'use strict';

const PORT = process.env.PORT || 3000;

const express = require('express');

const superagent = require('superagent');

const app = express();

app.use(express.static('./public')); //for the purposes of our site, public is the root folder

app.use(express.urlencoded({extended:true}));

app.set('view-engine', 'ejs');

app.get('/', (request, response)=>{
  response.render('pages/index.ejs');
});
// below test renders page 
app.get('/test', (request, response)=>{
    response.render('pages/index.ejs');
  });

app.listen(PORT, ()=> {console.log(`App is up on PORT ${PORT}`)});

