import moment from 'moment';

export function dateTimeConverter(datetime) {
    var dt = moment(datetime * 1000).format("YYYY-MM-DD hh:mm A");
    return dt;
}

export function timeConverter(datetime) {
    var dt = moment(datetime * 1000).format("hh:mm:ss A");
    return dt;
}

export function getHistory() {
    // localStorage.clear()
    const historyList = JSON.parse(localStorage.getItem('historyList'));
    return historyList === null ? [] : historyList
}
