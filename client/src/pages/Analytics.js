import React, { useContext, useEffect, useState } from 'react';
import { hryvniaSign, years } from '../utils/constants';
import { getDate } from '../utils/utils';
import {Line, Pie, Bar} from 'react-chartjs-2';
import { AuthContext } from '../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { createDailyChart } from '../utils/charts/dailyChart';
import {getDeilyChartData} from '../redux/charts/actions';

export const Analytics = () => {

    /** ЭТА СТРАНИЦА В РАЗРАБОТКЕ (НЕКОТОРЫЕ ЭЛЕМЕНТЫ НИЖЕ - ЭТО ТЕСТИРОВАНИЕ) */

    const [pie, setPie] = useState({});
    const [bar, setBar] = useState({});
    const dailyChartData = useSelector(state => state.charts.dailyChartData);
    const company = useSelector(state => state.company.selectedCompany);
    const dispatch = useDispatch();
    const auth = useContext(AuthContext);
    const nowDate = getDate();
    const [selectedMonth, setSelectedMonth] = useState(`${nowDate.year}-${nowDate.month}`);

    function pieInit(){
        setPie({
            labels: ['Сумма доходов', "Сумма расходов", "Выплата работникам"],
            datasets: [
                {
                    data: [30334, 6060, 10000],
                    backgroundColor: ['rgb(33, 150, 243)', '#F44336', '#ffc107'],
                    borderWidth: 4
                }
            ]
        });
    }

    function barInit(){

        setBar({
            labels: ['Январь', "Февраль", "Март", "Апрель", "Май", 'Июнь', 'Июль', 'Август',
            'Сентябрь', 'Октябрь', 'Ноябрь', "Декабрь"],
            datasets: [
                {
                    label: "Выручка",
                    data: [1500, 1268, 1020, 2100, 1954, 1500, 1268, 1020, 2100, 1954, 1500, 1268],
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    borderWidth: 4,
                    borderColor: 'rgb(33, 150, 243)',
                    curvature: 1
                },
                {
                    label: "Марж. прибыль",
                    data: [1000, 700, 570, 1600, 1454, 1000, 700, 570, 1600, 1454, 1000, 950],
                    backgroundColor: 'rgba(28, 56, 83, 0.1)',
                    borderWidth: 3,
                    borderColor: 'rgba(28, 56, 83, 0.9)',
                    borderDash: [20, 5],
                },
                {
                    label: "Посещаемость",
                    data: [50, 70, 60, 54, 32, 50, 70, 60, 54, 32, 50, 70],
                    backgroundColor: 'rgba(255, 179, 0, 0.05)',
                    borderWidth: 3,
                    borderColor: 'rgba(255, 179, 0, 0.9)',
                }
            ]
        });
    }

    useEffect(() => {
        pieInit();
        barInit();
    }, []);

    useEffect(() => {
        dispatch(getDeilyChartData(selectedMonth, auth.token, company.id));
    }, [selectedMonth])

    function changeDateHandler(event){
        setSelectedMonth(event.target.value);
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
                            <p className="card-subtitle mb-2" style={cardData}>{hryvniaSign} 0</p>
                        </div>
                        <i className="material-icons" style={cardIcon}>monetization_on</i>
                    </Card>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12">
                    <Card>
                        <div>
                            <h4 className="card-title">Марж. прибыль</h4>
                            <p className="card-subtitle mb-2" style={cardData}>{hryvniaSign} 0</p>
                        </div>
                        <i className="material-icons" style={cardIcon}>account_balance_wallet</i>
                    </Card>
                </div>
                <div className="col-md-4 col-lg-3 col-sm-12">
                    <Card>
                        <div>
                            <h4 className="card-title">Чеки</h4>
                            <p className="card-subtitle mb-2" style={cardData}>0 шт.</p>
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
                <div className="col-md-8 col-lg-8 col-sm-12">
                    <div className="card">
                        <span style={chartTitleStyles}>Ежедневный отчет</span>
                        <Line data={createDailyChart(dailyChartData)} options={{responsive: true}}/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12">
                    <div className="card" style={{height: '100%'}}>
                        <span style={chartTitleStyles}>Финансы</span>
                        <div style={{height: '17.5rem'}}>
                            <Pie data={pie} options={{maintainAspectRatio: false}}/>
                        </div>
                        <div style={{padding: '17px'}}>
                            Text footer
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
            <div className="row mt-4">
                <h4>Укажите год:</h4>
                <div className="col-md-4 col-lg-3 col-sm-6">
                    <select className="form-control">
                        {years.map(y => <option>{y}</option>)}
                    </select>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-12 col-lg-9 col-sm-12">
                    <div className="card">
                        <span style={chartTitleStyles}>Ежемесячный отчет</span>
                        <Bar data={bar}/>
                    </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12">
                    <div className="card">
                        <h5>Сотрудники работавшие в этом году</h5>
                    </div>
                </div>
            </div>
        </div>
    );
}

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