import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/RestaurantDataService";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Card, Button, CardTitle, CardText, Container } from "reactstrap"
import moment from 'moment';
moment().format();

const  Restaurant = ( props ) => {
    const [ restaurant, setRestaurant ] = useState({
        id: null,
        name: "",
        address: {},
        cuisine: "",
        reviews: []
    })

    let {id} = useParams()
    useEffect(() => {
        (async function fetchData () {
            await getRestaurant(id)
        })()
    }, [id])

    let navigate = useNavigate();
    const redirectOnError = () => {
        navigate("/error");
    };

    const getRestaurant = async (id) => {
        try{
            const response =  await RestaurantDataService.getById(id)
            response && setRestaurant(response.data)
        }
        catch(e){
            console.log(e)
            redirectOnError()
        }
    }

    const deleteReview = async (reviewId, userId,index) => {
        try{
            const response = await RestaurantDataService.deleteReview( reviewId, userId )
            response && setRestaurant((prevState) => {
                prevState.reviews.splice( index,1 )
                return({
                    ...prevState
                })
            })
        } catch(e){
            console.log(e)
            redirectOnError()
        }
    }

    const redirectToAddReview = (reviewId) => {
        navigate(`/restaurants/${reviewId}/review`)
    }

    return (
        <>
            {restaurant ? (
                <div>
                    <Container className={"text-center my-5"}>
                        <h5>{restaurant.name}</h5>
                        <p>
                            Cuisine: {restaurant.cuisine}<br/>
                            Address: {restaurant.address.street}{" "}{restaurant.address.building}{" "}{restaurant.borough}
                        </p>
                        <Button onClick={() => redirectToAddReview(id)}> Add Review</Button>
                    </Container>

                    <h4 className={"my-4"}> Reviews </h4>
                    {restaurant.reviews.length > 0 ? (
                        restaurant.reviews.map( (review, index) => {
                            return(
                                <Card key={index} className={"my-3"}>
                                    <CardTitle tag="h6">
                                        By {review.name}{" "}On {moment(review.date).format('MMMM Do YYYY, h:mm')}
                                    </CardTitle>
                                    <CardText>
                                        {review.text}
                                    </CardText>
                                    { props.user && props.user.id === review.user_id &&
                                        <div>
                                            <Link to={`/restaurants/${id}/review`} state={{currentReview: review}}
                                                  style={{marginRight:"0.5rem"}}>
                                                <Button size={"sm"} onClick={()=>console.log(review._id)}>Edit</Button>
                                            </Link>
                                            <Button onClick={() => deleteReview(review._id, props.user.id, index)} size={"sm"}>Delete</Button>
                                        </div>
                                    }
                                </Card>
                            )
                        })
                    ) : (<div>
                            <Card body>
                                <CardText>
                                    No Reviews yet
                                </CardText>
                            </Card>
                        </div>)}
                </div>
            ):(<div>
                    <Card body>
                        <CardText>
                            No Restaurant Selected
                        </CardText>
                    </Card>
                </div>)
            }
        </>
    )
}

export default Restaurant