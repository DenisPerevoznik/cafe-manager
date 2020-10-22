import { MDBBadge } from 'mdbreact';
import React from 'react';
import { hryvniaSign } from '../utils/constants';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectWorkShift } from '../redux/workShifts/actions';

export const WorkShiftItem = ({ shift, onCheck }) => {
  const dispatch = useDispatch();

  function onCheckHandler(event) {
    onCheck(shift.id, event.target.checked);
  }

  function detailsClickHandler() {
    dispatch(selectWorkShift(shift));
  }

  return (
    <>
      <div className="col-sm-12 col-md-4 col-lg-3">
        <div className="card mb-3 shift-card">
          <div className="card-body">
            <h4>{shift.date}</h4>
            {shift.status
              ? getForOpenedCardContent(shift)
              : getForClosedCardContent(shift)}
            <hr />
            <div className="d-flex align-items-center justify-content-between">
              <Link to="/shifts/details" onClick={detailsClickHandler}>
                <i className="fas fa-external-link-alt" /> Подробнее
              </Link>
              <input type="checkbox" onChange={onCheckHandler} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function getForOpenedCardContent(shift) {
  return (
    <>
      <MDBBadge className="mb-2" pill color={'primary'}>
        <i className="fas fa-clock" /> Открыта
      </MDBBadge>

      <p>
        <b>Начало смены:</b> {shift.openingTime}
      </p>
      <p>
        <b>Касса в начале:</b> {`${hryvniaSign} ${shift.openingBalance}`}
      </p>
      <p>
        <b>Касса:</b> {`${hryvniaSign} ${shift.revenue}`}
      </p>
      <p>
        <b>На смене:</b> {shift.employeeName}
      </p>
    </>
  );
}
function getForClosedCardContent(shift) {
  return (
    <>
      <MDBBadge
        className="mb-2"
        style={{ width: '100%' }}
        pill
        color={'success'}
      >
        <i className="fas fa-check-circle" /> Закрыта
      </MDBBadge>
      <p>
        <b>Время работы:</b> С {shift.openingTime.substr(0, 5)} до{' '}
        {shift.closingTime.substr(0, 5)}
      </p>
      <p>
        <b>Касса в начале:</b> {`${hryvniaSign} ${shift.openingBalance}`}
      </p>
      <p>
        <b>Остаток на размен:</b> {`${hryvniaSign} ${shift.closingBalance}`}
      </p>
      <p>
        <b>Был(а) на смене:</b> {shift.employeeName}
      </p>
    </>
  );
}
