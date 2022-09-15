import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger'; //used to log state changes between dispatching actions
//import data from '../data';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  //current state, action that change the state and create new state
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    //loading is a state , ...state return previous state values
    //loading is true so that we can show a loading box in UI and we have kept prvious state values
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    //previous values are kept in the state and only update products = data coming from the action
    //data is present in action.payload ,ie, all data from backend is in action.payload
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    //fill error with the error that comes from backend
    default:
      return state;
  }
};

export default function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    //logger is used to log state changes between dispatching actions
    // we call dispatch to call an action and update the state
    //the following is the default state
    products: [],
    loading: true,
    //true because at the beginning of rendering this component products will be fetched from backend
    //so a Loading box needs to be shown
    error: '',
  });
  //first parameter is an object and second parameter is disptch it is used to call an action and
  //update the state
  //const [products, setProducts] = useState([]);
  //useState allows to track state, state refers to data or properties that need tracking
  //here products is a variable ,ie, current state and setProducts is a function that can update this state
  //we have used destructuring . The initial state is empty array as indicated inside useState([]) function
  //We can now include our state anywhere in our component.
  //useState returns an array that contains a variable and function to update that variable

  useEffect(() => {
    const fetchData = async () => {
      //before AJAX request we need to set loading to true
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products'); //this will give all products from backend, its AJAX  request
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
        //err.message returns the error in javascript
      }
      //try catch is used to get error from AJAX requests
      //setProducts(result.data); //result.data is product in the backend
      //async function returs a promise which can be pending, fulfilled, rejected
      //await makes a function wait for a promise
      //axios.get sends a AJAX request to the following address and puts the result in result variable
      //AJAX request allows to read data from web server
    };
    fetchData(); //calling the defined function
  }, []);
  //useEffect() lets you perform side effects whenever something happens
  //it runs every time our app location renders
  //second parameter it takes is a dependency list , whenever they change useEffect will run
  //the dependency array is empty because we will run the function inside useEffect only one time after
  //rendering this component
  //we call an api and get products from backend

  return (
    <div>
      <Helmet>
        <title>Dairy Farm</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {
          //INSIDE PRODUCTS DIV WE HAVE PRODUCT
          //SINCE WE ARE INSIDE DIV WE HAVE USED CURLY BRACES
          //convert each product to a JSX . map calls for each element
          //and creates a new array by applying func on it once
          //we are writing jsx which allows to write html in js
          //map function maps custom pieces of data to each of the custom components
          //template literals allow variables and expression in strings
          //NOW we are doing conditional rendering
          loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Row>
              {/*following line is a JSX expression */}
              {products.map(
                (
                  product //here product acts like an iterator
                ) => (
                  <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                    {/*each child should have unique key */}
                    {/*mb-3 creates space between items vertically */}
                    {/*small screen -> 2 products, medium-> 3, large->4 */}
                    <Product product={product}></Product>
                    {/*Product is the component, product is the attribute, {product} is the product 
                    we are getting from map*/}
                  </Col>
                )
              )}
            </Row>
          )
        }
      </div>
    </div>
  );
}
