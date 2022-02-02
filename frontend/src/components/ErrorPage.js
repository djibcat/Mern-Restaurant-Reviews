import React from 'react';
import {Button} from "reactstrap"
import {useNavigate} from "react-router-dom";

const ErrorPage = () => {
    const navigate = useNavigate()

    const goHome = () => {
        navigate("/")
    }
    return(
        <div>
            <div className="page-wrap d-flex flex-row align-items-center mt-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-12 text-center">
                            <span className="display-1 d-block">404</span>
                            <div className="mb-4 lead">Oooops.. Something went wrong !</div>
                            <Button onClick={goHome}>Back to Home</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage