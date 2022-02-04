import React, { useEffect, useState } from "react";
import RestaurantDataService from "../services/RestaurantDataService.js"
import { useNavigate } from "react-router-dom"
import {Row, Col, Form, Input, Label, Button, InputGroup, Card, CardBody, CardTitle, CardSubtitle, CardGroup} from "reactstrap"

const  RestaurantList = props => {
    let navigate = useNavigate();

    const [restaurants, setRestaurants] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchZip, setSearchZip] = useState("");
    const [searchCuisine, setSearchCuisine] = useState("");
    const [cuisines, setCuisines] = useState(["All Cuisines"]);
    const [selectedCuisine, setSelectedCuisine] = useState("");

    const redirectOnError = () => {
        navigate("/error");
    };

    useEffect( () => {
        (async function fetchData ()  {
            await retrieveRestaurants();
            await retrieveCuisines();
        })()                            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const retrieveRestaurants = async () => {
        try {
            const response = await RestaurantDataService.getAllRestaurants();
            response && setRestaurants(response.data.restaurants);
        } catch (e) {
            console.error(`Something went wrong while retrieving restaurants : ${e} `)
            redirectOnError()
        }
    };
    const retrieveCuisines = async () => {
        try {
            const response = await RestaurantDataService.getAllCuisines();
            response && setCuisines(["All Cuisines"].concat(response.data));
        } catch (e) {
            console.error(`Something went wrong while retrieving cuisines : ${e} `)
            redirectOnError()
        }
    };

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
        setSelectedCuisine(e.target.value)
        const inputCuisine = e.target.value;
        setSearchCuisine(inputCuisine)
    }

    const search = async (query, by) => {
        try {
            const response = await RestaurantDataService.find(query, by);
            response && setRestaurants(response.data.restaurants)
        } catch (e) {
            console.error(`Something went wrong while searching for restaurant : ${e} `)
            redirectOnError()
        }
    }

    const searchByName = async () => {
        await search(searchName, "name")
    }

    const searchByZip = async () => {
        await search(searchZip, "zipcode")
    }

    const searchByCuisine = async () => {
        if (searchCuisine === "All Cuisines") {
            await refreshList()
        } else {
            await search(searchCuisine, "cuisine")
        }
    }

    const handleRestaurantReviewClick = (restaurantId) => {
        if (restaurantId) {
            navigate(`/restaurants/${restaurantId}`)
        } else return
    }

    return (
        <>
            <Form>
                <Row>
                    <Col>
                        <Label>Search by name</Label>
                        <InputGroup>
                            <Input
                                name="name"
                                type="text"
                                placeholder="Pizza Mama"
                                value={searchName}
                                onChange={onChangeSearchName}
                            />
                            <Button onClick={searchByName}>
                                Search
                            </Button>
                        </InputGroup>
                    </Col>
                    <Col>
                        <Label>Search by zipcode</Label>
                        <InputGroup>
                            <Input
                                name="zipcode"
                                type="number"
                                placeholder="11234"
                                value={searchZip}
                                onChange={onChangeSearchZip}
                            />
                            <Button onClick={searchByZip}>
                                Search
                            </Button>
                        </InputGroup>
                    </Col>

                    <Col>
                        <Label>Search by type of Cuisines</Label>
                        <InputGroup>
                            <Input
                                name="cuisines"
                                type="select"
                                placeholder="Italian"
                                value={selectedCuisine}
                                onChange={onChangeSearchCuisine}>
                                {cuisines && cuisines.map((cuisine, index) => (
                                    <option value={cuisine} key={index}>{cuisine.substr(0, 20)}</option>
                                ))}
                            </Input>

                            <Button onClick={searchByCuisine}>
                                Search
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
            </Form>

            <Row className="mt-5">
                {
                    restaurants && restaurants.map((restaurant, index) => {
                        const address = `${restaurant.address.building} ${restaurant.address.street} ${restaurant.address.zipcode} ${restaurant.borough}`
                        return (
                            <Col key={index}>
                                <CardGroup>
                                <Card  style={{width:"20rem", height:"15rem"}} className={"mb-5"}>
                                    <CardBody>
                                        <CardTitle tag="h5" className={"mb-5"}>
                                            {restaurant.name}
                                        </CardTitle>
                                        <CardSubtitle
                                            className="text-muted mb-4"
                                            tag="h6"
                                        >
                                            <p>
                                                <u>Cuisine</u> : {restaurant.cuisine}
                                            </p>
                                            <p>
                                                <u>Address</u> : {address}
                                            </p>

                                        </CardSubtitle>
                                        <div className={"mt-5"}>
                                            <Button onClick={() => handleRestaurantReviewClick(restaurant._id)} style={{marginRight:"1rem"}}>
                                                Reviews
                                            </Button>
                                            <Button className="ml-2" onClick={() => window.open(`https://www.google.com/maps/place/${address}`)}>
                                                View map
                                            </Button>
                                        </div>

                                    </CardBody>
                                </Card>
                                </CardGroup>
                            </Col>
                        )
                    })
                }
            </Row>
        </>
    )
}
export default RestaurantList