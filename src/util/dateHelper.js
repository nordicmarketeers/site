// Convert a date formatted as 'dd-mm-yyyy' into unix
export const dateToUnix = date => {
  const [day, month, year] = date.split('-');

  const newDate = new Date(year, month - 1, day);

  // Unix timestamp (seconds)
  return Math.floor(newDate.getTime() / 1000);
};

// Convert a unix timestamp (seconds) into a date formatted as 'dd-mm-yyyy'
export const unixToDate = unix => {
  const date = new Date(unix * 1000);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
