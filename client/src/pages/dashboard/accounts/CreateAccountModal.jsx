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

export const CreateAccountModal = ({ onCreate, types }) => {
  const [valid, setValid] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: types[0],
    balance: 0,
  });

  useEffect(() => {
    setForm({ ...form, type: types[0] });
  }, [types]);

  function changeToggle() {
    setToggle(!toggle);
  }

  function changeHandler(event) {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: name === 'balance' ? parseFloat(value) : value,
    });
  }

  function create() {
    if (form.title.trim() === '' || typeof form.balance !== 'number') {
      setValid(false);
    } else {
      setValid(true);
      onCreate(form);
      setToggle(false);
    }
  }

  return (
    <>
      <button className="btn btn-primary" onClick={changeToggle}>
        <i className="far fa-plus-square" /> Создать ячейку
      </button>
      <MDBModal isOpen={toggle} toggle={changeToggle}>
        <MDBModalHeader toggle={changeToggle}>Новая ячейка</MDBModalHeader>
        <MDBModalBody>
          <form>
            <MDBInput
              label="Название"
              type="text"
              name="title"
              onInput={changeHandler}
              value={form.name}
              required
            />

            <label htmlFor="select-type">Укажите тип хранения</label>
            <select
              name="type"
              id="select-type"
              onChange={changeHandler}
              className="form-control"
            >
              {types.map((type, i) => (
                <option value={type} key={i}>
                  {type}
                </option>
              ))}
            </select>

            <MDBInput
              label="Начальный баланс"
              type="number"
              step=".1"
              name="balance"
              onInput={changeHandler}
              value={form.balance}
              required
            />
          </form>
          {!valid && (
            <MDBAlert color="danger">
              Некоторые поля заполнены не правильно
            </MDBAlert>
          )}
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="elegant" onClick={changeToggle}>
            Отмена
          </MDBBtn>
          <MDBBtn color="primary" onClick={create}>
            Создать
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </>
  );
};
