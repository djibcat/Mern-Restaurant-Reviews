import mongodb from "mongodb"
import dotenv from "dotenv"
dotenv.config()

const ObjectId = mongodb.ObjectId // used to convert a string to Mongodb Object id

let restaurants // store reference to database

export default class RestaurantsDAO {

    static async injectDB(conn) { // initial connection to database as soon as the server start to get a reference to the restaurant database/collection
        if(restaurants) { // if already filled with a reference, do nothing
            return
        }
        try {
            restaurants = await conn.db(process.env.RESTREVIEW_NAMESPACE).collection("restaurants") // store the reference into the variable
        }
        catch(e){
            console.error(
                `Can't access collection in restaurantsDAO: ${e}`
            )
        }
    }

    static async getRestaurants ({ // get the restaurants in database with 3 options
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
        } = {} ){

        let query; //empty at the start, may be filed with some filters to get only what the user request to sort the data

        if (filters) { //building query with the filters
            if("name" in filters) {                                     // search by name -> need to create index in mongodb Atlas to make it work { name : text }
                query = {$text: {$search: filters["name"]}}             //text search need to allow us to compare the name used by the user and what we have in the db
            } else if ("cuisine" in filters){                           // search by cuisine
                query =  {"cuisine": { $eq: filters["cuisine"]}}        // IF the "cuisine" in the database = cuisine input by user
            }else if ("zipcode" in filters){                            // search by zipcode
                query = {"address.zipcode":{$eq : filters["zipcode"]}}
            }
        }

        let cursor; // empty at initialisation, host the result of the query

        try{
            cursor = await restaurants.find(query) // if there is no filters, query is empty, so all the restaurants are returned
        } catch (e) {
            console.error(`Unable to issue find command : ${e}`)
            return { restaurantList: [], totalNumberOfRestaurants: 0}
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page) // clarify

        try{
            const restaurantList = await displayCursor.toArray() // get the list of document to an array
            const totalNumberOfRestaurants = await restaurants.countDocuments(query) // count the documents returned by the query

            return { restaurantList, totalNumberOfRestaurants }
        } catch(e){
            console.error(`Unable to convert cursor to array or problem counting documents : ${e}`)
            return {restaurantList: [], totalNumbersOfRestaurants : 0}
        }
    }

    static async getRestaurantById (id) {

        try{
            const pipeline = [
                {
                    $match: { // get the restaurant associated with this specific id
                        _id: new ObjectId(id),
                    }
                },
                {
                    $lookup: { // check if it match any reviews
                        from: "reviews",
                        let: {
                            id: "$_id"
                        },
                        pipeline: [
                            {
                                $match: { // get the restaurants that match the id + the related reviews -> all the reviews that match restaurant id
                                    $expr: {
                                        $eq: ["$restaurant_id", "$$id"],
                                    }
                                }
                            },
                            {
                                $sort: { // sort them to get the latest review
                                    date: -1
                                }
                            }
                        ],
                        as: "reviews"
                    }
                },
                {
                    $addFields: { // add a review field on the restaurant
                        reviews: "$reviews"
                    }
                }
            ]
            return await restaurants.aggregate(pipeline).next()
        }
        catch (e){
            console.error(`Unable to get item with the given id while performing the getRestaurantById method in DAO : ${e}`)
            return {restaurantList: [], totalNumbersOfRestaurants : 0}
        }
    }

    static async getCuisines () { // will be used to populate the frontend dropdown that allow user to sort by cuisines
        let cuisines = []
        try {
            cuisines = await restaurants.distinct("cuisine") // prevent getting double results
            return cuisines
        }
        catch (e){
            console.error(`Unable to get cuisines, ${e}`)
        }
    }
}
