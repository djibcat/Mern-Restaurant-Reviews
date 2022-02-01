import mongodb from "mongodb"
import dotenv from "dotenv";
dotenv.config()
const ObjectId = mongodb.ObjectId // used to convert a string to Mongodb Object id

let reviews

export default class ReviewsDAO {

    static async injectDB(conn) {
        if(reviews){
            return
        }
        try{
            reviews = await conn.db(process.env.RESTREVIEW_NAMESPACE).collection("reviews")
        }
        catch(e){
            console.error(`Unable to establish collection handles in userDAO : ${e}`)
        }
    }

    static async addReview(restaurantID, user, review, date) {
        try{
            const reviewDoc = {
                name : user.name,
                user_id : user._id,
                text : review,
                restaurant_id : ObjectId(restaurantID),
                date : date
            }
            return await reviews.insertOne(reviewDoc)
        }
        catch(e){
            console.error(`Unable to post review : ${e}`)
            return {error: e}
        }
    }

    static async updateReview (reviewId, userId, text, date){
        try{
            const updateResponse = await reviews.updateOne(
                { user_id: userId, _id: ObjectId(reviewId)}, // check if the review is the good one ( good id ) with the good author ( user_id )
                { $set: {text : text, date : date } }
            )
            return updateResponse
        }
        catch(e){
            console.error(`Unable to update review : ${e}`)
            return {error: e}
        }
    }

    static async deleteReview (reviewId, userId) {
        try{
            const deleteResponse = await reviews.deleteOne({
                _id: ObjectId(reviewId),
                user_id: userId,
            })
            return deleteResponse
        }
        catch(e){
            console.error(`Unable to delete review : ${e}`)
            return {error: e}
        }
    }
}