import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setSidebarStatus } from '../redux/actions';
import { setBodyScroll } from '../utils/utils';

export const Sidebar = ({ companyName }) => {
  const sidebarStatus = useSelector((state) => state.main.sidebarStatus);
  const dispatch = useDispatch();
  const mql = window.matchMedia(`(min-width: 1440px)`);

  mql.addEventListener('change', (event) => {
    if (mql.matches) {
      setBodyScroll(true);
      dispatch(setSidebarStatus(true));
    } else {
      dispatch(setSidebarStatus(false));
    }
  });

  function sidebarToggle() {
    if (!mql.matches) {
      setBodyScroll(sidebarStatus);
      dispatch(setSidebarStatus(!sidebarStatus));
    }
  }

  return (
    <>
      <div className="sidebar__trigger" onClick={sidebarToggle}>
        <i className="fas fa-bars" />
      </div>
      <div className="sidebar">
        {sidebarStatus && (
          <div
            className="sidebar__overlay"
            onClick={sidebarToggle}
            onScroll={(e) => e.preventDefault()}
          ></div>
        )}
        <div
          className={`scrollbar scrollbar-gray sidebar__nav ${
            !sidebarStatus ? 'closed' : ''
          }`}
        >
          <div className="sidebar__company-name">{companyName}</div>
          <nav>
            <ul>
              <Link to="/analytics">
                <li>
                  <i className="far fa-chart-bar"></i> Аналитика
                </li>
              </Link>
              <Link to="/shifts">
                <li>
                  <i className="fas fa-exchange-alt" /> Смены
                </li>
              </Link>
              <li>
                <i className="fas fa-donate" /> Расходы вне смены
              </li>
              <Link to="/accounts">
                <li>
                  <i className="fas fa-money-check-alt" /> Денежные ячейки
                </li>
              </Link>
              <Link to="/categories">
                <li>
                  <i className="fas fa-th-large" /> Категории
                </li>
              </Link>
              <li>
                <i className="fas fa-boxes" /> Продукция
              </li>
              <li>
                <i className="fas fa-carrot" /> Ингредиенты
              </li>
              <li>
                <i className="far fa-id-card" /> Сотрудники
              </li>
              <li>
                <i className="fas fa-truck-loading" /> Поставки
              </li>
              <li>
                <i className="fas fa-truck" /> Поставщики
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};
