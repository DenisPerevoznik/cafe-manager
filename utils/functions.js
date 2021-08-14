module.exports = function getDate(date = null) {
  const localDate = date ? new Date(date) : new Date();
  const month = localDate.getMonth() + 1;
  const day = localDate.getDate();
  return {
    day: day,
    month: month,
    year: localDate.getFullYear(),
    hours: localDate.getHours(),
    minutes: localDate.getMinutes(),
    seconds: localDate.getSeconds(),
    dbValue: date,
    stringFullDate: `${day < 10 ? '0' + day : day}.${
      month < 10 ? '0' + month : month
    }.${localDate.getFullYear()}`,
  };
};
