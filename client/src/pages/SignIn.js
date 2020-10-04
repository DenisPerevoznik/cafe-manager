import React, { useContext, useEffect, useState } from 'react';
import {MDBBtn, MDBInput} from 'mdbreact';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {useToasts} from 'react-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader, changeAuthStatus } from '../redux/actions';
import '../styles/signin.scss';

export const SignIn = () => {

    const loader = useSelector(state => state.main.loader);
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const auth = useContext(AuthContext);
    const {addToast} = useToasts();

    function changeHandler(event){

        setForm({...form, [event.target.name]: event.target.value});
    }

    async function sendForm(event){

        event.preventDefault();

        dispatch(showLoader());
        axios.post('/api/auth/signin', form, {headers: {'Content-Type': 'application/json'}})
        .then(response => {
            
            const {userId, token} = response.data;
            auth.login(userId, token);
        })
        .catch(error => {
            addToast(error.response.data.message, {appearance: "error"});
        })
        .finally(() => {dispatch(hideLoader())});
    }

    return (
        <div className="container">
            <div className="row d-flex justify-content-center">

                <div className="auth">
                        <div className="auth__header">
                            <div className="auth__header__overlay">
                                <h2>Вход в систему</h2>
                            </div>
                        </div>
                    
                    <div className="auth__body">

                        <form onSubmit={sendForm}>
                            <div className="grey-text">
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
                                        <span>Войти  <i className="fa fa-key"/></span>}
                                </MDBBtn>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}