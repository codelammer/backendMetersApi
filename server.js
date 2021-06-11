const express = require ('express');
const app = express();
const session = require('express-session');
const routes = require('./routes/route');
const path = require ('path');

app.use(express.json());

app.use(express.urlencoded({extended: true}));
const PORT = 4000 || process.env.PORT;

app.use(session({
    secret: 'jskjkfjs-sfjsjkskdf@3&*qw',
    resave: false,
    saveUninitialized: false
}));


app.use('/api', routes);


//start server and listen to port 3000/ or the port chosen by the server.
app.listen(PORT, ()=> {
    console.log(`server started successfully at port: ${PORT}`);
});
