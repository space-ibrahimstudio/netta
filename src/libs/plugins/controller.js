import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

/**
 * Reusable function to export any data structure to Excel.
 * @param {Array} data - The input data (array of objects).
 * @param {Function} rowMapper - A function that transforms each data object into a flat row.
 * @param {string} filename - The name of the Excel file to export.
 */

export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  return `${year}-${month}-${day}`;
}

export function exportToExcel(jsonData, sheetName, fileName) {
  const worksheet = XLSX.utils.json_to_sheet(jsonData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), `${fileName}.xlsx`);
}

export function inputValidator(formData, requiredFields) {
  const errors = {};
  const checkRequired = (value, field, path) => {
    if (!value) {
      errors[path.join(".")] = `The ${field} field is required`;
    }
  };
  const validateField = (data, field, path = []) => {
    if (Array.isArray(data[field])) {
      data[field].forEach((item, index) => {
        Object.keys(item).forEach((key) => {
          if (requiredFields.includes(`${field}.${key}`)) {
            checkRequired(item[key], key, [...path, field, index, key]);
          }
        });
      });
    } else {
      checkRequired(data[field], field, [...path, field]);
    }
  };
  requiredFields.forEach((field) => {
    const [mainField, ...nestedField] = field.split(".");
    if (nestedField.length > 0) {
      validateField(formData, mainField);
    } else {
      checkRequired(formData[mainField], mainField, [mainField]);
    }
  });
  return errors;
}

export function validateForm(inputSchema, errorSchema, formData, setErrors) {
  let valid = true;
  const newerrors = { ...errorSchema };
  Object.keys(inputSchema).forEach((field) => {
    if (Array.isArray(formData[field])) {
      const fielderrors = [];
      formData[field].forEach((item, index) => {
        const errors = {};
        Object.keys(item).forEach((key) => {
          if (!item[key].trim()) {
            errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
            valid = false;
          }
        });
        fielderrors[index] = errors;
      });
      newerrors[field] = fielderrors;
    } else {
      if (!formData[field].trim()) {
        newerrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        valid = false;
      }
    }
  });
  setErrors(newerrors);
  return valid;
}

export function emailValidator(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

export function getNormalPhoneNumber(number) {
  let normalizedNumber = number.replace(/[\s-]/g, "");
  if (normalizedNumber.startsWith("+")) {
    normalizedNumber = normalizedNumber.slice(1);
  }
  if (!normalizedNumber.startsWith("62")) {
    normalizedNumber = `62${normalizedNumber}`;
  }
  return normalizedNumber;
}

export function generateExcel(data, rowMapper, basename = "WEB EXPORT") {
  const sanitized_filename = basename.replace(/\s+/g, "_");

  const now = new Date();
  const localDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");
  const hours = String(localDate.getHours()).padStart(2, "0");
  const minutes = String(localDate.getMinutes()).padStart(2, "0");
  const seconds = String(localDate.getSeconds()).padStart(2, "0");

  const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;
  const filename = `${sanitized_filename}_${timestamp}.xlsx`;

  const exportData = data.flatMap((item, index) => rowMapper(item, index));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, filename);
}
