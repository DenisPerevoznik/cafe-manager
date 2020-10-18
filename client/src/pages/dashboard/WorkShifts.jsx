import { MDBInput } from 'mdbreact';
import React, {useEffect, useState}from 'react';
import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmModal } from '../../components/ConfirmModal';
import { WorkShiftItem } from '../../components/WorkShiftItem';
import { AuthContext } from '../../context/AuthContext';
import { getAllWorkShifts } from '../../redux/workShifts/actions';

export const WorkShifts = () => {

    const [rmvConfirm, setRmvConfirm] = useState(false);
    const dispatch = useDispatch();
    const loader = useSelector(state => state.main.loader);
    const workShifts = useSelector(state => state.workShifts.workShifts);
    const company = useSelector(state => state.company.selectedCompany);
    const auth = useContext(AuthContext);
    const [selectedToRemove, setSelectedToRemove] = useState([]);

    useEffect(() => {
        dispatch(getAllWorkShifts(company.id, auth.token));
    }, [])

    function onChangeCheckShiftItem(id, status){

        setSelectedToRemove(status 
            ? [...selectedToRemove, id]
            : selectedToRemove.filter(_id => _id !== id));
    }

    function removeSelectedShifts(){}

    return (
        <div className="container-fluid">
            <div className="row">
                <ConfirmModal toggle={rmvConfirm} 
                onNo={() => {setRmvConfirm(false)}}
                onYes={removeSelectedShifts}
                title="Удаление рабочих смен"
                description="После удаления выбранных смен, все отчеты так же будут удалены!
                Вы действительно хотите это сделать ? "/>
                
                <div className="col-sm-12 col-md-4 col-lg-4">
                    <MDBInput label="Поиск по дате" icon="search" group type="text" />
                </div>

                <div className="col-sm-12 col-md-4 col-lg-4 d-flex align-items-center">
                    <button disabled={!selectedToRemove.length} className="btn btn-danger btn-sm" onClick={() => {setRmvConfirm(true)}}>
                        <i className="far fa-trash-alt"/> Удалить выбранные</button>
                </div>

            </div>
            <div className="row">
                {loader
                ? <span className="spinner-border mr-2" role="status" aria-hidden="true"></span>
                : workShifts.map(shift => <WorkShiftItem onCheck={onChangeCheckShiftItem} shift={shift} key={shift.id}/>)}
            </div>
        </div>
    );
};