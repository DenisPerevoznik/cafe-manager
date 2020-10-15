import { MDBBtn, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from 'mdbreact';
import React from 'react';

export const ConfirmModal = ({title, description, onYes, onNo, toggle}) => {

    return (
        <>
        <MDBModal isOpen={toggle} toggle={false}>
            <MDBModalHeader toggle={false}>{title}</MDBModalHeader>
            <MDBModalBody>
                {description}
            </MDBModalBody>
            <MDBModalFooter>
                <MDBBtn color="elegant" onClick={onNo.bind(null)}>Отмена</MDBBtn>
                <MDBBtn color="primary" onClick={onYes.bind(null)}>Ок</MDBBtn>
            </MDBModalFooter>
        </MDBModal>
        </>
    );
};