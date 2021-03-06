import React, { useState } from "react"
import {
    BrowserRouter as Router,
    Routes as Switch,
    Route,
    Link
} from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import AddReview from "./components/AddReview.js"
import Restaurant from "./components/Restaurant.js"
import RestaurantsList from "./components/RestaurantsList.js"
import Login from "./components/Login.js"
import ErrorPage from "./components/ErrorPage.js"

function App() {
    const [ user, setUser ] = useState(null)

    const login = async (user) => {
        setUser(user);
    }
    const logout = async (user) => {
        setUser(null);
    }

  return (
    <div className="App">
        <Router>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <span className="navbar-brand mb-0 h1" style={{"marginLeft":"20px"}}>Restaurant Reviews</span>
                <div className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to={"/restaurants"} className="nav-link">
                            Restaurants
                        </Link>
                    </li>
                    <li className="nav-item" style={{"cursor":"pointer"}}>
                        { user ? ( <a onClick={logout} className="nav-link">Logout {user.name}</a> ) :
                                ( <Link to="/login" className="nav-link">Login</Link> ) }
                    </li>
                </div>
            </nav>
            <div className="container mt-3">
                <Switch>
                    <Route exact path="/" element={<RestaurantsList/>}/>
                    <Route exact path="/restaurants" element={<RestaurantsList/>}/>
                    <Route
                        path="/restaurants/:id/review"
                        element={<AddReview  user={user}/>}
                    />
                    <Route
                        path="/restaurants/:id"
                        element={<Restaurant user={user}/>}
                    />
                    <Route
                        path="/login"
                        element={<Login login={login}/>}
                    />
                    <Route
                        path="/error"
                        element={<ErrorPage />}
                    />
                </Switch>
            </div>
        </Router>
    </div>
  );
}

export default App;
