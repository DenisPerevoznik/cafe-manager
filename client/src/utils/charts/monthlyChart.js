
export const createMonthlyChart = (monthlyChartData)=> {

    return {
        labels: ['Январь', "Февраль", "Март", "Апрель", "Май", 'Июнь', 'Июль', 'Август',
        'Сентябрь', 'Октябрь', 'Ноябрь', "Декабрь"],
        datasets: [
            {
                label: "Выручка",
                data: monthlyChartData.revenueArr,
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                borderWidth: 4,
                borderColor: 'rgb(33, 150, 243)',
                curvature: 1
            },
            {
                label: "Марж. прибыль",
                data: monthlyChartData.profitArr,
                backgroundColor: 'rgba(28, 56, 83, 0.1)',
                borderWidth: 3,
                borderColor: 'rgba(28, 56, 83, 0.9)',
                borderDash: [20, 5],
            },
            {
                label: "Посещаемость",
                data: monthlyChartData.receiptArr,
                backgroundColor: 'rgba(255, 179, 0, 0.05)',
                borderWidth: 3,
                borderColor: 'rgba(255, 179, 0, 0.9)',
            }
        ]
    }
}