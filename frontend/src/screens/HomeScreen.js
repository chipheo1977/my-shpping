import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux"; // useDispatch -> được sử dụng để dispatch các action, useSelector -> cho phép chúng ta lấy state từ Redux store bằng cách sử dụng một selector function làm tham số đầu vào

import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import { listProducts } from '../actions/productActions'

function HomeScreen({ history }) {
    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList); // chon state productList tu store.js de su dung
    const { error, loading, products, page, pages } = productList;

    let keyword = history.location.search;
    //console.log('keyword:', keyword);
    useEffect(() => {
        dispatch(listProducts(keyword)) // dispatch function listProducts trong productActions

    }, [dispatch, keyword]);


    return (
        <div>
            {!keyword && <ProductCarousel/>}


            <h1>Latest Products</h1>
            { loading ? <Loader />
                : error ? <Message variant='danger'>{error}</Message>
                    :
                    <div>
                        <Row>
                            {products.map(p => (
                                <Col key={p._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={p} />
                                </Col>
                            ))}
                        </Row>
                        <Paginate page={page} pages={pages} keyword={keyword}/>
                    </div>
            }
        </div>
    )
}

export default HomeScreen
