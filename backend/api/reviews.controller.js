import ReviewsDAO from "../dao/reviewsDAO.js"

export default class ReviewsController {

    static async apiPostReview(req, res, next) {
        try { // get the info from the request body
            const restaurantId = req.body.restaurant_id
            const review = req.body.text
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }

            const date = new Date()

            const ReviewResponse = await ReviewsDAO.addReview(
                restaurantId,
                userInfo,
                review,
                date,
            )
            res.json({status: "success"})
        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id
            const text = req.body.text
            const date = new Date()

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                req.body.user_id, // to check if the user trying to update is the author of the review
                text,
                date,
            )
            let {error} = reviewResponse
            if (error) {
                res.status(500).json({error})
            }

            if (reviewResponse.modifiedCount === 0) {
                throw new Error("Unable to update review - user may not be OP")
            }

            res.json({status: "success"})
        } catch (e) {
            res.status(500).json({error: e.message})
        }
    }

    static async apiDeleteReview(req, res, next) {
        try{ // not suitable for proper production, authentification needed in real world
            const reviewId = req.body.id
            const userId = req.body.user_id

            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId,
            )
            console.log(`reviewId: ${reviewId} userId : ${userId}`)

            if(reviewId){
                res.json({status : " success"})
            } else {
                throw new Error(`Cannot find the reviews linked to this id`)
            }
        }catch(e){
            res.status(500).json({error: e.message})
        }
    }

}