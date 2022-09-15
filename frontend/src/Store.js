//react context needs a store
import { createContext, useReducer } from 'react';

export const Store = createContext();
//context is designed to share data tht can be considered GLOBAL for a tree of Reaact components
//It is used when some data needs to be accessible by many componentsat different nesting levels

const initialState = {
  //initialState is an object
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  cart: {
    //cart iteself is an object
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},

    // paymentMethod: localStorage.getItem('paymentMethod')
    //   ? localStorage.getItem('paymentMethod')
    //   : '',

    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems')) //converts string to json
      : [],
  },
};

function reducer(state, action) {
  //the first action we are implementing is add to cart
  switch (action.type) {
    case 'CART_ADD_ITEM':
      //add to cart

      const newItem = action.payload; //the item we need to add
      const existItem = state.cart.cartItems.find(
        //if an item exists or not
        (item) => item._id === newItem._id
      );
      const cartItems = existItem //if we already have this item in cart we need to use map
        ? state.cart.cartItems.map(
            (
              item //we use map function on cartItems to update
            ) => (item._id === existItem._id ? newItem : item) //current item with newItem thst we get from action.payload
          )
        : [...state.cart.cartItems, newItem]; //means a new item , we need to add newItem to array
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      //used to store in local storage so that on refresh items are present
      //first parameter is key and second is string value to save in this key in local storage
      return { ...state, cart: { ...state.cart, cartItems } };

    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    //keep previous state and update the userInfo based on the data we get from backend
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },
      };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        //we make change only in the cart and inside the cart only in shipping address
        //update shipping address with data from payload
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    default:
      return state;
  }
}

//StoreProvider is a wrapper for our react application and paas global props to children
//StoreProvider is a higher order function
export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch }; //value is defined as mix of state and dispatch
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
  //Store is coming from react Context
  //{value} is the value we defined earlier
  //value contains the current state in the context and the dispatch to update the state in the context
  //render {props.children}
}
