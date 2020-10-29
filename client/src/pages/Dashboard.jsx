import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sidebar } from '../components/Sidebar';
import { setSidebarStatus } from '../redux/actions';
import { setBodyScroll } from '../utils/utils';

export const Dashboard = ({ title = null, component }) => {
  const company = useSelector((state) => state.company.selectedCompany);
  const dispatch = useDispatch();
  const mql = window.matchMedia(`(min-width: 1440px)`);

  useEffect(() => {
    if (!mql.matches) {
      dispatch(setSidebarStatus(false));
      setBodyScroll(true);
    }
  }, [component]);

  return (
    <>
      <Sidebar companyName={company.name} />
      <div className="dashboard-field">
        {title && <h2 style={{ margin: '0 15px 10px' }}>{title}</h2>}
        {React.createElement(component)}
      </div>
    </>
  );
};
