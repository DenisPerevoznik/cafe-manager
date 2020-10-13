import React, { useContext, useEffect, useState } from 'react';
import { hryvniaSign, years } from '../utils/constants';
import { generateHeaders, getDate } from '../utils/utils';
import {Line, Pie, Bar} from 'react-chartjs-2';
import { AuthContext } from '../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { createDailyChart } from '../utils/charts/dailyChart';
import {getDailyChartData, getFinanceChartData, getMonthlyChartData} from '../redux/charts/actions';
import { createMonthlyChart } from '../utils/charts/monthlyChart';
import { MDBListGroup, MDBListGroupItem } from 'mdbreact';
import Axios from 'axios';
import { createFinanceChart } from '../utils/charts/financeChart';

export const Analytics = () => {

    const dailyChartData = useSelector(state => state.charts.dailyChartData);
    const monthlyChartData = useSelector(state => state.charts.monthlyChartData);
    const financeChartData = useSelector(state => state.charts.financeChartData);
    const [nowDayData, setNowDayData] = useState({revenue: 0, profit: 0, receipts: 0});
    const company = useSelector(state => state.company.selectedCompany);
    const dispatch = useDispatch();
    const auth = useContext(AuthContext);
    const nowDate = getDate();
    const [selectedMonth, setSelectedMonth] = useState(`${nowDate.year}-${nowDate.month}`);
    const [selectedYear, setSelectedYear] = useState(nowDate.year);

    useEffect(() => {
        dispatch(getFinanceChartData(auth.token, company.id));
    }, [financeChartData]);

    useEffect(() => {
        Axios.post('/api/analytics/now', {companyId: company.id}, generateHeaders(auth.token))
        .then(res => {
            setNowDayData(res.data);
        });
    }, []);

    useEffect(() => {
        dispatch(getDailyChartData(selectedMonth, auth.token, company.id));
    }, [selectedMonth])

    useEffect(() => {
        dispatch(getMonthlyChartData(selectedYear, auth.token, company.id));
    }, [selectedYear]);

    function changeDateHandler(event){
        setSelectedMonth(event.target.value);
    }

    function changeYearHandler(event){
        setSelectedYear(event.target.value);
    }

    return (
        <div className="container-fluid p-4">
            <div className="row">
                <div className="col-md-4 col-lg-3 col-sm-12">
                    <Card>
                        <div>
                            <h4 className="card-title">Сегодня</h4>
                            <p className="card-subtitle mb-2" style={cardData}>
                                {`${nowDate.day}.${nowDate.month}.${nowDate.year}`}
                            </p>
                        </div>
                        <i className="material-icons" style={cardIcon}>event</i>
                    </Card>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12">
                    <Card>
                        <div>
                            <h4 className="card-title">Выручка</h4>
                            <p className="card-subtitle mb-2" style={cardData}>{hryvniaSign} {nowDayData.revenue}</p>
                        </div>
                        <i className="material-icons" style={cardIcon}>monetization_on</i>
                    </Card>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12">
                    <Card>
                        <div>
                            <h4 className="card-title">Марж. прибыль</h4>
                            <p className="card-subtitle mb-2" style={cardData}>{hryvniaSign} {nowDayData.profit}</p>
                        </div>
                        <i className="material-icons" style={cardIcon}>account_balance_wallet</i>
                    </Card>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12">
                    <Card>
                        <div>
                            <h4 className="card-title">Чеки</h4>
                            <p className="card-subtitle mb-2" style={cardData}>{nowDayData.receipts} шт.</p>
                        </div>
                        <i className="material-icons" style={cardIcon}>receipt_long</i>
                    </Card>
                </div>
            </div>
            <hr/>
            {/* chart */}
            <div className="row">
                <h4>Отчет за:</h4>
                <div className="col-md-4 col-lg-3 col-sm-6">
                    <input type="month" style={{marginLeft: '1rem'}} onChange={changeDateHandler}
                        className="form-control" value={selectedMonth}/>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-8 col-lg-9 col-sm-12">
                    <div className="card">
                        <span style={chartTitleStyles}>Ежедневный отчет</span>
                        <Line data={createDailyChart(dailyChartData)} options={{responsive: true}}/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12">
                    <div className="card pb-2">
                        <span style={chartTitleStyles}>Финансы</span>
                        <div style={{height: '17.5rem'}}>
                            <Pie data={createFinanceChart(financeChartData)} options={{maintainAspectRatio: false}}/>
                        </div>
                        <div className="d-flex justify-content-start flex-column" style={{padding: '17px', fontSize: '20px'}}>
                            <span style={{color: '#2ac02a', borderBottom: '1px solid #00000021', ...spanPieStyles}}>
                                <i style={{color: '#2196F3', marginRight: '1rem'}} className="fas fa-chart-pie"/> +20 % <i style={{right: '2rem'}} className="fas fa-caret-up"/></span>
                            <span style={{color: '#f31313', borderBottom: '1px solid #00000021', ...spanPieStyles}}>
                                <i style={{color: '#F44336', marginRight: '1rem'}} className="fas fa-chart-pie"/> -12 % <i className="fas fa-caret-down"/></span>
                            <span style={{color: '#2ac02a', ...spanPieStyles}}>
                                <i style={{color: '#FFC107', marginRight: '1rem'}} className="fas fa-chart-pie"/> +14 % <i className="fas fa-caret-up"/></span>
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
            <div className="row mt-4">
                <h4>Укажите год:</h4>
                <div className="col-md-4 col-lg-3 col-sm-6">
                    <select className="form-control" onChange={changeYearHandler}>
                        {years.map(y => <option value={y} selected={y === selectedYear}>{y}</option>)}
                    </select>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-12 col-lg-9 col-sm-12">
                    <div className="card">
                        <span style={chartTitleStyles}>Ежемесячный отчет</span>
                        <Bar data={createMonthlyChart(monthlyChartData)}/>
                    </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12">
                    <div className="card" style={employeeCard}>
                        <h5 className="m-4">Рейтинг сотрудников в этом году</h5>
                        <MDBListGroup>
                            <MDBListGroupItem><i className="fas fa-user-tie mr-2" style={{color: "gold"}}/>Маша <i className="fas fa-arrow-alt-circle-right"/> 1300 продаж</MDBListGroupItem>
                            <MDBListGroupItem><i className="fas fa-user-tie mr-2" style={{color: "lightgray"}}/>Виталик | 1125 продаж</MDBListGroupItem>
                            <MDBListGroupItem><i className="fas fa-user-tie mr-2" style={{color: "#d37f29"}}/>Алина | 1010 продаж</MDBListGroupItem>
                            <MDBListGroupItem><i className="fas fa-user-tie mr-2"/>Настя | 950 продаж</MDBListGroupItem>
                            <MDBListGroupItem><i className="fas fa-user-tie mr-2"/>Катя | 948 продаж</MDBListGroupItem>
                        </MDBListGroup>
                    </div>
                </div>
            </div>
        </div>
    );
}

const employeeCard = {
    maxHeight: '32rem',
    overflowY: 'auto'
};

const spanPieStyles = {
    padding: '5px'
};

const chartTitleStyles = {
    fontSize: "1.0625rem",
    margin: "15px 20px"
}

const cardData = {
    fontSize: "19px",
}

const cardIcon = {
    fontSize: '40px',
    color: '#1976d2'
}

const Card = (props) => {
    return (
        <div className="card" style={{height: '120px', marginBottom: '1rem'}}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    {props.children}
                </div>
            </div>
        </div>
    );
}