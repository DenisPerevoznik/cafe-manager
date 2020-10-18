import { MDBInput } from 'mdbreact';
import React, {useEffect, useState}from 'react';
import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmModal } from '../../components/ConfirmModal';
import { WorkShiftItem } from '../../components/WorkShiftItem';
import { AuthContext } from '../../context/AuthContext';
import { getAllWorkShifts, removeWorkShifts, searchWorkShift } from '../../redux/workShifts/actions';
import { getDate } from '../../utils/utils';

export const WorkShifts = () => {

    const [rmvConfirm, setRmvConfirm] = useState(false);
    const dispatch = useDispatch();
    const workShifts = useSelector(state => state.workShifts.workShifts);
    const [shiftsForSearch, setShiftsForSearch] = useState([]);
    const company = useSelector(state => state.company.selectedCompany);
    const auth = useContext(AuthContext);
    const [selectedToRemove, setSelectedToRemove] = useState([]);

    useEffect(() => {
        dispatch(getAllWorkShifts(company.id, auth.token));
    }, [])

    useEffect(() => {
        setShiftsForSearch(workShifts);
    }, [workShifts]);

    function onChangeCheckShiftItem(id, status){

        setSelectedToRemove(status 
            ? [...selectedToRemove, id]
            : selectedToRemove.filter(_id => _id !== id));
    }

    async function removeSelectedShifts(){

        if(selectedToRemove.length){
            setSelectedToRemove([]);
            setRmvConfirm(false);
            dispatch(removeWorkShifts(selectedToRemove, auth.token, company.id));
        }
    }

    function searchHandler(event){
        const searchText = event.target.value.trim();
        setShiftsForSearch(workShifts.filter(shift => {
            const dateObj = getDate(shift.date);
            const date = `${dateObj.day}.${dateObj.month}.${dateObj.year}`;

            if(date.includes(searchText)){
                return shift;
            }
        }));
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <ConfirmModal toggle={rmvConfirm} 
                onNo={() => {setRmvConfirm(false)}}
                onYes={removeSelectedShifts}
                title="Удаление рабочих смен"
                description="После удаления выбранных смен, вся статистика за эти даты так же будет утеряна!
                Вы действительно хотите это сделать ? "/>
                
                <div className="col-sm-12 col-md-4 col-lg-4">
                    <MDBInput label="Поиск по дате" icon="search" group type="text" onInput={searchHandler}/>
                </div>

                <div className="col-sm-12 col-md-4 col-lg-4 d-flex align-items-center">
                    <button disabled={!selectedToRemove.length} className="btn btn-danger btn-sm" onClick={() => {setRmvConfirm(true)}}>
                        <i className="far fa-trash-alt"/> Удалить выбранные</button>
                </div>

            </div>
            <div className="row">
                {shiftsForSearch.map(shift => <WorkShiftItem onCheck={onChangeCheckShiftItem} 
                    shift={shift} key={shift.id}/>)}
            </div>
        </div>
    );
};