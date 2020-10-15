import { MDBBadge } from 'mdbreact';
import React from 'react';

export const WorkShiftItem = ({shift}) => {

    return (
        <>
        <div className="col-sm-12 col-md-4 col-lg-3">
            <div className="card mb-3 shift-card">
                <div className="card-body">
                    <h4>21.01.2000</h4>
                    <MDBBadge className="mb-2" style={{width: `${shift.status ? 'fill-content' : '100%'}`}} pill color={shift.status ? 'primary' : 'success'}>
                        <i className="fas fa-clock"/> 
                        {shift.status ? ' Открыта' : ' Закрыта'}</MDBBadge>
                    {shift.status 
                        ? <p><b>Начало смены:</b> 06:00</p>
                        : <p><b>Время работы:</b> С 06:00 до 22:00</p>
                    }
                    <p><b>Касса в начале:</b> 500</p>
                    {shift.status
                    ? <><p><b>Касса:</b> 982</p>
                        <p><b>На смене:</b> Виталик</p></>
                    : <>
                        <p><b>Остаток на размен:</b> 500</p>
                        <p><b>Был(а) на смене:</b> Виталик</p></>
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