import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';


function ProductEditScreen({ match, history }) {

    const productId = match.params.id;

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);

    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetail);
    const { error, loading, product} = productDetails;

    const productUpdate = useSelector(state => state.productUpdate);
    const { error:errorUpdate, loading:loadingUpdate, success:successUpdate} = productUpdate;

    useEffect(() => {
        if(successUpdate) {
            dispatch({ type:PRODUCT_UPDATE_RESET });
            history.push('/admin/productlist')
        } else {
            if (!product.name || product._id !== Number(productId)){
                dispatch(listProductDetails(productId))
            } else {
                setName(product.name);
                setPrice(product.price);
                setImage(product.image);
                setBrand(product.brand);
                setCategory(product.category);
                setCountInStock(product.countInStock);
                setDescription(product.description);
            }
        }
        

        
        
    }, [dispatch, product, productId, history, successUpdate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProduct({
            _id: productId, name, price, image, brand, category, countInStock, description
        }))

    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]; // get the first file
        console.log('file:', file)
        const formData = new FormData();
        console.log('FormData:', formData)

        formData.append('image', file);
        formData.append('product_id', productId);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'  // allow us post data file
                }
            };

            const {data} = await axios.post('/api/products/upload/', formData, config);
            setImage(data);
            setUploading(false)

        } catch (error) {
            setUploading(false)
        }
    };

    return (
        <div>
            <Link to='/admin/productlist'>
                Go back
            </Link>

            <FormContainer>
                <h1>Edit Product</h1>

                {loadingUpdate && <Loader/>}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='text' placeholder="enter your name" value={name} onChange={(e) => setName(e.target.value)}>

                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='price'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type='number' placeholder="enter price" value={price} onChange={(e) => setPrice(e.target.value)}>

                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='image'>
                            <Form.Label>Image</Form.Label>
                            <Form.Control type='text' placeholder="enter image" value={image} onChange={(e) => setImage(e.target.value)}>

                            </Form.Control>

                            <Form.File id='image-file' label='choose file' custom onChange={uploadFileHandler}>

                            </Form.File>
                        </Form.Group>

                        <Form.Group controlId='brand'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control type='text' placeholder="enter brand" value={brand} onChange={(e) => setBrand(e.target.value)}>

                            </Form.Control>
                            {uploading && <Loader/>}
                        </Form.Group>

                        <Form.Group controlId='countInStock'>
                            <Form.Label>Stock</Form.Label>
                            <Form.Control type='number' placeholder="enter your stock" value={countInStock} onChange={(e) => setCountInStock(e.target.value)}>

                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='category'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control type='text' placeholder="enter your category" value={category} onChange={(e) => setCategory(e.target.value)}>

                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='description'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type='text' placeholder="enter your description" value={description} onChange={(e) => setDescription(e.target.value)}>

                            </Form.Control>
                        </Form.Group>

                        <Button type="submit" variant='primary'>Update</Button>
                </Form>
                )}


            </FormContainer>
        </div>

    )
}

export default ProductEditScreen;