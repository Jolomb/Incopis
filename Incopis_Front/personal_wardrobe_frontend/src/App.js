import React, { Component } from 'react';
import clsx from 'clsx';
import { Route, Switch, Line} from "react-router-dom";
import { Query } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';

import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Fab from '@material-ui/core/Fab';
import Card from '@material-ui/core/Card';

import { BRAND_LIST_QUERY, ITEMS_BY_BRAND_QUERY } from "./query";

import "./App.css";
import { Drawer, Divider, Container, CssBaseline, Typography, withStyles } from '@material-ui/core';

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

const useStyles = makeStyles((theme) => ({
      root: {
    display: 'flex',
  },
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        marginLeft: 240,
        width: `calc(100% - 240px)`,
      },
      minHeight: {
          minHeight: 240,
      },
      container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
      },
      paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
      },
      drawerPaper: {
        whiteSpace: 'nowrap',
        marginTop: 95,
        width: 240,
        [theme.breakpoints.up('sm')]: {
            width: 240,
            flexShrink: 0,
          },
      },
      title: {
        flexGrow: 1,
      },
}));

function BrandButton(props) {
    const classes = useStyles();

    const StretchedButton = withStyles({
        root: {
            width: '100%',
            border: '2px solid',
            margin: '2px 0px',
            position: "relative",
            fontFamily: [
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
              ].join(','),
              "& .MuiButton-startIcon": {
                position: "absolute",
                left: 16
              }
        },
    })(Button);
    return (
            <StretchedButton 
                variant="contained" 
                color="secondary" 
                onClick={props.onClick} 
                startIcon={<DashboardIcon />}
                >
                    {props.brand_name}
            </StretchedButton>
    );
}

function BrandDetail(props) {
    const classes = useStyles();
    const { loading, data, error } = useQuery(ITEMS_BY_BRAND_QUERY, {variables: {'brandId': 
    props.current_brand.id}});

    if (loading) return <div>Loading!</div>;
    if (error) return <div>Error!</div>

    return (
        <div className={classes.content}>
            <Container
                maxWidth='lg'
                className={classes.container}
            >
                <Grid 
                    container 
                    spacing={3}
                    direction="row"
                    justify="center"
                    alignItems="flex-start"
                >
                    <Grid item xs={12} md={6} lg={6}>
                        <Card className={clsx(classes.minHeight, classes.paper)}>
                        <Typography component="h3" variant="h5" color="inherit" noWrap gutterBottom>
                            {props.current_brand.name}
                        </Typography>
                        <Divider/>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <Card className={clsx(classes.minHeight, classes.paper)}>
                        <Typography gutterBottom>
                            Price Range:
                        </Typography>
                        <Slider 
                            aria-labelledby="input-slider"
                        />
                        <Typography component="h3" variant="h5" color="inherit" noWrap gutterBottom>
                            List of items:
                        </Typography>
                        <Divider/>
                        <List>
                            {
                                data.itemsByBrand.map( item => {
                                    return (
                                        <Container>
                                        <ListItem>
                                            <Typography paragraph>
                                                {item.description}: {item.price}$
                                            </Typography>
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                        </Container>
                                    );
                                })
                            }
                        </List>    
                        </Card>
                    </Grid>
                    
                </Grid>
            </Container>
        </div>
    );
}

function BrandList(props) {
        const classes = useStyles();
        return (
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, classes.root),
                }}
            >
                <ButtonGroup
                    orientation="vertical"
                >
                    {props.brands_list.map( (brand, index) => {
                        return (
                            <BrandButton 
                                brand_name={brand.name} 
                                key={brand.id}
                                onClick={() => props.handle_click(index)}
                            />
                        );
                    })}
                </ButtonGroup>
                <Divider></Divider>
            </Drawer>
        )   
}

function Header(props){
    const classes = useStyles();
    return (
        <div>
        <Typography component="h1" variant="h3" noWrap >
            <Box className="header" color="text.secondary" bgcolor="info.main">My Brand list page</Box>
        </Typography>
        </div>
    );
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
        const FabDownRight = withStyles({
            root: {
                position: 'absolute',
                bottom: '12px',
                right: '12px',
            }
        })(Fab);

        if (this.state.current_brand === undefined){
            return (
                <div className="root">
                    <Header></Header>
                    <BrandList brands_list={brands_list} handle_click={index => this.handleBrandClick(index)}></BrandList>
                </div>
            );
        } else {
            return (
                <Box>
                    <Header></Header>
                    <BrandList brands_list={brands_list} handle_click={index => this.handleBrandClick(index)}></BrandList>
                    <BrandDetail current_brand={brands_list[this.state.current_brand]}></BrandDetail>
                    <FabDownRight color="secondary" aria-label="like">
                        <FavoriteIcon />
                    </FabDownRight>
                </Box>
            );
        }
        
    }

    handleBrandClick(index) {
        const new_current_brand = index;
        const brands = this.state.brands;
        this.setState({
            brands: brands,
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
        <div>
            <CssBaseline/>
            <BrandsListPage data={data.allBrands}></BrandsListPage>
        </div>
    )
}