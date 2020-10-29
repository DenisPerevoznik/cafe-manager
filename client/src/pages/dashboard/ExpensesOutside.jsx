import React from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ModalCreateOrEditExp } from '../../components/expensesOutside/ModalCreateOrEditExp';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  createExpenseOutside,
  getExpensesOutside,
  removeExpenseOutside,
  updateExpenseOutside,
} from '../../redux/expensesOutside/actions';
import { useState } from 'react';
import { hryvniaSign } from '../../utils/constants';
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
  MDBBadge,
} from 'mdbreact';
import { getAccounts } from '../../redux/accounts/actions';
import { createMessgae } from '../../redux/actions';

export const ExpensesOutside = () => {
  const auth = useContext(AuthContext);
  const company = useSelector((state) => state.company.selectedCompany);
  const expenses = useSelector((state) => state.expOutside.expensesOutside);
  const [confirmToRemove, setConfirmToRemove] = useState({});
  const [isOpenEditOrUpdate, setIsOpenEditOrUpdate] = useState(false);
  const [editedExp, setEditedExp] = useState(null);
  const { accounts } = useSelector((state) => state.accounts.accountsData);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('confirmToRemove.returnToCell: ', confirmToRemove.returnToCell);
  }, [confirmToRemove]);

  useEffect(() => {
    dispatch(getExpensesOutside(auth.token, company.id));
    if (!accounts.length) {
      dispatch(getAccounts(auth.token, company.id));
    }
  }, []);

  function openCreateOrUpdateModal(exp = null) {
    setEditedExp(exp);
    setIsOpenEditOrUpdate(true);
  }

  function handleSaveExp(form) {
    setIsOpenEditOrUpdate(false);

    if (form.AccountId == company.mainAccount) {
      // проверка не совпадает ли главный счет с выбранным для списания средств
      dispatch(
        createMessgae({
          text:
            'Ошибка при указании счета. Обновите страницу и попробуйте еще раз',
          type: 'error',
        })
      );
    } else if (editedExp) {
      // update
      dispatch(updateExpenseOutside(form, editedExp, auth.token, company.id));
    } else {
      // create
      dispatch(createExpenseOutside(form, auth.token, company.id));
    }
  }

  function closeConfirmToRemove() {
    setConfirmToRemove({ ...confirmToRemove, toggle: false });
  }

  function handleRemove() {
    if (Object.keys(confirmToRemove).length) {
      const { exp, returnToCell } = confirmToRemove;
      dispatch(removeExpenseOutside(returnToCell, exp, auth.token, company.id));
      closeConfirmToRemove();
    }
  }

  return (
    <div className="container">
      <div className="row">
        <button
          className="btn btn-primary"
          onClick={() => {
            openCreateOrUpdateModal();
          }}
        >
          <i className="far fa-plus-square" /> Добавить запись о расходе
        </button>
      </div>

      <div className="row">
        <div className="col-sm-12 col-md-12">
          <div className="card">
            <div className="card-body table-resp">
              <MDBTable hover>
                <MDBTableHead>
                  {expenses.length ? (
                    <tr>
                      <th style={{ width: '14rem' }}>Сумма расхода</th>
                      <th style={{ width: '23rem' }}>Описание</th>
                      <th style={{ width: '13rem' }}>Счет</th>
                      <th style={{ width: '13rem' }}>Дата создания</th>
                      <th style={{ width: '13rem' }}>Дата изменения</th>
                      <th style={{ width: '29rem' }}></th>
                    </tr>
                  ) : (
                    <tr colspan="4">Список расходов пуст</tr>
                  )}
                </MDBTableHead>
                <MDBTableBody>
                  {expenses.map((exp) => (
                    <tr key={exp.id}>
                      <td>
                        <MDBBadge
                          style={{ fontSize: '14px' }}
                          color={'danger'}
                          className="mt-1"
                        >
                          {hryvniaSign} -{exp.expenseAmount}
                        </MDBBadge>
                      </td>
                      <td>{exp.description}</td>
                      <td>{exp.accountTitle}</td>
                      <td>{exp.createdAt}</td>
                      <td>{exp.updatedAt}</td>
                      <td>
                        <button
                          onClick={openCreateOrUpdateModal.bind(null, exp)}
                          className="btn btn-primary btn-sm"
                        >
                          <i className="far fa-edit" /> Изменить
                        </button>
                        <button
                          onClick={() => {
                            setConfirmToRemove({
                              returnToCell: true,
                              toggle: true,
                              exp,
                            });
                          }}
                          className="btn btn-danger btn-sm"
                        >
                          <i className="far fa-trash-alt" /> Удалить
                        </button>
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
        toggle={confirmToRemove.toggle}
        title="Удалить выбранный счет ?"
        onYes={handleRemove}
        onCancel={closeConfirmToRemove}
      >
        <p>Вы действительно хотите удалить выбранную запись о расходе ?</p>
        <label htmlFor="return-to-cell-check">
          <b>Вернуть сумму расхода в ячейку</b>
        </label>
        <input
          className="ml-2"
          type="checkbox"
          onChange={() => {
            setConfirmToRemove({
              ...confirmToRemove,
              returnToCell: !confirmToRemove.returnToCell,
            });
          }}
          defaultChecked={confirmToRemove.returnToCell}
          id="return-to-cell-check"
        />
      </ConfirmModal>

      <ModalCreateOrEditExp
        isOpen={isOpenEditOrUpdate}
        editExpense={editedExp}
        onCancel={() => {
          setIsOpenEditOrUpdate(false);
        }}
        onSave={handleSaveExp}
        accounts={accounts.filter((acc) => acc.id !== company.mainAccount)}
      />
    </div>
  );
};
