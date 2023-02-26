export const formatRp = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export const dateFormat = (dateStr) => {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let date = new Date(dateStr);

  let dayName = days[date.getDay()];
  let dayMonth = date.getDate();
  let monthName = month[date.getMonth()];
  let year = date.getFullYear();
  return `${dayName}, ${dayMonth} ${monthName} ${year}`;
};
