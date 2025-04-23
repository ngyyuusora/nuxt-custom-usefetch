import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export function formatToDateTime(
  date: string | number | dayjs.Dayjs | undefined = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return dayjs(date).format(format);
}

export function formatDateTimeIntl(timestamp: number) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(timestamp).toLocaleDateString('cmn-Hans', options);
}

export function formatToDate(
  date: dayjs.Dayjs | undefined = undefined,
  format = DATE_FORMAT,
): string {
  return dayjs(date).format(format);
}

export const dateUtil = dayjs;

// tSec < 60, show tSec with padStart: 0:00, 0:05,
// tSec >= 60, show tMin(no padStart):(tSec with padStart): 13:01, 1145:01
export function formatMiliSec2mmss(tSec: string | number): string {
  let tSecNumber: number;
  if (typeof tSec === 'string') {
    tSecNumber = parseInt(tSec, 10);
    if (Number.isNaN(tSecNumber)) {
      throw new Error(`tSec "${tSec}" cannot be converted to a number.`);
    }
  } else {
    tSecNumber = tSec;
  }
  // convert to second
  tSecNumber = Math.floor(tSecNumber / 1000);
  // calc minute and second
  const tMin = Math.floor(tSecNumber / 60);
  const tRemainingSec = tSecNumber % 60;
  return `${tMin}:${tRemainingSec.toString().padStart(2, '0')}`;
}
