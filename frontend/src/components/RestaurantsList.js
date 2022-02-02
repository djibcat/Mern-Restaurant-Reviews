import React, { useEffect, useState } from "react";
import RestaurantDataService from "../services/RestaurantDataService.js"
import { Link, useNavigate } from "react-router-dom"

const  RestaurantList = props => {

    let navigate = useNavigate()
    const [ restaurants, setRestaurants ] = useState([]);
    const [ searchName, setSearchName ] = useState("");
    const [ searchZip, setSearchZip ] = useState("");
    const [ searchCuisine, setSearchCuisine ] = useState("");
    const [ cuisines, setCuisines ] = useState(["All Cuisines"]);

    useEffect(async () =>{
        await retrieveRestaurants();
        await retrieveCuisines()
    }, [])

    const retrieveRestaurants = async () => {
        try{
            const response = await RestaurantDataService.getAllRestaurants()
            response && console.log(response.data.restaurants)
            response && setRestaurants(response.data.restaurants)
        }catch(e){
            console.error(`Something went wrong while retrieving restaurants : ${e} `)
            //navigate("/error")
        }

    }
    const retrieveCuisines = async() => {
        try{
            const response = await RestaurantDataService.getAllCuisines()
            response && console.log(response.data)
            response && setCuisines(["All Cuisines"].concat(response.data))
        }
        catch(e){
            console.error(`Something went wrong while retrieving cuisines : ${e} `)
            //navigate("/error")
        }
    }

    const refreshList = async () => {
        await retrieveRestaurants();
    }

    const onChangeSearchName = e => {
        const inputName = e.target.value;
        setSearchName(inputName);
    }

    const onChangeSearchZip = e => {
        const inputZipCode = e.target.value;
        setSearchZip(inputZipCode)
    }

    const onChangeSearchCuisine = e => {
        const inputCuisine = e.target.value;
        setSearchCuisine(inputCuisine)
    }

    const search = async ( query, by ) => {
        try{
            const response = await RestaurantDataService.find(query, by);
            response && console.log(response.data)
            response && setRestaurants(response.data.restaurants)
        }
        catch(e){
            console.error(`Something went wrong while searching for restaurant : ${e} `)
            //navigate("/error")
        }
    }

    const searchByName = async () => {
        await search(searchName, "name")
    }

    const findByZip = async () => {
        await search(searchZip, "zipcode")
    }


    return(
        <div>
            Restaurant List
        </div>
    )
}

export default RestaurantList