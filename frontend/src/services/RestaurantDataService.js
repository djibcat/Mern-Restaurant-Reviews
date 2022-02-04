import http from "../http-common.js"

class RestaurantDataService {

    getAllRestaurants(page = 0){
        return http.get(`?page=${page}`);
    }

    getById(id){
        return http.get(`/id/${id}`)
    }

    find(query, by = "name", page= 0){
        return http.get(`?${by}=${query}&page=${page}`) // look like restaurants?name=theRestaurantName&page=2
    }

    createReview(data){
        return http.post("/review",data)
    }

    updateReview(data) {
        return http.put("/review", data)
    }

    deleteReview(review_id, user_id){
        return http.delete(`/review?id=${review_id}`, {data:{_id:review_id,user_id : user_id}})
    }

    getAllCuisines(id){
        return http.get("/cuisines")
    }
}

export default new RestaurantDataService();