import { MDBCollapse, MDBIcon, MDBNavbar, MDBNavbarBrand, MDBNavbarNav, 
    MDBNavbarToggler, MDBNavItem, MDBNavLink } from 'mdbreact';
import React, {useContext, useState} from 'react';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import { clearCompanies } from '../redux/company/actions';

export const Header = () => {

    const [toggle, setToggle] = useState(false);
    const auth = useContext(AuthContext);
    const dispatch = useDispatch();

    function changeToggle(){
        setToggle(!toggle);
    }

    function logout(){

        dispatch(clearCompanies());
        auth.logout();
    }

    return (
        <MDBNavbar dark expand="md" className="pl-5 mb-4" style={{width: "100%", background: "#24292E"}}>
            <MDBNavbarBrand>
            <strong className="white-text">Sleam</strong>
            </MDBNavbarBrand>
            <MDBNavbarToggler onClick={changeToggle} />
            <MDBCollapse id="navbarCollapse3" isOpen={toggle} navbar>
            <MDBNavbarNav right>
                <MDBNavItem>
                    <MDBNavLink onClick={logout} className="waves-effect waves-light" to="#!">
                        <span>Выйти <MDBIcon fas icon="sign-out-alt" /></span>
                    </MDBNavLink>
                </MDBNavItem>
            </MDBNavbarNav>
            </MDBCollapse>
        </MDBNavbar>
    );
}