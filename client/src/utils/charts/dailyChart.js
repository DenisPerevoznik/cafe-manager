
export const getDailyChart = (reports) => {

    /** Эта функция еще в разработке */

    return {
        labels: [],
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
    }
}