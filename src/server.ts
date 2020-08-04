import express from 'express'

const app = express();
/*
||         HTTP METHODS           ||
||--------------------------------||
|| GET    : Buscar uma informação ||
|| POST   : Cria uma informação   ||
|| PUT    : Edita uma informação  ||
|| DELETE : Delete uma informação ||
*/
app.get('/user', (req, res) =>
{
    console.log("Yo!") // Show on console of server

    res.json({
        hello: "world" // Send to client
    })
})

app.listen(3333); // http://localhost:3333
