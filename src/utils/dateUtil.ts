import moment from "moment";

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export function formatToDateTime(
  date: moment.MomentInput = undefined,
  format = DATE_TIME_FORMAT
): string {
  return moment(date).format(format);
}

export function currentTimestamp(
  date: moment.MomentInput = new Date(),
  format = DATE_TIME_FORMAT
): number {
  return moment(date, format).valueOf() / 1000;
}
export function formatDay() {
  return moment().startOf("day").format("X");
}

export function diffDay(next, pre: moment.MomentInput = undefined) {
  return moment(next).diff(moment(pre), "days");
}

export function diffSeconds(next, pre: moment.MomentInput = undefined) {
  const startTime = Math.floor(moment(pre).valueOf() / 1000);
  const endTime = Math.floor(moment(next).valueOf() / 1000);
  if (endTime > startTime) {
    return endTime - startTime;
  }

  return 0;
}

export const dateUtil = moment;
