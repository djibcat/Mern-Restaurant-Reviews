import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/RestaurantDataService";
import { Link, useParams, useLocation } from "react-router-dom";
import { Container, Button, Form, FormGroup, Label, Input } from "reactstrap";

const AddReview = props => {
    const [ newReview, setNewReview ] = useState("");
    const [ isSubmitted, setIsSubmitted ] = useState(false);
    const [ isEditing, setIsEditing ] = useState(false);
    const location = useLocation()
    let { id } = useParams();

    useEffect( () => {
        if( location.state && location.state.currentReview ){
            setIsEditing(true);
            setNewReview(location.state.currentReview.text)
        }
    },[])


    const handleInputChange = e => {
        setNewReview(e.target.value);
    }

    const saveReview = async () => {
        let data = {
            text: newReview,
            name : props.user.name,
            user_id: props.user.id,
            restaurant_id: id
        };
        if ( isEditing ) {
            data.review_id = location.state.currentReview._id
            try {
                const response = await RestaurantDataService.updateReview(data)
                response && setIsSubmitted(true)
            }
            catch(e) {
                console.log(e)
            }
        } else {
            try{
                const response = await RestaurantDataService.createReview(data)
                response && setIsSubmitted(true)
            }
            catch(e){
                console.log(e)
            }
        }
    }
    
    return(
        <>
            {props.user ? (
                <Container>
                    {isSubmitted ? (
                        <div>
                            <h4>You submitted successfully!</h4>
                            <Button><Link to={`/restaurants/${id}`}>Back to the restaurant</Link></Button>
                        </div>)
                        : (
                            <div>
                                <Form>
                                    <FormGroup>
                                        <Label>
                                            <h4>
                                                { isEditing ? "Edit " : "Create "}a Review
                                            </h4>
                                        </Label>
                                        <Input
                                            required
                                            type="textarea"
                                            id="text"
                                            name="text"
                                            value={newReview}
                                            onChange={handleInputChange}
                                            className={"mb-4"}>
                                        </Input>
                                        <Button onClick={saveReview}>Submit</Button>
                                    </FormGroup>
                                </Form>
                            </div>
                        )}
                </Container>)
                :(
                    <div>
                        <h4>Please login</h4>
                        <Button><Link to={"/login"}>Login</Link></Button>
                    </div>)}
        </>
    )
}

export default AddReview