
export function createErrorObject(error){
    return {
        message: error.response.data.message,
        status: error.response.status
    };
}

export function getDate(date = null){

    const localDate = date ? new Date(date) : new Date();
    const month = localDate.getMonth() + 1;
    const day = localDate.getDate();
    return {
        day: day < 10 ? ('0' + day) : day,
        month: month < 10 ? ('0' + month) : month,
        year: localDate.getFullYear(),
        hours: localDate.getHours(),
        minutes: localDate.getMinutes(),
        seconds: localDate.getSeconds(),
    };
}

export function generateHeaders(token = null){
    const head = {headers: {'Content-Type': 'application/json'}};
    if(token){
        head.headers.Authorization = `Bearer ${token}`;
    }
    return head;
}