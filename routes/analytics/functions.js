
module.exports = {
    getMonthlyChartData(data){

        const revenueArr = [];
        const profitArr = [];
        const receiptArr = [];
        
        for (let i = 1; i <= 12; i++) {
            const month = i < 10 ? `0${i}` : `${i}`;
            if(!data[month]){
                revenueArr.push(0);
                profitArr.push(0);
                receiptArr.push(0);
            }else{
                revenueArr.push(data[month].revenue);
                profitArr.push(data[month].profit);
                receiptArr.push(data[month].receipts);
            }
        }
    
        return {revenueArr, profitArr, receiptArr};
    },
    getDailyChartData(data){

        const revenueArr = [];
        const profitArr = [];
        const receiptArr = [];
        Object.values(data).forEach(item => {
            revenueArr.push(item.revenue);
            profitArr.push(item.profit);
            receiptArr.push(item.receipts);
        });
    
        return {labels: Object.keys(data).map(key => `${key} число`), revenueArr, profitArr, receiptArr};
    },
    async generateDataByShifts(workShifts, dateSplitIndex){

        const data = {};
        for (const shift of workShifts) {
            
            const dateValue = shift.date.split('-')[dateSplitIndex];
            const reports = await shift.getReports();
            const revenue = parseFloat(shift.revenue);
            let costAmount = 0;
    
            for (const report of reports) {
                const product = await report.getProduct();
                costAmount += product.costPrice * report.quantity;
            }
    
            if(typeof data[dateValue] !== 'undefined'){
                data[dateValue].revenue += revenue;
                data[dateValue].profit += revenue - costAmount;
                data[dateValue].receipts += shift.receipts;
            }
            else{
                data[dateValue] = {revenue, profit: revenue - costAmount, receipts: shift.receipts};
            }
        }
    
        return data;
    }
};

// export function getMonthlyChartData(data){

//     const revenueArr = [];
//     const profitArr = [];
//     const receiptArr = [];
    
//     for (let i = 1; i <= 12; i++) {
//         const month = i < 10 ? `0${i}` : `${i}`;
//         if(!data[month]){
//             revenueArr.push(0);
//             profitArr.push(0);
//             receiptArr.push(0);
//         }else{
//             revenueArr.push(data[month].revenue);
//             profitArr.push(data[month].profit);
//             receiptArr.push(data[month].receipts);
//         }
//     }

//     return {revenueArr, profitArr, receiptArr};
// }

// export function getDailyChartData(data){

//     const revenueArr = [];
//     const profitArr = [];
//     const receiptArr = [];
//     Object.values(data).forEach(item => {
//         revenueArr.push(item.revenue);
//         profitArr.push(item.profit);
//         receiptArr.push(item.receipts);
//     });

//     return {labels: Object.keys(data).map(key => `${key} число`), revenueArr, profitArr, receiptArr};
// }

// export async function generateDataByShifts(workShifts, dateSplitIndex){

//     const data = {};
//     for (const shift of workShifts) {
        
//         const dateValue = shift.date.split('-')[dateSplitIndex];
//         const reports = await shift.getReports();
//         const revenue = parseFloat(shift.revenue);
//         let costAmount = 0;

//         for (const report of reports) {
//             const product = await report.getProduct();
//             costAmount += product.costPrice * report.quantity;
//         }

//         if(typeof data[dateValue] !== 'undefined'){
//             data[dateValue].revenue += revenue;
//             data[dateValue].profit += revenue - costAmount;
//             data[dateValue].receipts += shift.receipts;
//         }
//         else{
//             data[dateValue] = {revenue, profit: revenue - costAmount, receipts: shift.receipts};
//         }
//     }

//     return data;
// }