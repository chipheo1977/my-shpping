import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import {login, register} from '../actions/userActions'

function RegisterScreen({ location, history }) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();

    const redirect = location.search ? location.search.split('=')[1] : '/';

    const userRegister = useSelector(state => state.userRegister);
    const { error, loading, userInfo } = userRegister;


    useEffect(() => {
        if (userInfo) { // neu user da dang nhap roi
            history.push(redirect)
        }
    }, [history, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        if(password != confirmpassword){
            setMessage('password do not match each other')
        } else {
            dispatch(register(name, email, password))
        }

    };

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {message &&  <Message variant='danger'>{message}</Message>}
            {error && <h3 variant="danger">{error}</h3>}
            {loading && <Message variant='danger'>{error}</Message>}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='text' required placeholder="enter your name" value={name} onChange={(e) => setName(e.target.value)}>

                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' required placeholder="enter your email" value={email} onChange={(e) => setEmail(e.target.value)}>

                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' required placeholder="enter your password" value={password} onChange={(e) => setpassword(e.target.value)}>

                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='passwordConfirm'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type='password' required placeholder="enter your password confirm" value={confirmpassword} onChange={(e) => setConfirmpassword(e.target.value)}>

                    </Form.Control>
                </Form.Group>

                <Button type="submit" variant='primary'>Register</Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    Already member? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
                </Col>
            </Row>

        </FormContainer>
    )
}

export default RegisterScreen;