import React from 'react';
import { Spinner } from 'react-bootstrap';

function Loader() {
    return(
        <Spinner animation="grow" style={{height:'100px', weight:'100px'}}>
            <span className="sr-only">Loading...</span>
        </Spinner>

    )
}

export default Loader