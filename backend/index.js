import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import RestaurantsDAO from "./dao/restaurantsDAO.js"
import ReviewsDAO from "./dao/reviewsDAO.js"

dotenv.config() // allow to use the dotenv file
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect( // connect to database with parameters listed in the dotenv file as connect.options
    process.env.RESTREVIEW_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    }
)
    .catch( err => {
        console.log(err)
        process.exit(1) //code 1 : failed for any reason
    })
    .then( async client => { //once the connection is made, starting webserver on port
        await RestaurantsDAO.injectDB(client)
        await ReviewsDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })