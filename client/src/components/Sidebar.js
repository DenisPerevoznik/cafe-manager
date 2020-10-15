import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const Sidebar = ({companyName}) => {

    const [toggle, setToggle] = useState(true);
    const mql = window.matchMedia(`(min-width: 1440px)`);

    useEffect(() => {
        if(!mql.matches){
            document.body.style.overflow = 'hidden';
        }
    }, [])

    mql.addEventListener('change', (event) => {

        if(mql.matches){
            document.body.style.overflow = 'auto';
            setToggle(true);
        }
        else{
            setToggle(false);
        }
    });

    function changeToggle(){
        
        if(!mql.matches){
            document.body.style.overflow = !toggle ? 'hidden' : '';
            setToggle(!toggle);
        }
    }

    return (
        <>
        
            <div className="sidebar__trigger" onClick={changeToggle}>
                <i className="fas fa-bars"/>
            </div>
            <div className="sidebar">
                {toggle && <div className="sidebar__overlay" onClick={changeToggle}
                    onScroll={e => e.preventDefault()}></div>}
                <div className={`scrollbar scrollbar-gray sidebar__nav ${!toggle ? 'closed' : ''}`}>
                    <div className="sidebar__company-name">
                        {companyName}
                    </div>
                    <nav>
                        <ul>
                            <Link to="/analytics" onClick={changeToggle}>
                                <li><i className="far fa-chart-bar"></i> Аналитика</li>
                            </Link>
                            <Link to='/shifts' onClick={changeToggle}>
                                <li><i className="fas fa-exchange-alt"/> Смены</li>
                            </Link>
                            <li><i className="fas fa-donate"/> Расходы вне смены</li>
                            <li><i className="fas fa-money-check-alt"/> Счета</li>
                            <Link to="/categories" onClick={changeToggle}>
                                <li><i className="fas fa-th-large"/> Категории</li>
                            </Link>
                            <li><i className="fas fa-boxes"/> Продукция</li>
                            <li><i className="fas fa-carrot"/> Ингредиенты</li>
                            <li><i className="far fa-id-card"/> Сотрудники</li>
                            <li><i className="fas fa-truck-loading"/> Поставки</li>
                            <li><i className="fas fa-truck"/> Поставщики</li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}