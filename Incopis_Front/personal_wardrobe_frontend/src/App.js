import React, { Component } from 'react';
import { Route, Switch, Line} from "react-router-dom";
import { Query } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';

import { BRAND_LIST_QUERY } from "./query";

import "./App.css";

const App = () => {
    return (
        <div className="App">
            <Switch>
                <Route exact path="/" component={MainPage}></Route>
            </Switch>
        </div>
    )
}
export default App

class BrandsList extends Component {

    render() {
        return (
         <Query query={BRAND_LIST_QUERY}>
             {({ loading, error, data }) => {
                if (!loading) return <div>Loading!</div>
                if (error) return <div>Error!</div>

                const brands = data.brands_list;
                return (
                    <div className="brands-list">
                        {brands.map( brand => {
                            <li>Barnd: {brand.name}</li>
                        }
                        )}
                    </div>
                )
             }
             }
         </Query>  
        )
    }
}

const MainPage = (props) => {

    return (
        <div className="main-page">
            <BrandsList></BrandsList>
        </div>
    )
}