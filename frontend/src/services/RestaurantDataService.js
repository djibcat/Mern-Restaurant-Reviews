import http from "../http-common"

class RestaurantDataService {

    getAllRestaurants(page = 0){
        return http.get(`$page=${page}`);
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

    deleteReview(id){
        return http.delete(`/review?id=${id}`)
    }

    getAllCuisines(id){
        return http.get("/cuisines")
    }
}

export default new RestaurantDataService();