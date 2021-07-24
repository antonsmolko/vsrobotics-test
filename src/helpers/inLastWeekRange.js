import moment from 'moment'

const daysPerWeek = 7;

export default (date) => moment().diff(moment(date), 'days') <= daysPerWeek;
