import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../actions/cartActions';


function ShippingScreen({ history }) {

    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;

    const dispatch = useDispatch();

    const [address, setAddress] = useState(shippingAddress.shippingAddressFromStorage.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const [country, setCountry] = useState(shippingAddress.country);
    console.log(shippingAddress.address);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({address, city, postalCode, country}));
        history.push('/payment')
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2/>
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='address'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control type='text' onChange={(e) => setAddress(e.target.value)} value={address ? address : ''} required placeholder="enter address" ></Form.Control>
                </Form.Group>

                <Form.Group controlId='city'>
                    <Form.Label>City</Form.Label>
                    <Form.Control type='text' onChange={(e) => setCity(e.target.value)} value={city ? city : ''} required  placeholder="enter city"></Form.Control>
                </Form.Group>

                 <Form.Group controlId='postalCode'>
                    <Form.Label>postal code</Form.Label>
                    <Form.Control type='text' onChange={(e) => setPostalCode(e.target.value)} value={postalCode ? postalCode : ''} required  placeholder="enter postal code"></Form.Control>
                </Form.Group>

                <Form.Group controlId='country'>
                    <Form.Label>country</Form.Label>
                    <Form.Control type='text' onChange={(e) => setCountry(e.target.value)} value={country ? country : ''} required  placeholder="enter postal code"></Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary">Continue</Button>
            </Form>
        </FormContainer>
    )
}

export default ShippingScreen