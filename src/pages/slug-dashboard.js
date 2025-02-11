import React, { Fragment, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useContent, useFormat, useDevmode } from "@ibrahimstudio/react";
import { Input } from "@ibrahimstudio/input";
import { Select } from "@ibrahimstudio/select";
import { Textarea } from "@ibrahimstudio/textarea";
import { Button } from "@ibrahimstudio/button";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useAuth } from "../libs/securities/auth";
import { useApi } from "../libs/apis/office";
import { useNotifications } from "../components/feedbacks/context/notifications-context";
import { useSearch } from "../libs/plugins/handler";
import { getNestedValue, inputValidator } from "../libs/plugins/controller";
import { inputSchema, errorSchema } from "../libs/sources/common";
import { useOptions, useAlias } from "../libs/plugins/helper";
import Pages from "../components/frames/pages";
import { DashboardContainer, DashboardHead, DashboardToolbar, DashboardTool, DashboardBody } from "./overview-dashboard";
import TabGroup from "../components/input-controls/tab-group";
import TabSwitch from "../components/input-controls/tab-switch";
import Table, { THead, TBody, TR, TH, TD } from "../components/contents/table";
import { SubmitForm } from "../components/input-controls/forms";
import Fieldset, { ToggleSwitch } from "../components/input-controls/inputs";
import { Search, Plus, NewTrash, Filter } from "../components/contents/icons";
import Pagination from "../components/navigations/pagination";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Jakarta");

