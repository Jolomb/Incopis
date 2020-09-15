import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { BrowserRouter } from "react-router-dom"
import ApolloClient from 'apollo-boost';
import { ApolloProvider, InMemoryCache } from '@apollo/react-hooks';

const apiclient = new ApolloClient({
    uri: 'http://127.0.0.1:8000/graphql/',
    cache: new InMemoryCache()
});

const Init = () => {
    return (
        <ApolloProvider client={apiclient}>
            <BrowserRouter>
                <App></App>
            </BrowserRouter>
        </ApolloProvider>
    )
}

ReactDOM.render( <Init></Init>, document.getElementById('root'))