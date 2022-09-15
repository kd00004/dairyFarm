import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation(); //its a hook that returns object from current URL
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  //
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState(''); //default value is empty string
  const [password, setPassword] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault(); //to prevent refreshing the page when user clicks on signin button
    try {
      //we are going to send an AJAX request to backend
      const { data } = await Axios.post('/api/users/signin', {
        //this is body of request
        email, //email and password are sent to the api as a post request
        password, //we get a response and extract data from that response
        //email and password are states we use useState to define them
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data }); //payload is data we get from backend
      localStorage.setItem('userInfo', JSON.stringify(data)); //(key, data) pair
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]); //dependency array

  return (
    // we create a container to make the sign in form
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>{' '}
      {/* my-3 means margin from top and bottom is 3 rem*/}
      <Form onSubmit={submitHandler}>
        {' '}
        {/*define submitHandler as an async function */}
        <Form.Group className="mb-3" controlId="email">
          {/*we use form group to put label and input box next to each other */}
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />{' '}
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Sign In</Button>
        </div>
        <div className="mb-3">
          New customer? {/*if  customer is new */}
          {/*and if new we will redirect user to the sign up page and set query string for
          redirect to the redirect variable that we are going to fetch from URL*/}
          <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
        </div>
      </Form>
    </Container>
  );
}
