import express from 'express'

const app = express();
app.use(express.json())

/*
||--------------------------------||
||         HTTP METHODS           ||
||--------------------------------||
|| GET    : Buscar uma informação ||
|| POST   : Cria uma informação   ||
|| PUT    : Edita uma informação  ||
|| DELETE : Delete uma informação ||
||--------------------------------||
*/



/*
||--------------------------------------------------------------------------||
|| Request Body => dados para criação ou atualização de registros           ||
|| Route Params => Identificar qual recurso eu quero atualizar ou deletar   ||
|| Query Params => Paginação, filtros e ordenação                           ||
||--------------------------------------------------------------------------||
*/
app.get('/user', (req, res) =>
{
    console.log("Yo!") // Show on console of server

    res.json({
        hello: "world" // Send to client
    })
})

app.listen(3333); // http://localhost:3333
