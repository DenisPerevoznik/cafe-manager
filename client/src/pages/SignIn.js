import React, { useState } from 'react';
import {MDBBtn, MDBInput} from 'mdbreact';
import '../styles/signin.scss';

export const SignIn = () => {

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({});

    function changeHandler(event){

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

                        <form>
                            <div className="grey-text">
                                <MDBInput label="Email" icon="envelope" group type="email" validate error="wrong"
                                    success="right" name="email" value={form.email} onChange={changeHandler} required/>
                                
                                <MDBInput label="Пароль" icon="lock" group type="password" 
                                    validate name="password" value={form.password} onChange={changeHandler}/>
                            </div>
                            <div className="text-center">
                                <MDBBtn color="success" type={loading ? "button" : "submit"} disabled={loading} className="auth__btn">
                                {loading ? 
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