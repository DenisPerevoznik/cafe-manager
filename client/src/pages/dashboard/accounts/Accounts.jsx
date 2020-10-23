import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import React from 'react';

export const Accounts = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-md-4 col-lg-4 d-flex align-items-center">
          <button className="btn btn-primary">
            <i className="far fa-plus-square" /> Создать ячейку
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-12">
          <MDBTable hover>
            <MDBTableBody>
              <tr>
                <th>Название</th>
                <th>Тип</th>
                <th>Баланс</th>
                <th>Выручка</th>
              </tr>
            </MDBTableBody>
            <MDBTableBody></MDBTableBody>
          </MDBTable>
        </div>
      </div>
    </div>
  );
};
