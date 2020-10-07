import React, { useContext, useEffect, useState } from 'react';
import { hryvniaSign } from '../utils/constants';
import { getDate } from '../utils/utils';
import {Line, Doughnut, Bar} from 'react-chartjs-2';
import Axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export const Analytics = () => {

    /** ЭТА СТРАНИЦА В РАЗРАБОТКЕ (ВСЕ ЧТО НИЖЕ - ЭТО ТЕСТИРОВАНИЕ) */
    
    const nowDate = getDate();
    const [chart, setChart] = useState({});
    const [pie, setPie] = useState({});
    const [bar, setBar] = useState({});
    const auth = useContext(AuthContext);

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

    function chartInit(){
        setChart({
            labels: ['Пн, 21', "Вт, 22", "Ср, 23", "Чт, 24", "Пт, 25", '26', '27', '26', '27', '27',
            'Пн, 21', "Вт, 22", "Ср, 23", "Чт, 24", "Пт, 25", '26', '27', '26', '27', '27',
            'Пн, 21', "Вт, 22", "Ср, 23", "Чт, 24", "Пт, 25", '26', '27', '26', '27', '27'],
            datasets: [
                {
                    label: "Выручка",
                    data: [1500, 1268, 1020, 2100, 1954, 1500, 1268, 1020, 2100, 1954, 1500, 1268, 1020, 2100, 1954, 1500, 1268, 1020, 2100, 1954, 1500, 1268, 1020, 2100, 1954, 1500, 1268, 1020, 2100, 1954],
                    backgroundColor: ['rgba(33, 150, 243, 0.05)'],
                    borderWidth: 4,
                    borderColor: ['rgb(33, 150, 243)'],
                    pointBorderColor: 'rgb(33, 150, 243)',
                    pointBorderWidth: 2,
                    pointerHitRadius: 2
                },
                {
                    label: "Марж. прибыль",
                    data: [1000, 700, 570, 1600, 1454, 1000, 700, 570, 1600, 1454, 1000, 950, 1570, 1600, 1454, 1070, 700, 570, 1600, 1454, 1040, 700, 570, 160, 1054, 1000, 70, 570, 2000, 1454],
                    backgroundColor: 'rgba(28, 56, 83, 0.05)',
                    borderWidth: 3,
                    borderColor: 'rgba(28, 56, 83, 0.9)',
                    pointBorderColor: 'rgb(28, 56, 83)',
                    borderDash: [20, 5],
                    pointBorderWidth: 2,
                    pointerHitRadius: 2
                },
                {
                    label: "Посещаемость",
                    data: [50, 70, 60, 54, 32, 50, 70, 60, 54, 32, 50, 70, 60, 54, 32, 50, 70, 60, 54, 32, 50, 70, 60, 54, 32, 50, 70, 60, 54, 32],
                    backgroundColor: ['rgba(255, 179, 0, 0.05)'],
                    borderWidth: 3,
                    borderColor: 'rgba(255, 179, 0, 0.9)',
                    pointBorderColor: 'rgb(255, 179, 0)',
                    pointBorderWidth: 2,
                    pointerHitRadius: 2
                }
            ]
        });
    }
    useEffect(() => {
        chartInit();
        pieInit();
        barInit();

        test();
    }, []);

    async function test(){

        const data = await Axios.post('/api/analytics/daily', {date: '2020-10-07', companyId: 1}, 
            {headers: {'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}`}});
        
        console.log('axios data', data);
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
                    <input type="month" style={{marginLeft: '1rem'}} 
                        className="form-control" value="2020-10"/>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-8 col-lg-8 col-sm-12">
                    <div className="card">
                        <span style={chartTitleStyles}>Ежедневный отчет</span>
                        <Line data={chart} options={{responsive: true}}/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12">
                    <div className="card" style={{height: '100%'}}>
                        <span style={chartTitleStyles}>Финансы</span>
                        <div style={{height: '17.5rem'}}>
                            <Doughnut data={pie} options={{cutoutPercentage: 67, maintainAspectRatio: false}}/>
                        </div>
                        <div style={{padding: '17px'}}>
                            Text footer
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-9 col-lg-9 col-sm-12">
                    <div className="card">
                        <span style={chartTitleStyles}>Ежемесячный отчет</span>
                        <Bar data={bar}/>
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