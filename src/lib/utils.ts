import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "dayjs/plugin/updateLocale";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";

dayjs.locale("en");
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(utc);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "now",
    m: "now",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years",
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDate(date: any) {
  const formatDate = dayjs(date).format("MMMM D, YYYY"); // use locale globally

  return formatDate;
}

export function relativeDate(date: any) {
  const formatDate = dayjs().to(dayjs(date));

  // const days = dayjs().to(dayjs(date).format("DD"));

  return formatDate;
}

export function getRandomColor() {
  const colors = [
    "#ffe1cc",
    "#d4f6ed",
    "#e3dbfa",
    "#dff3fe",
    "#fbe2f4",
    "#eceff4",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
