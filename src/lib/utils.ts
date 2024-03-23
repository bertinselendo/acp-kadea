import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale("en");
dayjs.extend(relativeTime);

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
