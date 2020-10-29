import React from 'react';
import {MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBBtn} from 'mdbreact';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectCompany } from '../../redux/company/actions';

export const CompanyItem = ({company}) => {

    const dispatch = useDispatch();

    return (
        <MDBCard className="mb-3">
            <MDBCardImage className="img-fluid" src="https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(67).jpg"
            waves />
            <MDBCardBody>
                <MDBCardTitle>{company.name}</MDBCardTitle>
                <Link to="/analytics" style={{color: 'white'}}
                    onClick={() => {dispatch(selectCompany(company))}}>
                    <MDBBtn color="primary" >Открыть</MDBBtn>
                </Link>
            </MDBCardBody>
        </MDBCard>
    );
}