import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from 'mdbreact';
import React from 'react';

export const AlertModal = ({ title, children, onOkClick, toggle }) => {
  return (
    <>
      <MDBModal isOpen={toggle}>
        <MDBModalHeader>{title}</MDBModalHeader>
        <MDBModalBody>{children}</MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="primary" onClick={onOkClick.bind(null)}>
            Ок
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </>
  );
};
