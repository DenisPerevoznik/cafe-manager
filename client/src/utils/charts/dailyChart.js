
export const createDailyChart = (dailyChartData) => {

    return {
        labels: dailyChartData.labels,
        datasets: [
            {
                label: "Выручка",
                data: dailyChartData.revenueArr,
                backgroundColor: ['rgba(33, 150, 243, 0.05)'],
                borderWidth: 4,
                borderColor: ['rgb(33, 150, 243)'],
                pointBorderColor: 'rgb(33, 150, 243)',
                pointBorderWidth: 2,
                pointerHitRadius: 2
            },
            {
                label: "Марж. прибыль",
                data: dailyChartData.profitArr,
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
                data: dailyChartData.receiptArr,
                backgroundColor: ['rgba(255, 179, 0, 0.05)'],
                borderWidth: 3,
                borderColor: 'rgba(255, 179, 0, 0.9)',
                pointBorderColor: 'rgb(255, 179, 0)',
                pointBorderWidth: 2,
                pointerHitRadius: 2
            }
        ]
    }
}