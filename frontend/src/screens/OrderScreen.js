import React, { useState, useEffect } from 'react';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButton } from 'react-paypal-button-v2';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/OrderConstants'


function OrderScreen({ match, history }) {
    const orderId = match.params.id;
    const dispatch = useDispatch();

    const [sdkReady, setSdkReady] = useState(false); // SdkReady: san sang thanh toan. Neu sdkReady=true -> add the button


    const orderDetails = useSelector(state => state.orderDetails);
    const { order, error, loading } = orderDetails;

    const orderPay = useSelector(state => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay; // custom loading va success de tranh trung lap

    const orderDeliver = useSelector(state => state.orderDeliver);
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver; // custom loading

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    if (!loading && !error){
        order.itemPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
    }

    // ATpoKxlma3vxuqzhzhmcaSy1je89guFehbXhC8N1OSBzvQ8FmQ5OgNrzYcFnvZ957JlCi_hUA_dNMfwK
    const addPayPalScript = () => {
        console.log('addPayPalScript success')
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://www.paypal.com/sdk/js?client-id=ATpoKxlma3vxuqzhzhmcaSy1je89guFehbXhC8N1OSBzvQ8FmQ5OgNrzYcFnvZ957JlCi_hUA_dNMfwK';
        script.async = true;
        script.onload = () => {
            setSdkReady(true);
        };

        // when script is load -> append to DOM
        document.body.appendChild(script);
    };

    useEffect(() => {
        if(!userInfo) {
            history.push('/login')
        }

        if(!order || successPay || order.id !== Number(orderId) || successDeliver){ // only dispatch when we don't have order or this order
            dispatch({type: ORDER_PAY_RESET});
            dispatch({type: ORDER_DELIVER_RESET});

            dispatch(getOrderDetails(orderId))

        } else if (!order.isPaid) {
            if(!window.paypal) {
                addPayPalScript()

            } else {
                setSdkReady(true)
            }
        }

    }, [dispatch, orderId, successPay, successDeliver]);

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult))
    };
    // console.log('sdkReady', sdkReady);

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    };


    return loading ? (
        <Loader/>
    ) : error ? (
        <Message variant='danger'>{error}</Message>
    ) : (
        <div>
            <h1>Order: {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p> <strong>Name:</strong> {order.user.name} </p>
                            <p> <strong>Email:</strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a> </p>
                            <p>
                                <strong>Shipping:  </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}
                                {'     '}
                                {order.shippingAddress.postalCode}
                                {'     '}
                                {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                            ) : (
                                    <Message variant='warning'>Not Delivered </Message>
                                )}

                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>

                            <p>
                                <strong>Method:  </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Message variant='success'>Paid on: {order.paidAt.substring(0, 10)}</Message>
                            ) : (
                                    <Message variant='warning'>Not paid </Message>
                                )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? <h3>Your Orders is empty</h3> : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={2}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>

                                                <Col md={2}>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>

                                                <Col md={4}>
                                                    {item.qty} x $ {item.price} = ${(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                )}

                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                             <ListGroup.Item>
                                <Row>
                                    <Col>Item:</Col>
                                    <Col>${order.itemPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total Price:</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader/>}

                                    {sdkReady ? (
                                        <Loader/>
                                    ) : (
                                        <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler}/>
                                    )}
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item>
                                {error && <h3 variant="danger">{error}</h3>}
                            </ListGroup.Item>

                        </ListGroup>

                        {loadingDeliver && <Loader/>}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button type="button" className='btn btn-block' onClick={deliverHandler}>
                                        Mark as Deliver
                                    </Button>
                                </ListGroup.Item>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen;