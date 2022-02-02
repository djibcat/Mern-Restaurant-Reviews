import RestaurantsDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsController { // build up the Json returned by the api call getRestaurants defined in restaurantsDAO

    static async apiGetRestaurants (req, res, next) {
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 12 // number of restaurants per pages, default 20
        const page = req.query.page ? parseInt(req.query.page , 10) : 0

        let filters = {}

        if (req.query.cuisine) {
            filters.cuisine = req.query.cuisine
        } else if ( req.query.zipcode){
            filters.zipcode = req.query.zipcode
        } else if ( req.query.name){
            filters.name = req.query.name
        }

        const { restaurantList, totalNumberOfRestaurants } = await RestaurantsDAO.getRestaurants({
            filters,
            page,
            restaurantsPerPage,
        })

        let response = {
            restaurants : restaurantList,
            page : page,
            filters : filters,
            entries_per_page : restaurantsPerPage,
            total_results : totalNumberOfRestaurants
        }
        res.json(response)
    }

    static async apiGetRestaurantById (req, res, next) {
        try{
            let id = req.params.id || {}
            let restaurant = await RestaurantsDAO.getRestaurantById(id)

            if(!restaurant){
                res.status(404).json({ error : "Restaurant Not found in controller" })
                return
            }
            res.json(restaurant)
        }
        catch(e){
            res.status(500).json({ error : e})
        }
    }

    static async apiGetRestaurantByCuisines (req, res, next) {
        try {
            let cuisines = await RestaurantsDAO.getCuisines()
            res.json(cuisines)
        }
        catch(e){
            res.status(500).json({ error : e })
        }
    }
}