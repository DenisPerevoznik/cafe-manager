import React, { useContext, useEffect } from 'react';
import { CompanyItem } from '../components/company/CompanyItem';
import {CreateModal} from '../components/company/CreateModal';
import { useToasts } from 'react-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import { createCompany, getCompanies } from '../redux/company/actions';

export const Companies = () => {

    const {addToast} = useToasts();
    const dispatch = useDispatch();
    const loader = useSelector(state => state.main.loader);
    const companies = useSelector(state => state.company.companies);
    const auth = useContext(AuthContext);

    useEffect(() => {
        if(auth.token){
            dispatch(getCompanies(auth.token));
        }
    }, [auth])

    function create(name){
        dispatch(createCompany({name}, auth.token))
        .then(() => {
            addToast('Новая компания успешно создана', {appearance: "success"});
        });
    }

    return (
        <div className="container">
            <div className="row">
                {companies.map(c => <div className="col-md-3 col-sm-12" key={c.id}>
                    <CompanyItem name={c.name}/></div>)}
                {!loader
                ? <CreateModal onCreate={create}/>
                : <span className="spinner-border mr-2" role="status" aria-hidden="true"></span>
                }
            </div>
        </div>
    );
}