import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "dayjs/plugin/updateLocale";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";
import { toast } from "sonner";

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

export function sanitizeFiles(
  event: React.ChangeEvent<any>,
  maxSize: number,
  allowedTypes: string[],
  limit?: number
) {
  const files: File[] = Array.from(event.target.files);
  const validFiles = files.filter(
    (file) => file.size <= maxSize && allowedTypes.includes(file.type)
  );

  if (limit && files.length > limit) {
    toast.warning(`${files.length} files: the limit is ${limit}`, {
      position: "top-right",
    });
    return []; // must be empty array
  }

  if (validFiles.length < files.length) {
    const invalidFiles = files.filter((file) => !validFiles.includes(file));
    invalidFiles.forEach((file) => {
      if (file.size > maxSize) {
        toast.warning(
          `The file ${file.name} exceeds the maximum allowed size of 5 MB and will be deleted.`,
          {
            position: "top-right",
          }
        );
      } else {
        toast.warning(
          `The ${file.name} file type is not allowed and will be deleted.`,
          {
            position: "top-right",
          }
        );
      }
    });
  }

  event.target.value = null;
  return validFiles;
}
