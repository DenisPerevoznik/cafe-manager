import React from 'react';
import {MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBBtn} from 'mdbreact';

export const CompanyItem = ({name}) => {

    return (
        <MDBCard className="mb-3">
            <MDBCardImage className="img-fluid" src="https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(67).jpg"
            waves />
            <MDBCardBody>
                <MDBCardTitle>{name}</MDBCardTitle>
                <MDBBtn href="#" color="primary">Открыть</MDBBtn>
            </MDBCardBody>
        </MDBCard>
    );
}