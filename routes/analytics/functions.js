const getDate = require('../../utils/functions');

module.exports = {
  getMonthlyChartData(data) {
    const revenueArr = [];
    const profitArr = [];
    const receiptArr = [];

    for (let month = 1; month <= 12; month++) {
      revenueArr.push(data[month] ? data[month].revenue : 0);
      profitArr.push(data[month] ? data[month].profit : 0);
      receiptArr.push(data[month] ? data[month].receipts : 0);
    }

    return { revenueArr, profitArr, receiptArr };
  },
  getDailyChartData(data) {
    const revenueArr = [];
    const profitArr = [];
    const receiptArr = [];
    Object.values(data).forEach((item) => {
      revenueArr.push(item.revenue);
      profitArr.push(item.profit);
      receiptArr.push(item.receipts);
    });

    return {
      labels: Object.keys(data).map((key) => `${key} число`),
      revenueArr,
      profitArr,
      receiptArr,
    };
  },

  async generateDataByShifts(workShifts, dateType) {
    const data = {};
    for (const shift of workShifts) {
      const dateValue = getDate(shift.date)[dateType];

      const reports = await shift.getReports();
      const revenue = parseFloat(shift.revenue);
      let costAmount = 0;

      for (const report of reports) {
        const product = await report.getProduct();
        costAmount += product.costPrice * report.quantity;
      }

      if (typeof data[dateValue] !== 'undefined') {
        data[dateValue].revenue += revenue;
        data[dateValue].profit += revenue - costAmount;
        data[dateValue].receipts += shift.receipts;
      } else {
        data[dateValue] = {
          revenue,
          profit: revenue - costAmount,
          receipts: shift.receipts,
        };
      }
    }
    return data;
  },
};
