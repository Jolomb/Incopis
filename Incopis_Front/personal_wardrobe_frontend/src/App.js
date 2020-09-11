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

function BrandButton(props) {
    return (
        <div className="brand-button" onClick={props.onClick} title={props.brand_name}>
            {props.brand_name}
        </div>
    )
}

function BrandDetail(props) {
    if (props.current_brand === undefined) {
        return (
            <div>
                No brand selected!
            </div>
        );
    } else {
        return (
            <div>
                {props.current_brand.name}
            </div>
        );
    }
}

class BrandsListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brands: props.data,
            current_brand: undefined
        };
    }
    render() {
        const brands_list = this.state.brands;
        return (
            <div>
                <h1>My Brand list page!</h1>
                <div className="brand-list">
                    {brands_list.map( (brand, index) => {
                        return (
                            <BrandButton 
                                brand_name={brand.name} 
                                key={brand.id}
                                onClick={() => this.handleBrandClick(index)}
                            />
                        );
                    })}
                </div>
                <BrandDetail current_brand={brands_list[this.state.current_brand]}></BrandDetail>
            </div>
        );
    }

    handleBrandClick(index) {
        const new_current_brand = index;
        this.setState({
            brands: this.state.brands,
            current_brand: new_current_brand
        })
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