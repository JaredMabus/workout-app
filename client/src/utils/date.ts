export function formatDT(sourceDate: Date) {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    weekday: "short",
    day: "numeric",
    year: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
  };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(sourceDate));
}

/**
 * Calcs difference, in days, between two string ISO dates.
 * @param startDateString
 * @param endDateString
 * @return if >= 0 "Today", elif between 1 and 2 days "Yesterday", else abs value of days
 */
export function dateDiff(
  startDate: Date | string | number | any,
  endDate: Date | string | number | any
): string | undefined {
  try {
    if (typeof startDate === "undefined" || typeof endDate === "undefined") {
      return "";
    }
    if (typeof startDate === "string" && typeof endDate === "string") {
      startDate = +new Date(startDate.slice(0, -1));
      endDate = +new Date(endDate.slice(0, -1));
    }

    const diffTime = Math.abs(startDate - endDate);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays >= 0 && diffDays < 1) {
      return `Today`;
    } else if (diffDays >= 1 && diffDays <= 2) {
      return `Yesterday`;
    } else {
      return `${Math.ceil(diffDays)} days`;
    }
  } catch (err) {
    console.log(err);
  }
}

type WeekDayNumber = "0" | "1" | "2" | "3" | "4" | "5" | "6";

export const dayOfTheWeekToString = (wd: WeekDayNumber) => {
  if (wd === "0") {
    return "Sunday";
  } else if (wd === "1") {
    return "Monday";
  } else if (wd === "2") {
    return "Tuesday";
  } else if (wd === "3") {
    return "Wednesday";
  } else if (wd === "4") {
    return "Thursday";
  } else if (wd === "5") {
    return "Friday";
  } else if (wd === "6") {
    return "Saturday";
  }
};
