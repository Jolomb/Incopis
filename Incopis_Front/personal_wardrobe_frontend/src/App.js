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

class BrandsListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brands: props.data
        };
    }
    render() {
        const brands_list = this.state.brands;
        return (
            <div className="brand-list">
                {brands_list.map( brand => {
                    return (
                        <li>A Brand by the name: {brand.name}</li>
                    );
                })}
            </div>
        );
    }
}

const MainPage = (props) => {
    const { loading, data, error } = useQuery(BRAND_LIST_QUERY);
    if (loading) return <div>Loading!</div>;
    if (error) return <div>Error!</div>;
    if (!data) return <div>Not Found!</div>;

    return (
        <div className="main-page">
            <BrandsListPage data={data.brands}></BrandsListPage>
        </div>
    )
}