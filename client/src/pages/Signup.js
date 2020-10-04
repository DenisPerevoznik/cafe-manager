import React, { useContext, useEffect, useState } from 'react';
import {MDBBtn, MDBInput} from 'mdbreact';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {useToasts} from 'react-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from '../redux/actions';
import '../styles/signin.scss';

export const Signup = () => {

    const loader = useSelector(state => state.main.loader);
    const [form, setForm] = useState({
        name: '',
        surname: '',
        email: '',
        password: ''
    });
    const dispatch = useDispatch();

    const auth = useContext(AuthContext);
    const {addToast} = useToasts();

    function changeHandler(event){

        setForm({...form, [event.target.name]: event.target.value});
    }

    async function sendForm(event){

        event.preventDefault();

        dispatch(showLoader());
        axios.post('/api/auth/signup', form, {headers: {'Content-Type': 'application/json'}})
        .then(response => {
            
            const {userId, token} = response.data;
            auth.login(userId, token);
            dispatch(hideLoader());
        })
        .catch(error => {
            addToast(error.response.data.message, {appearance: "error"});
            dispatch(hideLoader());
        });
    }

    return (
        <div className="container">
            <div className="row d-flex justify-content-center">

                <div className="auth">
                        <div className="auth__header">
                            <div className="auth__header__overlay">
                                <h2>Регистрация</h2>
                            </div>
                        </div>
                    
                    <div className="auth__body">

                        <form onSubmit={sendForm}>
                            <div className="grey-text">

                            <MDBInput label="Name" icon="user-tag" group type="text" validate error="wrong"
                                    success="right" name="name" value={form.name} onChange={changeHandler} required/>

                            <MDBInput label="Surname" icon="user" group type="text" validate error="wrong"
                                    success="right" name="surname" value={form.surname} onChange={changeHandler}/>

                                <MDBInput label="Email" icon="envelope" group type="email" validate error="wrong"
                                    success="right" name="email" value={form.email} onChange={changeHandler} required/>
                                
                                <MDBInput label="Пароль" icon="lock" group type="password" 
                                    validate name="password" value={form.password} onChange={changeHandler}/>
                            </div>
                            <div className="text-center">
                                <MDBBtn color="success" type={loader ? "button" : "submit"} disabled={loader} 
                                    className="auth__btn">
                                {loader ? 
                                    <>
                                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                        Обработка...</> 
                                    :
                                        <span>Создать</span>}
                                </MDBBtn>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}