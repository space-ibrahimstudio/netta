export const useOptions = () => {
  const limitopt = [
    { value: 20, label: "Baris per Halaman: 20" },
    { value: 100, label: "Baris per Halaman: 100" },
    { value: 500, label: "Baris per Halaman: 500" },
  ];
  const jobtypeopt = [
    { value: "1", label: "Harian" },
    { value: "2", label: "Mingguan" },
    { value: "3", label: "Bulanan" },
  ];
  const genderopt = [
    { value: "male", label: "Laki-laki" },
    { value: "female", label: "Perempuan" },
  ];
  const stafftypeopt = [
    { value: "0", label: "Pegawai Tetap" },
    { value: "1", label: "Freelancer" },
  ];
  const levelopt = [
    { value: "ADMIN", label: "Admin" },
    { value: "STAFF", label: "Pegawai" },
  ];
  const marriedstatopt = [
    { value: "kawin", label: "Kawin" },
    { value: "belum kawin", label: "Belum Kawin" },
  ];
  const usrstatopt = [
    { value: "1", label: "Aktif" },
    { value: "0", label: "Nonaktif" },
  ];
  const unitopt = [
    { value: "PCS", label: "pcs" },
    { value: "PACK", label: "pack" },
    { value: "BOTTLE", label: "bottle" },
    { value: "TUBE", label: "tube" },
    { value: "BOX", label: "box" },
    { value: "SET", label: "set" },
  ];
  const houropt = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];
  const postatopt = [
    { value: "0", label: "Open" },
    { value: "2", label: "Sent" },
    { value: "3", label: "Done" },
    { value: "4", label: "Rejected" },
  ];
  const pocstatopt = [{ value: "3", label: "Done" }];
  const reservstatopt = [
    { value: "0", label: "Pending" },
    { value: "2", label: "Reschedule" },
    { value: "3", label: "Batal" },
  ];
  const paymentstatopt = [
    { value: "0", label: "Pending" },
    { value: "3", label: "Batal" },
  ];
  const paymenttypeopt = [
    { value: "cash", label: "Cash in Store" },
    { value: "cashless", label: "Cashless (via Xendit)" },
    { value: "insurance", label: "Asuransi" },
    { value: "indodana", label: "Indodana" },
    { value: "rata", label: "RATA" },
  ];
  const orderstatopt = [
    { value: "0", label: "Pending" },
    { value: "1", label: "Paid" },
    { value: "2", label: "Canceled" },
  ];
  const reportstatopt = [
    { value: "3", label: "Semua Status" },
    { value: "0", label: "Open" },
    { value: "1", label: "Lunas" },
    { value: "2", label: "Batal" },
  ];
  const stockoutstatopt = [
    { value: "Barang Habis Pakai", label: "Barang Habis Pakai" },
    { value: "Barang Tidak Habis Pakai", label: "Barang Tidak Habis Pakai" },
  ];
  const diagnoseopt = [
    { value: "Diagnosa Utama", label: "Diagnosa Utama" },
    { value: "Diagnosa Sekunder", label: "Diagnosa Sekunder" },
    { value: "Diagnosa Komplikasi", label: "Diagnosa Komplikasi" },
  ];
  const reporttypeopt = [
    { value: "img", label: "Gambar" },
    { value: "video", label: "Video" },
    { value: "file", label: "File" },
    { value: "link", label: "Link" },
  ];
  const jobplanopt = [
    { value: "0", label: "Reguler" },
    { value: "1", label: "Project" },
  ];
  return { limitopt, jobtypeopt, genderopt, stafftypeopt, levelopt, usrstatopt, unitopt, houropt, postatopt, pocstatopt, reservstatopt, paymentstatopt, paymenttypeopt, orderstatopt, reportstatopt, stockoutstatopt, diagnoseopt, marriedstatopt, reporttypeopt, jobplanopt };
};

export const useAlias = () => {
  const paymentAlias = (status) => {
    return status === "1" ? "Exist" : status === "2" ? "Paid" : status === "3" ? "Canceled" : "Pending";
  };
  const orderAlias = (status) => {
    return status === "1" ? "Paid" : status === "2" ? "Canceled" : "Open";
  };
  const invoiceAlias = (status) => {
    return status === "1" ? "Lunas" : status === "2" ? "Dibatalkan" : "Belum Lunas";
  };
  const poAlias = (status) => {
    return status === "1" ? "Pending" : status === "2" ? "Sent" : status === "3" ? "Done" : status === "4" ? "Rejected" : "Open";
  };
  const usrstatAlias = (status) => {
    return status === "0" ? "Aktif" : "Pending";
  };
  const reservAlias = (status) => {
    return status === "1" ? "Completed" : status === "2" ? "Reschedule" : status === "3" ? "Canceled" : "Pending";
  };
  const typeAlias = (type) => {
    return type === "1" ? "Harian" : type === "2" ? "Mingguan" : "Bulanan";
  };
  const reportStatAlias = (type) => {
    return type === "1" ? "Selesai" : "Tidak Dikerjakan";
  };
  const dayAlias = (day) => {
    return day === "1" ? "Senin" : day === "2" ? "Selasa" : day === "3" ? "Rabu" : day === "4" ? "Kamis" : day === "5" ? "Jumat" : day === "6" ? "Sabtu" : "Minggu";
  };
  const jobPlanAlias = (type) => {
    return type === "1" ? "Project" : "Reguler";
  };
  return { paymentAlias, orderAlias, invoiceAlias, poAlias, usrstatAlias, reservAlias, typeAlias, reportStatAlias, dayAlias, jobPlanAlias };
};
