const express = require('express');
const mongodb = require('mongodb');
//const leaflet = require('leaflet');
//const bootstrap = require('bootstrap');
const port=3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/**
 * function which creates a Connection to MongoDB. Retries every 3 seconds if noc connection could be established.
 */
async function connectMongoDB() {
    try {
        //connect to database server
        app.locals.dbConnection = await mongodb.MongoClient.connect("mongodb://mongo:27017",
            { useNewUrlParser: true });
        //connect do database "itemdb"
        app.locals.db = await app.locals.dbConnection.db("itemdb");
        console.log("Using db: " + app.locals.db.databaseName);
    }
    catch (error) {
        console.dir(error)
        setTimeout(connectMongoDb, 3000)
    }
}
//Start connecting
connectMongoDB()

//use jquery
app.use('/node_modules', express.static(__dirname + '/node_modules'))

//Make all Files stored in Folder "public" accessible over localhost:3000/public
app.use('/public', express.static(__dirname + '/public'))


//Send index.html Mainpage to "/"
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html')
})
// Send point_editor Webpage to "/editor"
app.get('/editor', (req,res) => {
    res.sendFile(__dirname + '/public/oldwebsites/point_editor/point_editor.html')
})
//Send test.html Webpage to "/test"
app.get('/test', (req,res) => {
    res.sendFile(__dirname + '/public/test/test.html')
})
// //Get-Request to /hello will be answer with "Hello World"
// app.get('/hello', (req, res) => {
//     res.send('Hello World')
// })

//Returns all items stored in collection items
app.get("/item", (req,res) => {
    //Search for all items in mongodb
    app.locals.db.collection('items').find({}).toArray((error, result) => {
        if (error) {
            console.dir(error);
        }
        res.json(result);
    });
});


//Handler for Post requests to "/item"
app.post("/item", (req, res) => {
    // insert item
    console.log("insert item " + JSON.stringify(req.body));
    app.locals.db.collection('items').insertOne(req.body, (error, result) => {
        if (error) {
            console.dir(error);
        }
        res.json(result);
    });
});
//search function
app.get("/search",(req,res) => {
    //Search for one item in mongodb
    let id = req.query.id;

    console.log(req.query);
    app.locals.db.collection('items').find({_id:new mongodb.ObjectID(id)})
        .toArray((error,result)=>{
        if(error){
            console.dir(error);
        }
        res.json(result);
    });
});
//update function
app.put("/update", (req, res) => {
    // update item
    console.log("update item " + JSON.stringify(req.body));
    app.locals.db.collection('items').updateOne(
        { _id : new mongodb.ObjectID(req.body._id) },
        { $set:  {features : req.body.features}},

        (error, result) => {
        if (error) {
            console.dir(error);
        }
        res.json(result);
        });
});


// delete function
app.del("/delete", (req, res) => {
    // delete item
    console.log("delete item " + JSON.stringify(req.body));
    app.locals.db.collection('items').deleteOne(
        { _id : new mongodb.ObjectID(req.body._id) },
        (error, result) => {
            if (error) {
                console.dir(error);
            }
            res.json(result);
     });
});



// listen on port 3000
const server = app.listen(port,
    () => console.log(`Example app listening at http://localhost:${port}`)
)

//Delete items while closing server
process.on("SIGINT", () => {
    server.close();
    app.locals.db.collection('items').deleteMany({});
    app.locals.dbConnection.close();
    console.log("SIGINT");
    process.exit(0);
});
