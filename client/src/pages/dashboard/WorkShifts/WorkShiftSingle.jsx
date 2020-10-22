import { MDBBadge, MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectWorkShift } from '../../../redux/workShifts/actions';
import { hryvniaSign } from '../../../utils/constants';
import { AlertModal } from '../../../components/AlertModal';

export const WorkShiftSingle = () => {
  const shift = useSelector((state) => state.workShifts.selected);
  const workShifts = useSelector((state) => state.workShifts.workShifts);
  const dispatch = useDispatch();
  const [expModalStatus, setExpModalStatus] = useState(false);

  function onChangeShift(event) {
    const value = event.target.value;
    if (value != 'false') {
      dispatch(selectWorkShift(workShifts.find((s) => s.date == value)));
    }
  }

  return (
    <div className="conatiner p-4">
      <AlertModal
        title="Список расходов"
        toggle={expModalStatus}
        onOkClick={() => {
          setExpModalStatus(false);
        }}
      >
        <p>Здесь будет таблица с расходами</p>
      </AlertModal>

      <div className="row">
        <div className="col-sm-12 col-md-3 col-lg-3">
          <h3>Смена {shift.date}</h3>
        </div>

        <div className="col-sm-12 col-md-3 col-lg-3">
          <select
            className="browser-default custom-select"
            onChange={onChangeShift}
          >
            <option value="false">Выберите дату для загрузки смены</option>
            {workShifts.map((s) => (
              <option value={s.date}>{s.date}</option>
            ))}
          </select>
        </div>

        <div className="col-sm-12 col-md-12 col-lg-12">
          <span className="mr-2">Статус:</span>
          <MDBBadge pill color={shift.status ? 'primary' : 'success'}>
            <i
              className={`fas fa-${shift.status ? 'clock' : 'check-circle'}`}
            />
            {shift.status ? ' Открыта' : ' Закрыта'}
          </MDBBadge>
        </div>
        <div className="col-12">
          <hr />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card-columns card-col-workshift">
            <div className="card">
              <div className="card-body d-flex flex-column align-items-center">
                <div style={{ width: '100%' }}>Сотрудник</div>
                <div
                  style={{
                    ...photo,
                    backgroundImage:
                      'url("https://nogivruki.ua/wp-content/uploads/2018/08/default-user-image.png")',
                  }}
                ></div>
                <span>{shift.employeeName}</span>
                {!shift.status ? (
                  <>
                    <MDBBadge color={'primary'} className="mt-1">
                      <i className="fas fa-stopwatch" /> Время работы:
                    </MDBBadge>
                    С {shift.openingTime} до {shift.closingTime}
                  </>
                ) : (
                  <>
                    <MDBBadge color={'primary'} className="mt-1">
                      <i className="fas fa-stopwatch" /> Время работы:
                    </MDBBadge>
                    Открылась в {shift.openingTime}
                  </>
                )}
              </div>
            </div>

            <CardInfo title="Выручка" materialIcon="attach_money" line={true}>
              {hryvniaSign} {shift.revenue}
            </CardInfo>

            <CardInfo title="Чеки" materialIcon="receipt_long" line={true}>
              {shift.receipts} шт.
            </CardInfo>

            <CardInfo
              title="Касса в начале"
              materialIcon="point_of_sale"
              line={true}
            >
              {hryvniaSign} {shift.openingBalance}
            </CardInfo>

            <CardInfo
              title="Остаток на размен"
              materialIcon="payments"
              line={true}
            >
              {!shift.status ? (
                <>
                  {hryvniaSign} {shift.closingBalance}
                </>
              ) : (
                <em style={{ color: 'gray' }}>Смена еще не закрыта</em>
              )}
            </CardInfo>

            <CardInfo
              title="Инкассация"
              materialIcon="request_quote"
              line={true}
            >
              {hryvniaSign} {shift.collection}
            </CardInfo>

            <CardInfo
              line={false}
              title="Сумма расходов"
              materialIcon="money_off"
            >
              <p>$ 15</p>
              <button
                onClick={() => {
                  setExpModalStatus(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ position: 'absolute', bottom: '-35px' }}
              >
                <i className="fas fa-search" />
              </button>
            </CardInfo>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <h4>Продажи на смене</h4>
        <div className="col-md-12 col-sm-12">
          <div className="card">
            <MDBTable hover>
              <MDBTableHead>
                <tr>
                  <th>Продукт</th>
                  <th>Цена за ед.</th>
                  <th>Кол-во</th>
                  <th>Выручка</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                <tr>
                  <td>Американо</td>
                  <td>15</td>
                  <td>2</td>
                  <td>30</td>
                </tr>
                <tr>
                  <td>Эспрессо</td>
                  <td>13</td>
                  <td>3</td>
                  <td>35</td>
                </tr>
                <tr>
                  <td>Латте</td>
                  <td>20</td>
                  <td>10</td>
                  <td>200</td>
                </tr>
              </MDBTableBody>
            </MDBTable>
          </div>
        </div>
      </div>
    </div>
  );
};

const CardInfo = (props) => {
  return (
    <div className="card" style={{ height: '120px', marginBottom: '1rem' }}>
      <div className="card-body">
        <div
          style={{ position: 'relative' }}
          className="d-flex justify-content-between align-items-center"
        >
          <div>
            <h4 className="card-title">{props.title}</h4>
            <div style={{ fontSize: '19px' }}>{props.children}</div>
          </div>
          <i className="material-icons" style={cardIcon}>
            {props.materialIcon}
          </i>
          {props.line && <div style={lineCardBlock}></div>}
        </div>
      </div>
    </div>
  );
};

const cardIcon = {
  fontSize: '40px',
  color: '#2196F3',
};

const photo = {
  width: '135px',
  height: '135px',
  borderRadius: '50%',
  backgroundSize: 'cover',
};

const lineCardBlock = {
  position: 'absolute',
  width: '100%',
  height: '3px',
  backgroundColor: '#2196F3',
  bottom: '-11px',
};
