import React from 'react';
import { useSelector } from 'react-redux';
import { Sidebar } from '../components/Sidebar';

export const Dashboard = ({ title = null, component }) => {
  const company = useSelector((state) => state.company.selectedCompany);

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
