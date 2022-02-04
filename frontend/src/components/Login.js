import React, { useState } from "react";
import {Form, FormGroup, Button, Label, Input, Container} from "reactstrap";
import { useNavigate } from "react-router-dom";

const  Login =  props => {
    const navigate = useNavigate();

    const [ user, setUser ] = useState (
        {
            name: "",
            id: ""
        }
    )

    const handleInputChange = e => {
        const { name, value } = e.target
        setUser({...user, [name] : value})
    }

    const toggleLogin = () => {
        props.login(user)
        navigate("/")
    }

    return (
        <Container className={"mt-5"}>
            <Form>
                <FormGroup>
                    <Label for="name">
                        Name
                    </Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        value={user.name}
                        onChange={e => handleInputChange(e)}
                    />

                </FormGroup>
                <FormGroup>
                    <Label for="id">
                        Password
                    </Label>
                    <Input
                        type="text"
                        id="id"
                        name="id"
                        value={user.id}
                        onChange={e => handleInputChange(e)}
                    />
                </FormGroup>
                <Button onClick={toggleLogin}>
                    Login
                </Button>
            </Form>
        </Container>
    )
}

export default Login