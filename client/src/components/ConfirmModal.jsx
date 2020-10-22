import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from 'mdbreact';
import React from 'react';

export const ConfirmModal = ({ title, children, onYes, onCancel, toggle }) => {
  return (
    <>
      <MDBModal isOpen={toggle}>
        <MDBModalHeader>{title}</MDBModalHeader>
        <MDBModalBody>{children}</MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="elegant" onClick={onCancel.bind(null)}>
            Отмена
          </MDBBtn>
          <MDBBtn color="primary" onClick={onYes.bind(null)}>
            Ок
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </>
  );
};