const DashboardSlugPage = ({ parent, slug }) => {
  const navigate = useNavigate();
  const { newDate } = useFormat();
  const { log } = useDevmode();
  const { toTitleCase, toPathname } = useContent();
  const { isLoggedin, secret } = useAuth();
  const { apiRead, apiCrud } = useApi();
  const { showNotifications } = useNotifications();
  const { limitopt, levelopt, usrstatopt, marriedstatopt, stafftypeopt, reporttypeopt, jobplanopt } = useOptions();
  const { typeAlias, reportStatAlias, dayAlias, jobPlanAlias } = useAlias();

  const pageid = parent && slug ? `slug-${toPathname(parent)}-${toPathname(slug)}` : "slug-dashboard";
  const pagetitle = slug ? `${toTitleCase(slug)}` : "Slug Dashboard";

  const [limit, setLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isFormFetching, setIsFormFetching] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedMode, setSelectedMode] = useState("add");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [timers, setTimers] = useState({});
  const [onPageTabId, setOnpageTabId] = useState("1");

  const [emplyData, setEmplyData] = useState([]);
  const [allEmplyData, setAllEmplyData] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [jobData, setJobData] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [reportData, setReportData] = useState([]);
  const [selectedEmply, setSelectedEmply] = useState("all");
  const [reportTeamData, setReportTeamData] = useState([]);
  const [absenceData, setAbsenceData] = useState([]);
  const [assetData, setAssetData] = useState([]);

  const [inputData, setInputData] = useState({ ...inputSchema });
  const [errors, setErrors] = useState({ ...errorSchema });

  const allEmplyObj = [{ idemployee: "all", employeecreate: "0000-00-00 00:00:00", employeeupdate: "0000-00-00 00:00:00", name: "Semua Pegawai", phone: "", hp: "", otp: "", address: "", position: "", division: "", merid: "", identity: "", image: "", status: "", secret: "", email: "", akses: "", noktp: "", npwp: "", bankname: "", rekname: "", reknumber: "", type: "", imgktp: "" }];
  const mergedEmplyData = [...allEmplyObj, ...allEmplyData];

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const getToday = () => {
    const now = new Date();
    const offset = 7 * 60;
    const localTime = now.getTime() + (now.getTimezoneOffset() + offset * 60 * 1000);
    return new Date(localTime);
  };

  const today = getToday();
  const [endDate, setEndDate] = useState(formatDate(today));

  const prevMonth = new Date(today);
  prevMonth.setDate(today.getDate() - 30);
  const [startDate, setStartDate] = useState(formatDate(prevMonth));

  const handlePageChange = (page) => setCurrentPage(page);
  const handleEmplyChange = (value) => setSelectedEmply(value);

  const restoreInputState = () => {
    setInputData({ ...inputSchema });
    setErrors({ ...errorSchema });
  };

  const handleFileUpload = async (placement, file) => {
    const formData = new FormData();
    let endpoint;
    setIsSubmitting(true);
    try {
      formData.append("data", JSON.stringify({ secret }));
      formData.append("fileimg", file);
      if (placement === "job") endpoint = "uploadfile";
      else endpoint = "uploadasset";
      const data = await apiRead(formData, "kpi", endpoint);
      if (data && data.error === false) return data.data;
      else return null;
    } catch (error) {
      showNotifications("danger", "Gagal mengupload file. Mohon periksa koneksi internet anda dan coba lagi.");
      console.error("Gagal mengupload file. Mohon periksa koneksi internet anda dan coba lagi.", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (file) => setSelectedImage(file);
  const handleFileSelect = async (placement, file, index) => {
    if (file) {
      const link = await handleFileUpload(placement, file);
      let updatedarr;
      if (placement === "job") updatedarr = [...inputData.job];
      else updatedarr = [...inputData.aset];
      updatedarr[index].link = link;
      if (placement === "job") setInputData({ ...inputData, job: updatedarr });
      else setInputData({ ...inputData, aset: updatedarr });
    }
  };

  const handleLimitChange = (value) => {
    setLimit(value);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleRowChange = (field, index, e) => {
    const { name, value } = e.target;
    const updatedvalues = [...inputData[field]];
    const updatederrors = errors[field] ? [...errors[field]] : [];
    updatedvalues[index] = { ...updatedvalues[index], [name]: value };
    if (field === "program" && name === "date") {
      if (value < 1 || value > 31) updatederrors[index].date = "Mohon masukkan tanggal di rentang 1 sampai 31" || "";
    }
    if (!updatederrors[index]) updatederrors[index] = {};
    else updatederrors[index] = { ...updatederrors[index], [name]: "" };
    setInputData({ ...inputData, [field]: updatedvalues });
    setErrors({ ...errors, [field]: updatederrors });
  };

  const handleAddRow = (field) => {
    let newitems = {};
    if (field === "program") newitems = { idsource: "", sourcename: "", progname: "", channel: "", target: "", bobot: "" };
    else if (field === "job") newitems = { description: "", note: "", link: "" };
    const updatedvalues = [...inputData[field], newitems];
    const updatederrors = errors[field] ? [...errors[field], newitems] : [{}];
    setInputData({ ...inputData, [field]: updatedvalues });
    setErrors({ ...errors, [field]: updatederrors });
  };

  const handleRmvRow = (field, index) => {
    const updatedrowvalue = [...inputData[field]];
    const updatedrowerror = errors[field] ? [...errors[field]] : [];
    updatedrowvalue.splice(index, 1);
    updatedrowerror.splice(index, 1);
    setInputData({ ...inputData, [field]: updatedrowvalue });
    setErrors({ ...errors, [field]: updatedrowerror });
  };

  const handleSort = (data, setData, params, type) => {
    const newData = [...data];
    const compare = (a, b) => {
      const valueA = getNestedValue(a, params);
      const valueB = getNestedValue(b, params);
      if (type === "date") return new Date(valueA) - new Date(valueB);
      else if (type === "number") return valueA - valueB;
      else if (type === "text") return valueA.localeCompare(valueB);
      else return 0;
    };
    if (!sortOrder || sortOrder === "desc") {
      newData.sort(compare);
      setSortOrder("asc");
    } else {
      newData.sort((a, b) => compare(b, a));
      setSortOrder("desc");
    }
    setData(newData);
  };

  const openForm = () => {
    setSelectedMode("add");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    restoreInputState();
    setIsFormOpen(false);
  };

  const openEdit = (params) => {
    switchData(params);
    setSelectedMode("update");
    setIsFormOpen(true);
  };

  const closeEdit = () => {
    restoreInputState();
    setIsFormOpen(false);
  };

  const calculateRemainingTime = (starttime, endtime) => {
    const now = dayjs();
    const today = dayjs().format("YYYY-MM-DD");
    const start = dayjs.tz(`${today} ${starttime}`, "YYYY-MM-DD HH:mm:ss", "Asia/Jakarta");
    const end = dayjs.tz(`${today} ${endtime}`, "YYYY-MM-DD HH:mm:ss", "Asia/Jakarta");
    if (now.isBefore(start)) {
      const totalDuration = end.diff(start);
      return dayjs(totalDuration).utc().format("HH:mm:ss");
    }
    if (now.isAfter(end)) return "00:00:00";
    const diff = end.diff(now);
    return dayjs(diff).utc().format("HH:mm:ss");
  };

  const fetchData = async () => {
    const errormsg = `Terjadi kesalahan saat memuat halaman ${toTitleCase(slug)}. Mohon periksa koneksi internet anda dan coba lagi.`;
    const formData = new FormData();
    const addtFormData = new FormData();
    let data;
    setIsFetching(true);
    try {
      const offset = (currentPage - 1) * limit;
      formData.append("data", JSON.stringify({ secret, limit, hal: offset }));
      switch (slug) {
        case "PEGAWAI":
          data = await apiRead(formData, "kpi", "viewemployee");
          if (data && data.data && data.data.length > 0) {
            setEmplyData(data.data);
            setTotalPages(data.TTLPage);
          } else {
            setEmplyData([]);
            setTotalPages(0);
          }
          break;
        case "PROGRAM":
          data = await apiRead(formData, "kpi", "viewprogram");
          if (data && data.data && data.data.length > 0) {
            setProgramData(data.data);
            setTotalPages(data.TTLPage);
          } else {
            setProgramData([]);
            setTotalPages(0);
          }
          break;
        case "JOB":
          switch (onPageTabId) {
            case "1":
              data = await apiRead(formData, "kpi", "viewjob");
              if (data) {
                const resultdata = data.data;
                const mergeddata = [...resultdata.bulanan.flat(), ...resultdata.harian.flat(), ...resultdata.mingguan.flat()];
                log("filtered data:", mergeddata);
                setJobData(mergeddata);
              } else setJobData([]);
              break;
            case "2":
              addtFormData.append("data", JSON.stringify({ secret, status: "1" }));
              data = await apiRead(addtFormData, "kpi", "viewjobstatus");
              if (data && data.data && data.data.length > 0) {
                const resultdata = data.data;
                setJobData(resultdata);
              } else setJobData([]);
              break;
            case "3":
              addtFormData.append("data", JSON.stringify({ secret, status: "3" }));
              data = await apiRead(addtFormData, "kpi", "viewjobstatus2");
              if (data && data.data && data.data.length > 0) {
                const resultdata = data.data;
                setJobData(resultdata);
                log("job status v2:", resultdata);
              } else setJobData([]);
              break;
            default:
              setJobData([]);
              break;
          }
          break;
        case "HASIL KERJA":
          addtFormData.append("data", JSON.stringify({ secret, idemployee: selectedEmply, startdate: startDate, endate: endDate, limit, hal: offset }));
          data = await apiRead(addtFormData, "kpi", "viewjobreport");
          if (data && data.data && data.data.length > 0) {
            setReportData(data.data);
            setTotalPages(data.TTLPage);
          } else {
            setReportData([]);
            setTotalPages(0);
          }
          break;
        case "PEKERJAAN TIM":
          data = await apiRead(formData, "kpi", "viewreportunfinish");
          if (data) {
            const resultdata = data.data;
            const mergeddata = [...resultdata.bulanan.flat(), ...resultdata.harian.flat(), ...resultdata.mingguan.flat()];
            log("filtered data:", mergeddata);
            setReportTeamData(mergeddata);
          } else setReportTeamData([]);
          break;
        case "ABSENSI":
          addtFormData.append("data", JSON.stringify({ secret, idemployee: selectedEmply, startdate: startDate, enddate: endDate }));
          data = await apiRead(addtFormData, "kpi", "viewabsencereport");
          if (data && data.data && data.data.length > 0) setAbsenceData(data.data);
          else setAbsenceData([]);
          break;
        case "ASET":
          data = await apiRead(formData, "kpi", "viewasset");
          setAssetData(data && data.data && data.data.length > 0 ? data.data : []);
          setTotalPages(data && data.data && data.data.length > 0 ? data.TTLPage : 0);
          break;
        default:
          setTotalPages(0);
          break;
      }
    } catch (error) {
      showNotifications("danger", errormsg);
      console.error(errormsg, error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchAdditionalData = async () => {
    const errormsg = "Terjadi kesalahan saat memuat data tambahan. Mohon periksa koneksi internet anda dan coba lagi.";
    const formData = new FormData();
    formData.append("data", JSON.stringify({ secret }));
    setIsOptimizing(true);
    try {
      const emplydata = await apiRead(formData, "kpi", "searchemployee");
      setAllEmplyData(emplydata && emplydata.data && emplydata.data.length > 0 ? emplydata.data : []);
    } catch (error) {
      showNotifications("danger", errormsg);
      console.error(errormsg, error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const switchData = async (params) => {
    setSelectedData(params);
    const currentData = (arraydata, identifier) => {
      if (typeof identifier === "string") return arraydata.find((item) => getNestedValue(item, identifier) === params);
      else return arraydata.find((item) => item[identifier] === params);
    };
    const errormsg = `Terjadi kesalahan saat memuat data. Mohon periksa koneksi internet anda dan coba lagi.`;
    const formData = new FormData();
    let data;
    let switchedData;
    setIsFormFetching(true);
    try {
      switch (slug) {
        case "PEGAWAI":
          switchedData = currentData(emplyData, "idemployee");
          log(`id ${slug} data switched:`, switchedData.idemployee);
          setInputData({ name: switchedData.name, phone: switchedData.phone, email: switchedData.email, address: switchedData.address, position: switchedData.position, level: switchedData.akses, division: switchedData.division, married_status: switchedData.merid, nik: switchedData.noktp, npwp: switchedData.npwp, bank_name: switchedData.bankname, bank_holder: switchedData.rekname, bank_number: switchedData.reknumber, phone_office: switchedData.hp });
          break;
        case "PROGRAM":
          switchedData = currentData(programData, "idprogram");
          log(`id ${slug} data switched:`, switchedData.idprogram);
          formData.append("data", JSON.stringify({ secret, idprogram: params }));
          data = await apiRead(formData, "kpi", "viewprogramdetail");
          const programdetaildata = data.data;
          if (data && programdetaildata && programdetaildata.length > 0) setInputData({ pic: switchedData.idpic, program_status: switchedData.progstatus, note: switchedData.note, program: programdetaildata.map((item) => ({ idsource: item.idsource, progname: item.progname, channel: item.channel, target: item.target, bobot: item.bobot, starttime: item.starttime, endtime: item.endtime, day: item.day, date: item.date, type: item.type })) });
          else setInputData({ pic: switchedData.idpic, program_status: switchedData.progstatus, note: switchedData.note, program: [{ idsource: "", progname: "", channel: "", target: "", bobot: "", starttime: "", endtime: "", day: "", date: 1, type: "" }] });
          break;
        default:
          setSelectedData(null);
          break;
      }
    } catch (error) {
      showNotifications("danger", errormsg);
      console.error(errormsg, error);
    } finally {
      setIsFormFetching(false);
    }
  };

  const handleSubmit = async (e, endpoint, scope = "kpi") => {
    e.preventDefault();
    let requiredFields = [];
    switch (slug) {
      case "PEGAWAI":
        requiredFields = ["name", "phone", "email", "address", "position", "level", "division", "married_status", "nik", "npwp", "bank_name", "bank_holder", "bank_number", "type"];
        break;
      case "PROGRAM":
        if (inputData.type === "3") requiredFields = ["pic", "program_status", "program.idsource", "program.progname", "program.channel", "program.target", "program.bobot", "program.starttime", "program.endtime", "program.date", "program.job"];
        else requiredFields = ["pic", "program_status", "program.idsource", "program.progname", "program.channel", "program.target", "program.bobot", "program.starttime", "program.endtime", "program.job"];
        break;
      case "JOB":
        requiredFields = ["job.link", "job.description"];
        break;
      case "ASET":
        requiredFields = ["asetcode", "name", "pic", "amount", "division", "aset.link"];
        break;
      default:
        requiredFields = [];
        break;
    }
    const validationErrors = inputValidator(inputData, requiredFields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const action = e.nativeEvent.submitter.getAttribute("data-action");
    const confirmmsg = action === "update" ? `Apakah anda yakin untuk menyimpan perubahan pada ${toTitleCase(slug)}?` : `Apakah anda yakin untuk menambahkan data baru pada ${toTitleCase(slug)}?`;
    const successmsg = action === "update" ? `Selamat! Perubahan anda pada ${toTitleCase(slug)} berhasil disimpan.` : `Selamat! Data baru berhasil ditambahkan pada ${toTitleCase(slug)}.`;
    const errormsg = action === "update" ? "Terjadi kesalahan saat menyimpan perubahan. Mohon periksa koneksi internet anda dan coba lagi." : "Terjadi kesalahan saat menambahkan data. Mohon periksa koneksi internet anda dan coba lagi.";
    const confirm = window.confirm(confirmmsg);
    if (!confirm) return;
    setIsSubmitting(true);
    try {
      let submittedData;
      switch (slug) {
        case "PEGAWAI":
          submittedData = { secret, name: inputData.name, phone: inputData.phone, email: inputData.email, address: inputData.address, position: inputData.position, akses: inputData.level, divisi: inputData.division, merid: inputData.married_status, noktp: inputData.nik, npwp: inputData.npwp, bankname: inputData.bank_name, rekname: inputData.bank_holder, reknumber: inputData.bank_number, hp: inputData.phone_office, type: inputData.type };
          break;
        case "PROGRAM":
          submittedData = { secret, idpic: inputData.pic, progstatus: inputData.program_status, note: inputData.note, detail: inputData.program };
          break;
        case "JOB":
          submittedData = { secret, idprogdetail: selectedData, type: selectedJobType, detail: inputData.job.map((item) => ({ description: item.description, note: item.note, link: item.link, options: item.options })) };
          break;
        case "ASET":
          submittedData = { secret, kode: inputData.asetcode, name: inputData.name, pic: inputData.pic, amount: inputData.amount, division: inputData.division, link: inputData.aset };
          break;
        default:
          break;
      }
      const formData = new FormData();
      formData.append("data", JSON.stringify(submittedData));
      if (slug === "PEGAWAI") formData.append("fileimg", selectedImage);
      if (action === "update") formData.append("idedit", selectedData);
      await apiCrud(formData, scope, endpoint);
      showNotifications("success", successmsg);
      log("submitted data:", submittedData);
      if (action === "add") closeForm();
      else closeEdit();
      await fetchData();
      await fetchAdditionalData();
    } catch (error) {
      showNotifications("danger", errormsg);
      console.error(errormsg, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (params, endpoint, scope = "kpi") => {
    const confirmmsg = `Apakah anda yakin untuk menghapus data terpilih dari ${toTitleCase(slug)}?`;
    const successmsg = `Selamat! Data terpilih dari ${toTitleCase(slug)} berhasil dihapus.`;
    const errormsg = "Terjadi kesalahan saat menghapus data. Mohon periksa koneksi internet anda dan coba lagi.";
    const confirm = window.confirm(confirmmsg);
    if (!confirm) return;
    const formData = new FormData();
    formData.append("data", JSON.stringify({ secret }));
    formData.append("iddel", params);
    formData.append("status", "2");
    setIsToggling(true);
    try {
      await apiCrud(formData, scope, endpoint);
      showNotifications("success", successmsg);
      await fetchData();
    } catch (error) {
      showNotifications("danger", errormsg);
      console.error(errormsg, error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleToggle = async (e, params, status, endpoint, scope = "kpi") => {
    e.preventDefault();
    const successmsg = "Selamat! Perubahan anda berhasil disimpan.";
    const errormsg = "Terjadi kesalahan saat menyimpan perubahan. Mohon periksa koneksi internet anda dan coba lagi.";
    const formData = new FormData();
    formData.append("data", JSON.stringify({ secret }));
    formData.append("iddel", params);
    formData.append("status", status);
    setIsToggling(true);
    try {
      await apiCrud(formData, scope, endpoint);
      showNotifications("success", successmsg);
      await fetchData();
    } catch (error) {
      showNotifications("danger", errormsg);
      console.error(errormsg, error);
    } finally {
      setIsToggling(false);
    }
  };

  const { searchTerm: userSearch, handleSearch: handleUserSearch, filteredData: filteredUserData, isDataShown: isUserShown } = useSearch(emplyData, ["name", "phone", "hp", "address", "position", "division", "merid", "status", "email", "akses", "noktp", "npwp", "type"]);
  const { searchTerm: programSearch, handleSearch: handleProgramSearch, filteredData: filteredProgramData, isDataShown: isProgramShown } = useSearch(programData, ["picname"]);
  const { searchTerm: jobSearch, handleSearch: handleJobSearch, filteredData: filteredJobData, isDataShown: isJobShown } = useSearch(jobData, ["sourcename", "progname", "channel"]);
  const { searchTerm: reportSearch, handleSearch: handleReportSearch, filteredData: filteredReportData, isDataShown: isReportShown } = useSearch(reportData, ["title", "name", "progname", "channel", "sourcename"]);
  const { searchTerm: reportTeamSearch, handleSearch: handleReportTeamSearch, filteredData: filteredReportTeamData, isDataShown: isReportTeamShown } = useSearch(reportTeamData, ["sourcename", "progname", "channel"]);
  const { searchTerm: absenceSearch, handleSearch: handleAbsenceSearch, filteredData: filteredAbsenceData, isDataShown: isAbsenceShown } = useSearch(absenceData, ["name"]);
  const { searchTerm: assetSearch, handleSearch: handleAssetSearch, filteredData: filteredAssetData, isDataShown: isAssetShown } = useSearch(assetData, ["aset.name"]);

  const renderContent = () => {
    switch (slug) {
      case "PEGAWAI":
        return (
          <Fragment>
            <DashboardHead title={pagetitle} />
            <DashboardToolbar>
              <DashboardTool>
                <Input id={`search-data-${pageid}`} radius="md" labeled={false} placeholder="Cari data ..." type="text" value={userSearch} onChange={(e) => handleUserSearch(e.target.value)} leadingicon={<Search />} />
              </DashboardTool>
              <DashboardTool>
                <Select id={`limit-data-${pageid}`} labeled={false} noemptyval radius="md" placeholder="Baris per Halaman" value={limit} options={limitopt} onChange={handleLimitChange} readonly={!isUserShown} />
                <Button id={`add-new-data-${pageid}`} radius="md" buttonText="Tambah" onClick={openForm} startContent={<Plus />} />
              </DashboardTool>
            </DashboardToolbar>
            <DashboardBody>
              <Table byNumber isEditable isDeletable page={currentPage} limit={limit} isNoData={!isUserShown} isLoading={isFetching}>
                <THead>
                  <TR>
                    <TH type="custom" isSorted onSort={() => handleSort(emplyData, setEmplyData, "status", "number")}>
                      Status
                    </TH>
                    <TH isSorted onSort={() => handleSort(emplyData, setEmplyData, "name", "text")}>
                      Nama
                    </TH>
                    <TH isSorted onSort={() => handleSort(emplyData, setEmplyData, "phone", "number")}>
                      Nomor Telepon
                    </TH>
                    <TH isSorted onSort={() => handleSort(emplyData, setEmplyData, "email", "text")}>
                      Email
                    </TH>
                    <TH isSorted onSort={() => handleSort(emplyData, setEmplyData, "address", "text")}>
                      Alamat
                    </TH>
                    <TH isSorted onSort={() => handleSort(emplyData, setEmplyData, "position", "text")}>
                      Jabatan
                    </TH>
                    <TH isSorted onSort={() => handleSort(emplyData, setEmplyData, "division", "text")}>
                      Divisi
                    </TH>
                    <TH isSorted onSort={() => handleSort(emplyData, setEmplyData, "akses", "text")}>
                      Akses Level
                    </TH>
                    <TH isSorted onSort={() => handleSort(emplyData, setEmplyData, "employeecreate", "date")}>
                      Tanggal Dibuat
                    </TH>
                    <TH isSorted onSort={() => handleSort(emplyData, setEmplyData, "employeeupdate", "date")}>
                      Tanggal Diupdate
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {filteredUserData.map((data, index) => (
                    <TR key={index} onEdit={() => openEdit(data.idemployee)} onDelete={() => handleDelete(data.idemployee, "cudemployee")}>
                      <TD type="custom">
                        <ToggleSwitch id={data.idemployee} isChecked={data.status === "0"} onToggle={(e) => handleToggle(e, data.idemployee, data.status === "0" ? "1" : "0", "cudemployee")} isLoading={isToggling} />
                      </TD>
                      <TD>{data.name}</TD>
                      <TD>{data.phone}</TD>
                      <TD>{data.email}</TD>
                      <TD>{data.address}</TD>
                      <TD>{data.position}</TD>
                      <TD>{data.division}</TD>
                      <TD>{data.akses}</TD>
                      <TD>{newDate(data.employeecreate, "id")}</TD>
                      <TD>{data.employeeupdate === "0000-00-00 00:00:00" ? "-" : newDate(data.employeeupdate, "id")}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </DashboardBody>
            {isUserShown && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
            {isFormOpen && (
              <SubmitForm size="lg" formTitle={selectedMode === "update" ? "Ubah Data Pegawai" : "Tambah Data Pegawai"} operation={selectedMode} fetching={isFormFetching} onSubmit={(e) => handleSubmit(e, "cudemployee")} loading={isSubmitting} onClose={closeForm}>
                <Fieldset>
                  <Input id={`${pageid}-name`} radius="md" label="Nama" placeholder="John Doe" type="text" name="name" value={inputData.name} onChange={handleInputChange} errormsg={errors.name} required />
                  <Input id={`${pageid}-email`} radius="md" label="Email" placeholder="employee@mail.com" type="email" name="email" value={inputData.email} onChange={handleInputChange} errormsg={errors.email} required />
                  <Input id={`${pageid}-phone`} radius="md" label="Nomor Telepon Pribadi" placeholder="0812xxxx" type="tel" name="phone" value={inputData.phone} onChange={handleInputChange} errormsg={errors.phone} required />
                </Fieldset>
                <Textarea id={`${pageid}-address`} radius="md" label="Alamat" placeholder="123 Main Street" type="text" name="address" value={inputData.address} onChange={handleInputChange} errormsg={errors.address} rows={4} required />
                <Fieldset>
                  <Select id={`${pageid}-type`} noemptyval radius="md" label="Tipe Pegawai" placeholder="Pilih tipe" name="type" value={inputData.type} options={stafftypeopt} onChange={(selectedValue) => handleInputChange({ target: { name: "type", value: selectedValue } })} errormsg={errors.type} required />
                  <Input id={`${pageid}-npwp`} radius="md" label="NPWP" placeholder="Masukkan NPWP" type="number" name="npwp" value={inputData.npwp} onChange={handleInputChange} errormsg={errors.npwp} required />
                  <Input id={`${pageid}-phone-office`} radius="md" label="Nomor Telepon Kantor" placeholder="0812xxxx" type="tel" name="phone_office" value={inputData.phone_office} onChange={handleInputChange} errormsg={errors.phone_office} />
                </Fieldset>
                <Fieldset>
                  <Input id={`${pageid}-position`} radius="md" label="Jabatan" placeholder="SPV" type="text" name="position" value={inputData.position} onChange={handleInputChange} errormsg={errors.position} required />
                  <Input id={`${pageid}-division`} radius="md" label="Divisi" placeholder="Masukkan nama divisi" type="text" name="division" value={inputData.division} onChange={handleInputChange} errormsg={errors.division} required />
                  <Select id={`${pageid}-level`} noemptyval radius="md" label="Level/Akses" placeholder="Pilih level/akses" name="level" value={inputData.level} options={levelopt} onChange={(selectedValue) => handleInputChange({ target: { name: "level", value: selectedValue } })} errormsg={errors.level} required />
                </Fieldset>
                <Fieldset>
                  <Input id={`${pageid}-nik`} radius="md" label="NIK" placeholder="327xxxx" type="number" name="nik" value={inputData.nik} onChange={handleInputChange} errormsg={errors.nik} required />
                  <Select id={`${pageid}-married-status`} noemptyval radius="md" label="Status Pernikahan" placeholder="Pilih status" name="married_status" value={inputData.married_status} options={marriedstatopt} onChange={(selectedValue) => handleInputChange({ target: { name: "married_status", value: selectedValue } })} errormsg={errors.married_status} required />
                  <Input id={`${pageid}-scanid`} radius="md" label="Scan KTP" type="file" accept="image/*" name="image" initial={inputData.image} placeholder="Upload KTP" onChange={handleImageSelect} />
                </Fieldset>
                <Fieldset>
                  <Input id={`${pageid}-bank-name`} radius="md" label="Nama Bank" placeholder="Bank BNI" type="text" name="bank_name" value={inputData.bank_name} onChange={handleInputChange} errormsg={errors.bank_name} required />
                  <Input id={`${pageid}-bank-number`} radius="md" label="Nomor Rekening" placeholder="43265122" type="number" name="bank_number" value={inputData.bank_number} onChange={handleInputChange} errormsg={errors.bank_number} required />
                  <Input id={`${pageid}-bank-holder`} radius="md" label="Atas Nama Rekening" placeholder="John Doe" type="text" name="bank_holder" value={inputData.bank_holder} onChange={handleInputChange} errormsg={errors.bank_holder} required />
                </Fieldset>
              </SubmitForm>
            )}
          </Fragment>
        );
      case "PROGRAM":
        const handleTypeChange = (index, type) => {
          const newDetails = [...inputData.program];
          newDetails[index].type = type;
          setInputData({ ...inputData, program: newDetails });
        };

        const getTypeButton = (index) => {
          const buttons = [
            { label: "Harian", onClick: () => handleTypeChange(index, "1"), active: inputData.program[index].type === "1" },
            { label: "Mingguan", onClick: () => handleTypeChange(index, "2"), active: inputData.program[index].type === "2" },
            { label: "Bulanan", onClick: () => handleTypeChange(index, "3"), active: inputData.program[index].type === "3" },
          ];
          return buttons;
        };

        const handleDayChange = (index, sday) => {
          const newDetails = [...inputData.program];
          newDetails[index].day = sday;
          setInputData({ ...inputData, program: newDetails });
        };

        const getDayButton = (index) => {
          const buttons = [
            { label: "Senin", onClick: () => handleDayChange(index, "1"), active: inputData.program[index].day === "1" },
            { label: "Selasa", onClick: () => handleDayChange(index, "2"), active: inputData.program[index].day === "2" },
            { label: "Rabu", onClick: () => handleDayChange(index, "3"), active: inputData.program[index].day === "3" },
            { label: "Kamis", onClick: () => handleDayChange(index, "4"), active: inputData.program[index].day === "4" },
            { label: "Jumat", onClick: () => handleDayChange(index, "5"), active: inputData.program[index].day === "5" },
            { label: "Sabtu", onClick: () => handleDayChange(index, "6"), active: inputData.program[index].day === "6" },
            { label: "Minggu", onClick: () => handleDayChange(index, "0"), active: inputData.program[index].day === "0" },
          ];
          return buttons;
        };

        return (
          <Fragment>
            <DashboardHead title={pagetitle} />
            <DashboardToolbar>
              <DashboardTool>
                <Input id={`search-data-${pageid}`} radius="md" labeled={false} placeholder="Cari data ..." type="text" value={programSearch} onChange={(e) => handleProgramSearch(e.target.value)} leadingicon={<Search />} />
              </DashboardTool>
              <DashboardTool>
                <Select id={`limit-data-${pageid}`} labeled={false} noemptyval radius="md" placeholder="Baris per Halaman" value={limit} options={limitopt} onChange={handleLimitChange} readonly={!isProgramShown} />
                <Button id={`add-new-data-${pageid}`} radius="md" buttonText="Tambah" onClick={openForm} startContent={<Plus />} />
              </DashboardTool>
            </DashboardToolbar>
            <DashboardBody>
              <Table byNumber isClickable page={currentPage} limit={limit} isNoData={!isProgramShown} isLoading={isFetching}>
                <THead>
                  <TR>
                    <TH type="custom" isSorted onSort={() => handleSort(programData, setProgramData, "progstatus", "number")}>
                      Status
                    </TH>
                    <TH isSorted onSort={() => handleSort(programData, setProgramData, "programcreate", "date")}>
                      Tanggal Dibuat
                    </TH>
                    <TH isSorted onSort={() => handleSort(programData, setProgramData, "picname", "text")}>
                      Nama PIC
                    </TH>
                    <TH isSorted onSort={() => handleSort(programData, setProgramData, "totaltarget", "text")}>
                      Total Target
                    </TH>
                    <TH isSorted onSort={() => handleSort(programData, setProgramData, "totalcapaian", "text")}>
                      Total Capaian
                    </TH>
                    <TH isSorted onSort={() => handleSort(programData, setProgramData, "totalbobot", "text")}>
                      Total Bobot
                    </TH>
                    <TH isSorted onSort={() => handleSort(programData, setProgramData, "totalskor", "text")}>
                      Total Skor
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {filteredProgramData.map((data, index) => (
                    <TR key={index} onClick={() => navigate(`/${toPathname(parent)}/${toPathname(slug)}/${toPathname(data.idprogram)}`)}>
                      <TD type="custom">
                        <ToggleSwitch id={data.idprogram} isChecked={data.progstatus === "1"} onToggle={(e) => handleToggle(e, data.idprogram, data.progstatus === "0" ? "1" : "0", "cudprogram")} isLoading={isToggling} />
                      </TD>
                      <TD>{newDate(data.programcreate, "id")}</TD>
                      <TD>{data.picname}</TD>
                      <TD>{data.totaltarget === "" ? "-" : data.totaltarget}</TD>
                      <TD>{data.totalcapaian === "" ? "-" : data.totalcapaian}</TD>
                      <TD>{data.totalbobot === "" ? "-" : data.totalbobot}</TD>
                      <TD>{data.totalskor === "" ? "-" : data.totalskor}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </DashboardBody>
            {isProgramShown && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
            {isFormOpen && (
              <SubmitForm size="md" formTitle={selectedMode === "update" ? "Ubah Data Program" : "Tambah Data Program"} operation={selectedMode} fetching={isFormFetching} onSubmit={(e) => handleSubmit(e, "cudprogram")} loading={isSubmitting} onClose={closeForm}>
                <Fieldset>
                  <Select id={`${pageid}-pic`} searchable radius="md" label="PIC" placeholder="Pilih PIC" name="pic" value={inputData.pic} options={allEmplyData.map((item) => ({ value: item.idemployee, label: item.name }))} onChange={(selectedValue) => handleInputChange({ target: { name: "pic", value: selectedValue } })} errormsg={errors.pic} required />
                  <Select id={`${pageid}-status`} searchable radius="md" label="Status Program" placeholder="Pilih Status" name="program_status" value={inputData.program_status} options={usrstatopt} onChange={(selectedValue) => handleInputChange({ target: { name: "program_status", value: selectedValue } })} errormsg={errors.program_status} required />
                </Fieldset>
                {inputData.program.map((item, index) => (
                  <Fieldset
                    key={index}
                    type="row"
                    markers={`${index + 1}.`}
                    endContent={
                      <Fragment>
                        <Button id={`${pageid}-delete-row-${index}`} subVariant="icon" isTooltip tooltipText="Hapus" size="sm" color={inputData.program.length <= 1 ? "var(--color-red-30)" : "var(--color-red)"} bgColor="var(--color-red-10)" iconContent={<NewTrash />} onClick={() => handleRmvRow("program", index)} isDisabled={inputData.program.length <= 1} />
                        {index + 1 === inputData.program.length && <Button id={`${pageid}-add-row`} subVariant="icon" isTooltip tooltipText="Tambah" size="sm" color="var(--color-primary)" bgColor="var(--color-primary-10)" iconContent={<Plus />} onClick={() => handleAddRow("program")} />}
                      </Fragment>
                    }>
                    <section style={{ width: "100%" }}>
                      <TabGroup buttons={getTypeButton(index)} />
                    </section>
                    {item.type === "1" ? (
                      <Fragment>
                        <Input id={`${pageid}-starttime-${index}`} radius="md" label="Jam Mulai" type="time" name="starttime" value={item.starttime} onChange={(e) => handleRowChange("program", index, e)} errormsg={errors[`program.${index}.starttime`] ? errors[`program.${index}.starttime`] : ""} required />
                        <Input id={`${pageid}-endtime-${index}`} radius="md" label="Jam Berakhir" type="time" name="endtime" value={item.endtime} onChange={(e) => handleRowChange("program", index, e)} errormsg={errors[`program.${index}.endtime`] ? errors[`program.${index}.endtime`] : ""} required />
                      </Fragment>
                    ) : item.type === "2" ? (
                      <Fragment>
                        <section style={{ width: "100%" }}>
                          <TabSwitch buttons={getDayButton(index)} />
                        </section>
                        <Input id={`${pageid}-starttime-${index}`} radius="md" label="Jam Mulai" type="time" name="starttime" value={item.starttime} onChange={(e) => handleRowChange("program", index, e)} errormsg={errors[`program.${index}.starttime`] ? errors[`program.${index}.starttime`] : ""} required />
                        <Input id={`${pageid}-endtime-${index}`} radius="md" label="Jam Berakhir" type="time" name="endtime" value={item.endtime} onChange={(e) => handleRowChange("program", index, e)} errormsg={errors[`program.${index}.endtime`] ? errors[`program.${index}.endtime`] : ""} required />
                      </Fragment>
                    ) : (
                      <Fragment>
                        <section style={{ width: "100%" }}>
                          <Input id={`${pageid}-date-${index}`} radius="md" label="Tanggal" type="number" placeholder="Masukkan tanggal" name="date" value={item.date} onChange={(e) => handleRowChange("program", index, e)} errormsg={errors[`program.${index}.date`] ? errors[`program.${index}.date`] : ""} required min={1} max={31} />
                        </section>
                        <Input id={`${pageid}-starttime-${index}`} radius="md" label="Jam Mulai" type="time" name="starttime" value={item.starttime} onChange={(e) => handleRowChange("program", index, e)} errormsg={errors[`program.${index}.starttime`] ? errors[`program.${index}.starttime`] : ""} required />
                        <Input id={`${pageid}-endtime-${index}`} radius="md" label="Jam Berakhir" type="time" name="endtime" value={item.endtime} onChange={(e) => handleRowChange("program", index, e)} errormsg={errors[`program.${index}.endtime`] ? errors[`program.${index}.endtime`] : ""} required />
                      </Fragment>
                    )}
                    <Input id={`${pageid}-name-${index}`} radius="md" label="Nama Program" placeholder="Masukkan nama program" type="text" name="progname" value={item.progname} onChange={(e) => handleRowChange("program", index, e)} errormsg={errors[`program.${index}.progname`] ? errors[`program.${index}.progname`] : ""} required />
                    <Select id={`${pageid}-source-${index}`} searchable radius="md" label="Sumber" placeholder="Pilih sumber" name="idsource" value={item.idsource} options={allEmplyData.map((item) => ({ value: item.idemployee, label: item.name }))} onChange={(selectedValue) => handleRowChange("program", index, { target: { name: "idsource", value: selectedValue } })} errormsg={errors[`program.${index}.idsource`] ? errors[`program.${index}.idsource`] : ""} required />
                    <Input id={`${pageid}-channel-${index}`} radius="md" label="Channel" placeholder="Masukkan channel" type="text" name="channel" value={item.channel} onChange={(e) => handleRowChange("program", index, e)} errormsg={errors[`program.${index}.channel`] ? errors[`program.${index}.channel`] : ""} required />
                    <Input id={`${pageid}-target-${index}`} radius="md" label="Target" placeholder="Masukkan target" type="text" name="target" value={item.target} onChange={(e) => handleRowChange("program", index, e)} errormsg={errors[`program.${index}.target`] ? errors[`program.${index}.target`] : ""} required />
                    <Input id={`${pageid}-bobot-${index}`} radius="md" label="Bobot" placeholder="Masukkan bobot" type="text" name="bobot" value={item.bobot} onChange={(e) => handleRowChange("program", index, e)} errormsg={errors[`program.${index}.bobot`] ? errors[`program.${index}.bobot`] : ""} required />
                    <Select id={`${pageid}-plan-${index}`} radius="md" label="Tipe" noemptyval name="job" value={item.job} options={jobplanopt} onChange={(selectedValue) => handleRowChange("program", index, { target: { name: "job", value: selectedValue } })} errormsg={errors[`program.${index}.job`] ? errors[`program.${index}.job`] : ""} required />
                    <Textarea id={`${pageid}-info-${index}`} radius="md" label="Informasi Tambahan" placeholder="Masukkan informasi tambahan" name="info" value={item.info} onChange={(e) => handleRowChange("program", index, e)} errormsg={errors[`program.${index}.info`] ? errors[`program.${index}.info`] : ""} rows={5} />
                  </Fieldset>
                ))}
                <Textarea id={`${pageid}-note`} radius="md" label="Catatan" placeholder="Masukkan catatan program" name="note" value={inputData.note} onChange={handleInputChange} errormsg={errors.note} rows={5} />
              </SubmitForm>
            )}
          </Fragment>
        );
      case "JOB":
        const openReport = (params, type) => {
          setSelectedData(params);
          setSelectedJobType(type);
          setIsFormOpen(true);
          log("selected job type:", type);
        };

        const handleOnpageTabChange = (id) => setOnpageTabId(id);
        const onPageTabButton = [
          { label: "Proses Hari Ini", onClick: () => handleOnpageTabChange("1"), active: onPageTabId === "1" },
          { label: "Selesai", onClick: () => handleOnpageTabChange("2"), active: onPageTabId === "2" },
          { label: "Koreksi", onClick: () => handleOnpageTabChange("3"), active: onPageTabId === "3" },
        ];

        return (
          <Fragment>
            <DashboardHead title={pagetitle} />
            <DashboardToolbar>
              <DashboardTool>
                <Input id={`search-data-${pageid}`} radius="md" labeled={false} placeholder="Cari data ..." type="text" value={jobSearch} onChange={(e) => handleJobSearch(e.target.value)} leadingicon={<Search />} />
              </DashboardTool>
              <DashboardTool>
                <Select id={`limit-data-${pageid}`} labeled={false} noemptyval radius="md" placeholder="Baris per Halaman" value={limit} options={limitopt} onChange={handleLimitChange} readonly={!isJobShown} />
              </DashboardTool>
            </DashboardToolbar>
            <TabSwitch buttons={onPageTabButton} />
            <DashboardBody>
              {onPageTabId === "3" ? (
                <Table byNumber isClickable isNoData={jobData.length <= 0} isLoading={isFetching}>
                  <THead>
                    <TR>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "action.progname", "text")}>
                        Nama Program
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "action.job", "number")}>
                        Jenis
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "action.type", "number")}>
                        Tipe
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "action.day", "number")}>
                        Hari (mingguan)
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "action.date", "number")}>
                        Tanggal (bulanan)
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "action.starttime", "number")}>
                        Jam Mulai
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "action.endtime", "number")}>
                        Jam Berakhir
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "action.channel", "text")}>
                        Channel
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "action.sourcename", "text")}>
                        Sumber
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "action.target", "number")}>
                        Target
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "action.bobot", "number")}>
                        Bobot
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "action.info", "text")}>
                        Catatan
                      </TH>
                    </TR>
                  </THead>
                  <TBody>
                    {jobData.map((data, index) => (
                      <TR key={index} onClick={() => navigate(`/${toPathname(parent)}/${toPathname(slug)}/${toPathname(data["action"].idaction)}`)}>
                        <TD>{data["action"] && data["action"].progname}</TD>
                        <TD>{data["action"] && jobPlanAlias(data["action"].job)}</TD>
                        <TD>{data["action"] && typeAlias(data["action"].type)}</TD>
                        <TD>{data["action"] && data["action"].day === "" ? "-" : dayAlias(data["action"] && data["action"].day)}</TD>
                        <TD>{data["action"] && data["action"].date === "" ? "-" : data["action"] && data["action"].date}</TD>
                        <TD>{data["action"] && data["action"].starttime}</TD>
                        <TD>{data["action"] && data["action"].endtime}</TD>
                        <TD>{data["action"] && data["action"].channel}</TD>
                        <TD>{data["action"] && data["action"].sourcename}</TD>
                        <TD>{data["action"] && data["action"].target}</TD>
                        <TD>{data["action"] && data["action"].bobot}</TD>
                        <TD>{data["action"] && data["action"].info === "" ? "-" : data["action"] && data["action"].info}</TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              ) : (
                <Table byNumber isClickable={onPageTabId === "2"} isNoData={!isJobShown} isLoading={isFetching}>
                  <THead>
                    <TR>
                      <Fragment>
                        {onPageTabId === "1" && (
                          <Fragment>
                            <TH type="custom">Action</TH>
                            <TH type="custom">Timer</TH>
                          </Fragment>
                        )}
                      </Fragment>
                      <Fragment>
                        {onPageTabId === "2" && (
                          <TH isSorted onSort={() => handleSort(jobData, setJobData, "actioncreate", "date")}>
                            Tanggal Pengerjaan
                          </TH>
                        )}
                      </Fragment>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "progname", "text")}>
                        Nama Program
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "job", "number")}>
                        Jenis
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "type", "number")}>
                        Tipe
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "day", "number")}>
                        Hari (mingguan)
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "date", "number")}>
                        Tanggal (bulanan)
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "starttime", "number")}>
                        Jam Mulai
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "endtime", "number")}>
                        Jam Berakhir
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "channel", "text")}>
                        Channel
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "sourcename", "text")}>
                        Sumber
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "target", "number")}>
                        Target
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "bobot", "number")}>
                        Bobot
                      </TH>
                      <TH isSorted onSort={() => handleSort(jobData, setJobData, "info", "text")}>
                        Catatan
                      </TH>
                    </TR>
                  </THead>
                  <TBody>
                    {filteredJobData.map((data, index) => (
                      <TR key={index} onClick={onPageTabId === "2" ? () => navigate(`/${toPathname(parent)}/${toPathname(slug)}/${toPathname(data.idaction)}`) : () => {}} isComplete={onPageTabId === "2"} isDanger={timers[index] === "00:00:00" && onPageTabId !== "2"}>
                        <Fragment>
                          {onPageTabId === "1" && (
                            <Fragment>
                              <TD type="custom">
                                {timers[index] !== "00:00:00" && <Button size="sm" buttonText="Report" onClick={() => openReport(data.idprogramdetail, data.type)} />}
                                {timers[index] === "00:00:00" && <span style={{ color: "var(--color-red)" }}>Terlewat</span>}
                              </TD>
                              <TD type="custom">{timers[index]}</TD>
                            </Fragment>
                          )}
                        </Fragment>
                        <Fragment>{onPageTabId === "2" && <TD>{newDate(data.actioncreate, "id")}</TD>}</Fragment>
                        <TD>{data.progname}</TD>
                        <TD>{jobPlanAlias(data.job)}</TD>
                        <TD>{typeAlias(data.type)}</TD>
                        <TD>{data.day === "" ? "-" : dayAlias(data.day)}</TD>
                        <TD>{data.date === "" ? "-" : data.date}</TD>
                        <TD>{data.starttime}</TD>
                        <TD>{data.endtime}</TD>
                        <TD>{data.channel}</TD>
                        <TD>{data.sourcename}</TD>
                        <TD>{data.target}</TD>
                        <TD>{data.bobot}</TD>
                        <TD>{data.info === "" ? "-" : data.info}</TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              )}
            </DashboardBody>
            {isFormOpen && (
              <SubmitForm size="md" formTitle="Report Hasil Pengerjaan" operation="add" fetching={isFormFetching} onSubmit={(e) => handleSubmit(e, "addjob")} loading={isSubmitting} onClose={closeForm}>
                {inputData.job.map((item, index) => (
                  <Fieldset
                    key={index}
                    type="row"
                    markers={`${index + 1}.`}
                    endContent={
                      <Fragment>
                        <Button id={`${pageid}-delete-row-${index}`} subVariant="icon" isTooltip tooltipText="Hapus" size="sm" color={inputData.job.length <= 1 ? "var(--color-red-30)" : "var(--color-red)"} bgColor="var(--color-red-10)" iconContent={<NewTrash />} onClick={() => handleRmvRow("job", index)} isDisabled={inputData.job.length <= 1} />
                        {index + 1 === inputData.job.length && <Button id={`${pageid}-add-row`} subVariant="icon" isTooltip tooltipText="Tambah" size="sm" color="var(--color-primary)" bgColor="var(--color-primary-10)" iconContent={<Plus />} onClick={() => handleAddRow("job")} />}
                      </Fragment>
                    }>
                    <Select id={`${pageid}-type-${index}`} noemptyval radius="md" label="Tipe Laporan" placeholder="Pilih tipe" name="options" value={item.options} options={reporttypeopt} onChange={(selectedValue) => handleRowChange("job", index, { target: { name: "options", value: selectedValue } })} errormsg={errors[`job.${index}.options`] ? errors[`job.${index}.options`] : ""} required />
                    {item.options === "link" ? (
                      <Input id={`${pageid}-link-${index}`} type="url" radius="md" label="Link Konten" name="link" placeholder={`Masukkan link dengan https://`} value={item.link} onChange={(e) => handleRowChange("job", index, e)} errormsg={errors[`job.${index}.link`] ? errors[`job.${index}.link`] : ""} required />
                    ) : item.options === "img" ? (
                      <Input id={`${pageid}-link-${index}`} type="file" accept="image/*" radius="md" label="File Gambar" name="link" placeholder="Pilih Gambar" onChange={(file) => handleFileSelect("job", file, index)} required />
                    ) : item.options === "video" ? (
                      <Input id={`${pageid}-link-${index}`} type="file" accept="video/*" radius="md" label="File Video" name="link" placeholder="Pilih Video" onChange={(file) => handleFileSelect("job", file, index)} required />
                    ) : (
                      <Input id={`${pageid}-link-${index}`} type="file" radius="md" label="File" name="link" placeholder="Pilih File" onChange={(file) => handleFileSelect("job", file, index)} required />
                    )}
                    <Textarea id={`${pageid}-desc-${index}`} radius="md" label="Deskripsi Pengerjaan" name="description" placeholder="Masukkan hasil pengerjaan" value={item.description} onChange={(e) => handleRowChange("job", index, e)} errormsg={errors[`job.${index}.description`] ? errors[`job.${index}.description`] : ""} rows={5} required />
                    <Textarea id={`${pageid}-note-${index}`} radius="md" label="Catatan" name="note" placeholder="Masukkan catatan" value={item.note} onChange={(e) => handleRowChange("job", index, e)} errormsg={errors[`job.${index}.note`] ? errors[`job.${index}.note`] : ""} rows={5} />
                  </Fieldset>
                ))}
              </SubmitForm>
            )}
          </Fragment>
        );
      case "HASIL KERJA":
        return (
          <Fragment>
            <DashboardHead title={pagetitle} />
            <DashboardToolbar>
              <DashboardTool>
                <Input id={`search-data-${pageid}`} radius="md" labeled={false} placeholder="Cari data ..." type="text" value={reportSearch} onChange={(e) => handleReportSearch(e.target.value)} leadingicon={<Search />} />
              </DashboardTool>
              <DashboardTool>
                <Select id={`limit-data-${pageid}`} labeled={false} noemptyval radius="md" placeholder="Baris per Halaman" value={limit} options={limitopt} onChange={handleLimitChange} readonly={!isReportShown} />
                <Button id={`filter-data-${pageid}`} buttonText="Filter Data" onClick={openForm} startContent={<Filter />} />
              </DashboardTool>
            </DashboardToolbar>
            <DashboardBody>
              <Table byNumber isClickable page={currentPage} limit={limit} isNoData={!isReportShown} isLoading={isFetching}>
                <THead>
                  <TR>
                    <TH isSorted onSort={() => handleSort(reportData, setReportData, "actioncreate", "date")}>
                      Tanggal Pengerjaan
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportData, setReportData, "statusaction", "number")}>
                      Status Pengerjaan
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportData, setReportData, "name", "text")}>
                      Nama PIC
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportData, setReportData, "progname", "text")}>
                      Nama Program
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportData, setReportData, "type", "number")}>
                      Tipe Program
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportData, setReportData, "channel", "text")}>
                      Channel
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportData, setReportData, "sourcename", "text")}>
                      Sumber
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportData, setReportData, "day", "number")}>
                      Hari
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportData, setReportData, "date", "number")}>
                      Tanggal
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportData, setReportData, "starttime", "number")}>
                      Jam Mulai
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportData, setReportData, "endtime", "number")}>
                      Jam Berakhir
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {filteredReportData.map((data, index) => (
                    <TR key={index} isWarning={data.statusaction === "3"} onClick={data.statusaction === "1" ? () => navigate(`/${toPathname(parent)}/${toPathname(slug)}/${toPathname(data.idaction)}`) : () => {}}>
                      <TD>{newDate(data.actioncreate, "id")}</TD>
                      <TD>{reportStatAlias(data.statusaction)}</TD>
                      <TD>{data.name}</TD>
                      <TD>{data.progname}</TD>
                      <TD>{typeAlias(data.type)}</TD>
                      <TD>{data.channel}</TD>
                      <TD>{data.sourcename}</TD>
                      <TD>{data.day === "" ? "-" : dayAlias(data.day)}</TD>
                      <TD>{data.date === "" ? "-" : data.date}</TD>
                      <TD>{data.starttime}</TD>
                      <TD>{data.endtime}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </DashboardBody>
            {isReportShown && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
            {isFormOpen && (
              <SubmitForm size="sm" formTitle="Terapkan Filter" operation="event" onClose={closeForm} cancelText="Tutup">
                <Select id={`${pageid}-filter-employee`} searchable noemptyval label="Nama Pegawai" placeholder="Pilih Pegawai" value={selectedEmply} options={mergedEmplyData.map((item) => ({ value: item.idemployee, label: item.name }))} onChange={handleEmplyChange} />
                <Fieldset>
                  <Input id={`${pageid}-filter-startdate`} label="Filter dari:" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  <Input id={`${pageid}-filter-enddate`} label="Hingga:" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </Fieldset>
              </SubmitForm>
            )}
          </Fragment>
        );
      case "PEKERJAAN TIM":
        return (
          <Fragment>
            <DashboardHead title={pagetitle} />
            <DashboardToolbar>
              <DashboardTool>
                <Input id={`search-data-${pageid}`} radius="md" labeled={false} placeholder="Cari data ..." type="text" value={reportTeamSearch} onChange={(e) => handleReportTeamSearch(e.target.value)} leadingicon={<Search />} />
              </DashboardTool>
              <DashboardTool>
                <Select id={`limit-data-${pageid}`} labeled={false} noemptyval radius="md" placeholder="Baris per Halaman" value={limit} options={limitopt} onChange={handleLimitChange} readonly={!isReportTeamShown} />
              </DashboardTool>
            </DashboardToolbar>
            <DashboardBody>
              <Table byNumber isNoData={!isReportTeamShown} isLoading={isFetching}>
                <THead>
                  <TR>
                    <TH isSorted onSort={() => handleSort(reportTeamData, setReportTeamData, "progname", "text")}>
                      Nama Program
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportTeamData, setReportTeamData, "type", "number")}>
                      Tipe
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportTeamData, setReportTeamData, "day", "number")}>
                      Hari
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportTeamData, setReportTeamData, "date", "number")}>
                      Tanggal
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportTeamData, setReportTeamData, "starttime", "number")}>
                      Jam Mulai
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportTeamData, setReportTeamData, "endtime", "number")}>
                      Jam Berakhir
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportTeamData, setReportTeamData, "channel", "text")}>
                      Channel
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportTeamData, setReportTeamData, "sourcename", "text")}>
                      Sumber
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportTeamData, setReportTeamData, "target", "number")}>
                      Target
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportTeamData, setReportTeamData, "bobot", "number")}>
                      Bobot
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportTeamData, setReportTeamData, "info", "text")}>
                      Catatan
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {filteredReportTeamData.map((data, index) => (
                    <TR key={index}>
                      <TD>{data.progname}</TD>
                      <TD>{typeAlias(data.type)}</TD>
                      <TD>{data.day === "" ? "-" : dayAlias(data.day)}</TD>
                      <TD>{data.date === "" ? "-" : data.date}</TD>
                      <TD>{data.starttime}</TD>
                      <TD>{data.endtime}</TD>
                      <TD>{data.channel}</TD>
                      <TD>{data.sourcename}</TD>
                      <TD>{data.target}</TD>
                      <TD>{data.bobot}</TD>
                      <TD>{data.info}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </DashboardBody>
          </Fragment>
        );
      case "ABSENSI":
        return (
          <Fragment>
            <DashboardHead title={pagetitle} />
            <DashboardToolbar>
              <DashboardTool>
                <Input id={`search-data-${pageid}`} radius="md" labeled={false} placeholder="Cari data ..." type="text" value={absenceSearch} onChange={(e) => handleAbsenceSearch(e.target.value)} leadingicon={<Search />} />
              </DashboardTool>
              <DashboardTool>
                <Select id={`limit-data-${pageid}`} labeled={false} noemptyval radius="md" placeholder="Baris per Halaman" value={limit} options={limitopt} onChange={handleLimitChange} readonly={!isAbsenceShown} />
                <Button id={`filter-data-${pageid}`} buttonText="Filter Data" onClick={openForm} startContent={<Filter />} />
              </DashboardTool>
            </DashboardToolbar>
            <DashboardBody>
              <Table byNumber isNoData={!isAbsenceShown} isLoading={isFetching}>
                <THead>
                  <TR>
                    <TH isSorted onSort={() => handleSort(absenceData, setAbsenceData, "name", "text")}>
                      Nama PIC
                    </TH>
                    <TH isSorted onSort={() => handleSort(absenceData, setAbsenceData, "startdate", "number")}>
                      Tanggal Absensi
                    </TH>
                    <TH isSorted onSort={() => handleSort(absenceData, setAbsenceData, "starttime", "number")}>
                      Jam Masuk
                    </TH>
                    <TH isSorted onSort={() => handleSort(absenceData, setAbsenceData, "endtime", "number")}>
                      Jam Keluar
                    </TH>
                    <TH isSorted onSort={() => handleSort(absenceData, setAbsenceData, "delayin", "number")}>
                      Delay (in)
                    </TH>
                    <TH isSorted onSort={() => handleSort(absenceData, setAbsenceData, "delayout", "number")}>
                      Delay (out)
                    </TH>
                    <TH isSorted onSort={() => handleSort(absenceData, setAbsenceData, "overin", "number")}>
                      Over (in)
                    </TH>
                    <TH isSorted onSort={() => handleSort(absenceData, setAbsenceData, "overout", "number")}>
                      Over (out)
                    </TH>
                    <TH isSorted onSort={() => handleSort(absenceData, setAbsenceData, "hour", "number")}>
                      HH:mm:ss
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {filteredAbsenceData.map((data, index) => (
                    <TR key={index}>
                      <TD>{data.name}</TD>
                      <TD>{data.startdate}</TD>
                      <TD>{data.starttime === "" ? "-" : data.starttime}</TD>
                      <TD>{data.endtime === "" ? "-" : data.endtime}</TD>
                      <TD>{data.delayin === "" ? "-" : data.delayin}</TD>
                      <TD>{data.delayout === "" ? "-" : data.delayout}</TD>
                      <TD>{data.overin === "" ? "-" : data.overin}</TD>
                      <TD>{data.overout === "" ? "-" : data.overout}</TD>
                      <TD>{`${data.hour}:${data.minute}:${data.second}`}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </DashboardBody>
            {isFormOpen && (
              <SubmitForm size="sm" formTitle="Terapkan Filter" operation="event" onClose={closeForm} cancelText="Tutup">
                <Select id={`${pageid}-filter-employee`} searchable noemptyval label="Nama Pegawai" placeholder="Pilih Pegawai" value={selectedEmply} options={mergedEmplyData.map((item) => ({ value: item.idemployee, label: item.name }))} onChange={handleEmplyChange} />
                <Fieldset>
                  <Input id={`${pageid}-filter-startdate`} label="Filter dari:" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  <Input id={`${pageid}-filter-enddate`} label="Hingga:" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </Fieldset>
              </SubmitForm>
            )}
          </Fragment>
        );
      case "ASET":
        const handleDeleteAsset = async (params) => {
          const confirmmsg = "Apakah anda yakin untuk menghapus data terpilih dari Aset?";
          const successmsg = "Selamat! Data terpilih dari Aset berhasil dihapus.";
          const errormsg = "Terjadi kesalahan saat menghapus data. Mohon periksa koneksi internet anda dan coba lagi.";
          const confirm = window.confirm(confirmmsg);
          if (!confirm) return;
          const formData = new FormData();
          formData.append("data", JSON.stringify({ secret, kode: "", name: "", pic: "", amount: "", division: "", link: [] }));
          formData.append("iddel", params);
          setIsFetching(true);
          try {
            await apiCrud(formData, "kpi", "cudasset");
            showNotifications("success", successmsg);
            await fetchData();
          } catch (error) {
            showNotifications("danger", errormsg);
            console.error(errormsg, error);
          } finally {
            setIsFetching(false);
          }
        };

        return (
          <Fragment>
            <DashboardHead title={pagetitle} />
            <DashboardToolbar>
              <DashboardTool>
                <Input id={`search-data-${pageid}`} radius="md" labeled={false} placeholder="Cari data ..." type="text" value={assetSearch} onChange={(e) => handleAssetSearch(e.target.value)} leadingicon={<Search />} />
              </DashboardTool>
              <DashboardTool>
                <Select id={`limit-data-${pageid}`} labeled={false} noemptyval radius="md" placeholder="Baris per Halaman" value={limit} options={limitopt} onChange={handleLimitChange} readonly={!isAssetShown} />
                <Button id={`add-new-data-${pageid}`} radius="md" buttonText="Tambah" onClick={openForm} startContent={<Plus />} />
              </DashboardTool>
            </DashboardToolbar>
            <DashboardBody>
              <Table byNumber isExpandable isDeletable page={currentPage} limit={limit} isNoData={!isAssetShown} isLoading={isFetching}>
                <THead>
                  <TR>
                    <TH isSorted onSort={() => handleSort(assetData, setAssetData, "aset.kode", "text")}>
                      Kode
                    </TH>
                    <TH isSorted onSort={() => handleSort(assetData, setAssetData, "aset.pic", "number")}>
                      Nama PIC
                    </TH>
                    <TH isSorted onSort={() => handleSort(assetData, setAssetData, "aset.division", "text")}>
                      Divisi
                    </TH>
                    <TH isSorted onSort={() => handleSort(assetData, setAssetData, "aset.name", "text")}>
                      Nama Aset
                    </TH>
                    <TH isSorted onSort={() => handleSort(assetData, setAssetData, "aset.amount", "number")}>
                      Jumlah
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {filteredAssetData.map((data, index) => (
                    <TR
                      key={index}
                      onDelete={() => handleDeleteAsset(data.aset.idasset)}
                      expandContent={
                        <Fragment>
                          {data.file.map((subdata, idx) => (
                            <Fieldset key={idx} type="row" markers={`${idx + 1}.`} endContent={<Button id={`${pageid}-view-${index}-${idx}`} radius="md" buttonText="Preview" onClick={() => window.open(subdata.link, "_blank")} />}>
                              <Input id={`${pageid}-id-${index}-${idx}`} radius="md" label="ID Aset" value={subdata.idlinkasset} readonly />
                              <Input id={`${pageid}-link-${index}-${idx}`} radius="md" label="Link Foto/Video Aset" value={subdata.link} readonly />
                            </Fieldset>
                          ))}
                        </Fragment>
                      }>
                      <TD type="code">{data.aset.kode}</TD>
                      <TD>{data.aset.pic}</TD>
                      <TD>{data.aset.division}</TD>
                      <TD>{data.aset.name}</TD>
                      <TD type="code">{data.aset.amount}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </DashboardBody>
            {isAssetShown && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
            {isFormOpen && (
              <SubmitForm size="md" formTitle="Tambah Data Asset" operation="add" fetching={isFormFetching} onSubmit={(e) => handleSubmit(e, "cudasset")} loading={isSubmitting} onClose={closeForm}>
                <Fieldset>
                  <Select id={`${pageid}-pic`} searchable radius="md" label="PIC" placeholder="Pilih PIC" name="pic" value={inputData.pic} options={allEmplyData.map((item) => ({ value: item.idemployee, label: item.name }))} onChange={(selectedValue) => handleInputChange({ target: { name: "pic", value: selectedValue } })} errormsg={errors.pic} required />
                  <Input id={`${pageid}-division`} radius="md" label="Divisi" placeholder="Masukkan nama divisi" type="text" name="division" value={inputData.division} onChange={handleInputChange} errormsg={errors.division} required />
                </Fieldset>
                <Input id={`${pageid}-name`} radius="md" label="Nama Aset" placeholder="Meja kantor" type="text" name="name" value={inputData.name} onChange={handleInputChange} errormsg={errors.name} required />
                <Fieldset>
                  <Input id={`${pageid}-code`} radius="md" label="Kode Aset" placeholder="Masukkan kode aset" type="text" name="asetcode" value={inputData.asetcode} onChange={handleInputChange} errormsg={errors.asetcode} required />
                  <Input id={`${pageid}-amount`} radius="md" label="Jumlah" placeholder="Masukkan jumlah aset" type="number" name="amount" value={inputData.amount} onChange={handleInputChange} errormsg={errors.amount} required />
                </Fieldset>
                {inputData.aset.map((item, index) => (
                  <Fieldset
                    key={index}
                    type="row"
                    markers={`${index + 1}.`}
                    endContent={
                      <Fragment>
                        <Button id={`${pageid}-delete-row-${index}`} subVariant="icon" isTooltip tooltipText="Hapus" size="sm" color={inputData.aset.length <= 1 ? "var(--color-red-30)" : "var(--color-red)"} bgColor="var(--color-red-10)" iconContent={<NewTrash />} onClick={() => handleRmvRow("aset", index)} isDisabled={inputData.aset.length <= 1} />
                        {index + 1 === inputData.aset.length && <Button id={`${pageid}-add-row`} subVariant="icon" isTooltip tooltipText="Tambah" size="sm" color="var(--color-primary)" bgColor="var(--color-primary-10)" iconContent={<Plus />} onClick={() => handleAddRow("aset")} />}
                      </Fragment>
                    }>
                    <Input id={`${pageid}-link-${index}`} type="file" radius="md" label="Upload Foto/Video" name="link" placeholder="Pilih Media" onChange={(file) => handleFileSelect("aset", file, index)} required />
                  </Fieldset>
                ))}
              </SubmitForm>
            )}
          </Fragment>
        );
      default:
        return <DashboardHead title={`Halaman Dashboard ${pagetitle} akan segera hadir.`} />;
    }
  };

  useEffect(() => {
    if (onPageTabId === "1") {
      const interval = setInterval(() => {
        setTimers((prevTimers) => {
          const newTimers = { ...prevTimers };
          jobData.forEach((data, index) => {
            newTimers[index] = calculateRemainingTime(data.starttime, data.endtime);
          });
          return newTimers;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [onPageTabId, jobData]);

  useEffect(() => {
    setInputData({ ...inputSchema });
    setErrors({ ...errorSchema });
    setSelectedData(null);
    fetchData();
  }, [slug, currentPage, limit, slug === "JOB" ? onPageTabId : null, selectedEmply, startDate, endDate]);

  useEffect(() => {
    setLimit(20);
    setCurrentPage(1);
    setSelectedMode("add");
    setSortOrder("asc");
    fetchAdditionalData();
  }, [slug]);

  if (!isLoggedin) return <Navigate to="/login" />;
  return (
    <Pages title={`${pagetitle} - Dashboard`} loading={isOptimizing}>
      <DashboardContainer>{renderContent()}</DashboardContainer>
    </Pages>
  );
};

export default DashboardSlugPage;
