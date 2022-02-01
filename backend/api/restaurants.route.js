import express from "express"
import RestaurantsController from "./restaurants.controller.js"
import ReviewsController from "./reviews.controller.js"

const router = express.Router() // give access to the router -- ALL ROUTE START WITH "/api/v1/restaurants" from server.js

router.route("/").get(RestaurantsController.apiGetRestaurants) // refer to server.js main route starting as "/api/v1/restaurants" -> root route http://localhost:5000/api/v1/restaurants/
router.route("/id/:id").get(RestaurantsController.apiGetRestaurantById) // get restaurant and associates reviews using the id of the restaurant
router.route("/cuisines").get(RestaurantsController.apiGetRestaurantByCuisines)

router
    .route("/review") // alternative route for the review -> http://localhost:5000/api/v1/restaurants/reviews
    .post(ReviewsController.apiPostReview) //post a review using ReviewController and apiPost
    .put(ReviewsController.apiUpdateReview) //modify a review using ReviewController and apiUpdate
    .delete(ReviewsController.apiDeleteReview) //post a review using ReviewController and apiDelete

export default router