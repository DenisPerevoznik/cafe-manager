import { MDBBadge } from 'mdbreact';
import React from 'react';
import { getDate } from '../utils/utils';
import { hryvniaSign } from '../utils/constants';

export const WorkShiftItem = ({shift}) => {

    const shiftDate = getDate(shift.date);
    return (
        <>
        <div className="col-sm-12 col-md-4 col-lg-3">
            <div className="card mb-3 shift-card">
                <div className="card-body">
                    <h4>{`${shiftDate.day}.${shiftDate.month}.${shiftDate.year}`}</h4>
                    {shift.status
                    ? getForOpenedCardContent(shift)
                    : getForClosedCardContent(shift)
                    }
                    <hr/>
                    <div className="d-flex align-items-center justify-content-between">
                        <a href="#"><i className="fas fa-external-link-alt"/> Подробнее</a>
                        <input type="checkbox"/>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

function getForOpenedCardContent(shift){
    return (
        <>
            <MDBBadge className="mb-2" pill color={'primary'}>
                <i className="fas fa-clock"/> Открыта</MDBBadge>

            <p><b>Начало смены:</b> {shift.openingTime.substr(0, 5)}</p>
            <p><b>Касса в начале:</b> {`${hryvniaSign} ${shift.openingBalance}`}</p>
            <p><b>Касса:</b> {`${hryvniaSign} ${shift.revenue}`}</p>
            <p><b>На смене:</b> Employee name</p>
        </>
    );
}
function getForClosedCardContent(shift){

    return (
        <>
            <MDBBadge className="mb-2" style={{width: '100%'}} pill color={'success'}>
                <i className="fas fa-clock"/> Закрыта</MDBBadge>
            <p><b>Время работы:</b> С {shift.openingTime.substr(0, 5)} до {shift.closingTime.substr(0, 5)}</p>
            <p><b>Касса в начале:</b> {`${hryvniaSign} ${shift.openingBalance}`}</p>
            <p><b>Остаток на размен:</b> {`${hryvniaSign} ${shift.closingBalance}`}</p>
            <p><b>Был(а) на смене:</b> Employee name</p>
        </>
    );
}