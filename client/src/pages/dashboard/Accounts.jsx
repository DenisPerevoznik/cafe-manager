import {
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBBadge,
  MDBInput,
} from 'mdbreact';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AlertModal } from '../../components/AlertModal';
import { AuthContext } from '../../context/AuthContext';
import {
  changeTitle,
  createAccount,
  getAccounts,
  removeAccount,
} from '../../redux/accounts/actions';
import { hryvniaSign } from '../../utils/constants';
import { ModalCreateAccount } from '../../components/accounts/ModalCreateAccount';
import { ConfirmModal } from '../../components/ConfirmModal';
import { createMessgae } from '../../redux/actions';

export const Accounts = () => {
  const { accounts, accountsTypes } = useSelector(
    (state) => state.accounts.accountsData
  );
  const company = useSelector((state) => state.company.selectedCompany);
  const dispatch = useDispatch();
  const auth = useContext(AuthContext);
  const [notDeleteAlert, setNotDeleteAlert] = useState(false);
  const [confirmToRemove, setConfirmToRemove] = useState({
    toggle: false,
    id: 0,
  });
  const [editing, setEditing] = useState({ id: 0, title: '' });

  useEffect(() => {
    dispatch(getAccounts(auth.token, company.id));
  }, []);

  // function onCreateHandler(formData) {
  //   dispatch(createAccount(formData, company.id, auth.token));
  // }

  function handleRemove() {
    if (confirmToRemove.id) {
      dispatch(removeAccount(confirmToRemove.id, auth.token, company.id));
    }
    setConfirmToRemove({ toggle: false, id: 0 });
  }

  function handleSaveName() {
    if (editing.title.trim() === '') {
      dispatch(
        createMessgae({
          text: 'Поле с именем не может быть пустым',
          type: 'error',
        })
      );
    }

    dispatch(changeTitle(editing.title, editing.id, auth.token, company.id));
    setEditing({ id: 0, title: '' });
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-md-4 col-lg-4 d-flex align-items-center">
          <ModalCreateAccount
            types={accountsTypes}
            companyId={company.id}
            token={auth.token}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 col-md-12">
          <div className="card">
            <div className="card-body table-resp">
              <MDBTable hover>
                <MDBTableHead>
                  {accounts.length ? (
                    <tr>
                      <th style={{ width: '19rem' }}>Название</th>
                      <th>Тип</th>
                      <th>Баланс</th>
                      <th style={{ width: '11rem' }}></th>
                    </tr>
                  ) : (
                    <tr colspan="4">Список ячеек пуст</tr>
                  )}
                </MDBTableHead>
                <MDBTableBody>
                  {accounts.map((acc) => (
                    <tr
                      key={acc.id}
                      style={{
                        background:
                          company.mainAccount == acc.id ? '#2cce8459' : '',
                      }}
                    >
                      <td>
                        {editing.id === acc.id ? (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={handleSaveName}
                            >
                              <i className="far fa-save" />
                            </button>
                            <MDBInput
                              type="text"
                              label="Название ячейки"
                              name="title"
                              value={editing.title}
                              onInput={(event) => {
                                setEditing({
                                  ...editing,
                                  title: event.target.value,
                                });
                              }}
                              required
                            />
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                setEditing({ id: acc.id, title: acc.title });
                              }}
                            >
                              <i className="far fa-edit" />
                            </button>
                            {acc.title}
                          </>
                        )}
                      </td>
                      <td>{acc.type}</td>
                      <td>
                        <MDBBadge
                          style={{ fontSize: '14px' }}
                          color={acc.balance < 0 ? 'danger' : 'success'}
                          className="mt-1"
                        >
                          {hryvniaSign} {acc.balance}
                        </MDBBadge>
                      </td>
                      <td>
                        {company.mainAccount == acc.id ? (
                          <>
                            <button className="btn btn-danger btn-sm" disabled>
                              <i className="far fa-trash-alt" /> Удалить
                            </button>
                            <i
                              className="far fa-question-circle"
                              title="Почему нельзя удалить"
                              onClick={() => {
                                setNotDeleteAlert(true);
                              }}
                            />
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setConfirmToRemove({ toggle: true, id: acc.id });
                            }}
                            className="btn btn-danger btn-sm"
                          >
                            <i className="far fa-trash-alt" /> Удалить
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        title="Удаление ячейки"
        onYes={handleRemove}
        onCancel={() => {
          setConfirmToRemove(false);
        }}
        toggle={confirmToRemove.toggle}
      >
        <p>Вы действительно хотите удалить выбранную ячейку ?</p>
      </ConfirmModal>
      <AlertModal
        title="Удаление запрещено"
        onOkClick={() => {
          setNotDeleteAlert(false);
        }}
        toggle={notDeleteAlert}
      >
        Так как это "главная ячейка", её нельзя удалить. <br />
        Главная ячейка - это счет, который привязан к мобильному приложению и
        изменяется, после оформления заказов, добавления расходов и т.п. <br />
        Для удаления, измените "главную ячейку" в разделе
        <Link
          to="/settings"
          onClick={() => {
            setNotDeleteAlert(false);
          }}
        >
          {' '}
          "Настройки"
        </Link>
      </AlertModal>
    </div>
  );
};
