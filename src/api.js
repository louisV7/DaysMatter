export function history(date,key){
    return `http://v.juhe.cn/todayOnhistory/queryEvent.php?key=${key}&date=${date}`;
}
export function calendar(year,key){
    return `http://v.juhe.cn/calendar/year?year=${year}&key=${key}`;
}