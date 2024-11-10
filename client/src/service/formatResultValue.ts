import { ResultType } from "../type/enums";

function formatResultValue(
  resultValue: number,
  resultType: ResultType
): string {
  if (resultType === ResultType.TIME) {
    const totalMilliseconds = resultValue;
    const hours = Math.floor(totalMilliseconds / 3600000);
    const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    const hundredths = Math.floor((totalMilliseconds % 1000) / 10);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
  } else if (resultType === ResultType.DISTANCE) {
    const meters = Math.floor(resultValue);
    const centimeters = Math.round((resultValue - meters) * 100);

    return `${meters} m ${centimeters} cm`;
  }

  return resultValue.toString();
}

function parseTimeToMilliseconds(timeString: string): number {
  const [hours, minutes, seconds] = timeString.split(":");
  const [sec, hundredths] = (seconds || "0").split(".");

  const totalMilliseconds =
    parseInt(hours || "0", 10) * 3600000 +
    parseInt(minutes || "0", 10) * 60000 +
    parseInt(sec || "0", 10) * 1000 +
    parseInt(hundredths || "0", 10) * 10;

  return totalMilliseconds;
}

export { formatResultValue, parseTimeToMilliseconds };
