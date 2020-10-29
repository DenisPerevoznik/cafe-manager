import {
  MDBBtn,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
  MDBAlert,
} from 'mdbreact';
import React, { useState } from 'react';
import { useEffect } from 'react';

export const ModalCreateOrEditExp = ({
  isOpen,
  accounts,
  editExpense = null,
  onCancel,
  onSave,
}) => {
  const [valid, setValid] = useState(true);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (isOpen && editExpense) {
      setForm({ ...editExpense });
    } else {
      setForm({
        description: '',
        expenseAmount: 0,
        AccountId: 0,
      });
    }
    console.log('editExpense:', editExpense);
  }, [isOpen]);

  function changeHandler(event) {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: name === 'expenseAmount' ? parseFloat(value) : value,
    });
  }

  function handleSave() {
    if (
      form.description.trim() === '' ||
      typeof form.expenseAmount !== 'number' ||
      form.expenseAmount < 0 ||
      form.AccountId === 0
    ) {
      setValid(false);
    } else {
      onSave(form);
      setValid(true);
    }
  }

  return (
    <MDBModal isOpen={isOpen} toggle={!isOpen}>
      <MDBModalHeader toggle={!isOpen}>
        {editExpense ? 'Изменение' : 'Создание'} записи расхода
      </MDBModalHeader>
      <MDBModalBody>
        <form>
          <label htmlFor="expDescription">На что расходовалась сумма</label>
          <textarea
            className="form-control"
            id="expDescription"
            rows="2"
            name="description"
            onInput={changeHandler}
            value={form.description}
          />
          <MDBInput
            label="Сумма расхода"
            type="number"
            step=".1"
            min="0"
            name="expenseAmount"
            onInput={changeHandler}
            value={form.expenseAmount}
            required
          />

          <label htmlFor="select-account">
            Укажите счет для списания средств
          </label>
          <select
            name="AccountId"
            id="select-account"
            onChange={changeHandler}
            className="form-control"
            defaultValue={editExpense ? form.AccountId : ''}
          >
            <option selected={!editExpense} value="0">
              Выберите счет
            </option>
            {accounts.map((account) => (
              <option value={account.id} key={account.id}>
                {account.title}
              </option>
            ))}
          </select>
        </form>
        {!valid && (
          <MDBAlert color="danger">
            Некоторые поля заполнены не правильно
          </MDBAlert>
        )}
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn color="elegant" onClick={onCancel}>
          Отмена
        </MDBBtn>
        <MDBBtn color="primary" onClick={handleSave}>
          {editExpense ? 'Обновить' : 'Создать'}
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
};
