import { MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from 'mdbreact';
import React, { useState } from 'react';

export const CreateModal = ({onCreate}) => {

    const [name, setName] = useState('');
    const [valid, setValid] = useState(false);
    const [toggle, setToggle] = useState(false);

    function changeToggle(){
        setToggle(!toggle);
    }

    function changeHandler(event){
        const value = event.target.value;
        setValid(value.trim() !== '' ? true : false);
        setName(value);
    }

    function create(){
        if(valid){
            onCreate(name);
            setToggle(false);
        }
    }

    return (
        <>
        <div className="col-md-3 col-sm-12 d-flex align-items-center justify-content-center"
            onClick={changeToggle}>
            <div className="new-company-btn mb-3">
                <i className="material-icons">add</i>
                <h4>Новая компания</h4>
            </div>
        </div>
            <MDBModal isOpen={toggle} toggle={changeToggle}>
            <MDBModalHeader toggle={changeToggle}>Новая компания</MDBModalHeader>
            <MDBModalBody>
                <form>
                    <MDBInput label="Название компании" icon="building" group type="text" validate error="wrong"
                        success="right" name="name" className={valid ? 'is-valid' : 'is-invalid'} 
                        onChange={changeHandler} required/>
                </form>
            </MDBModalBody>
            <MDBModalFooter>
                <MDBBtn color="elegant" onClick={changeToggle}>Отмена</MDBBtn>
                <MDBBtn color="primary" onClick={create}>Создать</MDBBtn>
            </MDBModalFooter>
        </MDBModal>
        </>
    );
}