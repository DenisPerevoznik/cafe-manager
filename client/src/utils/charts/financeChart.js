
export const createFinanceChart = (financeChartData) => {

    return {
        labels: ['Сумма доходов', "Сумма расходов", "Выплата работникам", "Средний чек"],
        datasets: [
            {
                data: [30334, 6060, 10000, 1150],
                backgroundColor: ['rgb(33, 150, 243)', '#F44336', '#ffc107', '#EEEEEE'],
                borderWidth: 4
            }
        ]
    }
}