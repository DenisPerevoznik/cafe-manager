import { MDBIcon, MDBNavbar, MDBNavbarBrand, MDBNavbarNav, 
    MDBNavItem, MDBNavLink } from 'mdbreact';
import React, {useContext} from 'react';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import { clearCompanies } from '../redux/company/actions';

export const Header = () => {

    const auth = useContext(AuthContext);
    const dispatch = useDispatch();

    function logout(){

        dispatch(clearCompanies());
        auth.logout();
    }

    return (
        <MDBNavbar dark expand="md" className="pl-5" style={headerStyles}>
            <MDBNavbarBrand>
                <strong className="white-text">Sleam</strong>
            </MDBNavbarBrand>
            <MDBNavbarNav right>
                <MDBNavItem>
                    <MDBNavLink onClick={logout} className="waves-effect waves-light" to="#!">
                        <span>Выйти <MDBIcon fas icon="sign-out-alt" /></span>
                    </MDBNavLink>
                </MDBNavItem>
            </MDBNavbarNav>
        </MDBNavbar>
    );
}

const headerStyles = {
    position: 'fixed',
    width: "100%",
    background: "#24292E",
    zIndex: '3'
}