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

// Compare the ending date of things like previous jobs and education

const MONTH_MAP = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  maj: 4,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  okt: 9,
  nov: 10,
  dec: 11,
};

const parseFreeTextDate = (input = '') => {
  if (!input || typeof input !== 'string') {
    return { year: -Infinity, month: -Infinity, isNow: false };
  }

  const normalized = input.trim().toLowerCase();

  if (['nu', 'now'].includes(normalized)) {
    return { year: Infinity, month: Infinity, isNow: true };
  }

  // Extract year
  const yearMatch = normalized.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : -Infinity;

  // Extract month token
  const monthMatch = normalized.match(/[a-zåäö]{3,}/i);
  let month = -Infinity;

  if (monthMatch) {
    const key = monthMatch[0].slice(0, 3).toLowerCase();
    if (MONTH_MAP[key] !== undefined) {
      month = MONTH_MAP[key];
    }
  }

  return { year, month, isNow: false };
};

export const compareEndingDates = (a, b) => {
  const aParsed = parseFreeTextDate(a.ending_date);
  const bParsed = parseFreeTextDate(b.ending_date);

  // "Nu" / "Now" first
  if (aParsed.isNow && !bParsed.isNow) return -1;
  if (!aParsed.isNow && bParsed.isNow) return 1;

  // Compare year
  if (aParsed.year !== bParsed.year) {
    return bParsed.year - aParsed.year;
  }

  // Compare month
  return bParsed.month - aParsed.month;
};
