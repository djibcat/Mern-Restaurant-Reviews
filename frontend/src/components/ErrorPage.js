import React from 'react';

const ErrorPage = () => {
    return(
        <div>
            <div className="page-wrap d-flex flex-row align-items-center mt-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-12 text-center">
                            <span className="display-1 d-block">404</span>
                            <div className="mb-4 lead">Oooops.. Something went wrong !</div>
                            <a href="/" className="btn btn-link">Back to Home</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage