import he from "he";

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  return `${year}-${month}-${day}`;
};

export const formatToISO8601 = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  const isoString = date.toISOString();
  const [datePart, timePart] = isoString.split("T");
  const [timeWithoutMs, msPart] = timePart.split(".");
  return `${datePart}T${timeWithoutMs}+07:00`;
};

export const stripHtml = (html) => {
  const plainText = html.replace(/<[^>]+>/g, "");
  return he.decode(plainText);
};

export const toPathname = (text) => {
  let pathname = text.toLowerCase();
  pathname = pathname.replace(/[^a-z0-9\s]/g, "");
  pathname = pathname.replace(/\s+/g, "-");
  return pathname;
};

export const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};
