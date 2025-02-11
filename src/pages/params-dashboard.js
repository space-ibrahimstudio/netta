import React, { Fragment, useState, useEffect } from "react";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { useContent, useDevmode, useFormat } from "@ibrahimstudio/react";
import { Button } from "@ibrahimstudio/button";
import { Input } from "@ibrahimstudio/input";
import { Select } from "@ibrahimstudio/select";
import { Textarea } from "@ibrahimstudio/textarea";
import { useAuth } from "../libs/securities/auth";
import { useApi } from "../libs/apis/office";
import { useNotifications } from "../components/feedbacks/context/notifications-context";
import { useAlias, useOptions } from "../libs/plugins/helper";
import { getNestedValue, inputValidator } from "../libs/plugins/controller";
import { inputSchema, errorSchema } from "../libs/sources/common";
import Pages from "../components/frames/pages";
import { DashboardContainer, DashboardHead, DashboardToolbar, DashboardTool, DashboardBody } from "./overview-dashboard";
import { SubmitForm } from "../components/input-controls/forms";
import Table, { THead, TBody, TR, TH, TD } from "../components/contents/table";
import { Arrow, Plus, NewTrash } from "../components/contents/icons";
import Fieldset, { ToggleSwitch } from "../components/input-controls/inputs";
import TabGroup from "../components/input-controls/tab-group";
import TabSwitch from "../components/input-controls/tab-switch";

const DashboardParamsPage = ({ parent, slug }) => {
  const { params } = useParams();
  const navigate = useNavigate();
  const { newDate } = useFormat();
  const { toPathname, toTitleCase } = useContent();
  const { log } = useDevmode();
  const { isLoggedin, secret } = useAuth();
  const { apiRead, apiCrud } = useApi();
  const { showNotifications } = useNotifications();
  const { typeAlias, dayAlias } = useAlias();
  const { reporttypeopt, jobplanopt } = useOptions();

  const pageid = parent && slug && params ? `params-${toPathname(parent)}-${toPathname(slug)}-${toPathname(params)}` : "params-dashboard";

  const [pageTitle, setPageTitle] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isDataShown, setIsDataShown] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [limit, setLimit] = useState(20);
  const [selectedData, setSelectedData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormFetching, setIsFormFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMode, setSelectedMode] = useState("add");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [programDetailData, setProgramDetailData] = useState([]);
  const [jobDetailData, setJobDetailData] = useState([]);
  const [allEmplyData, setAllEmplyData] = useState([]);
  const [jobType, setJobType] = useState("1");
  const [day, setDay] = useState("1");
  const [reportDetailData, setReportDetailData] = useState([]);
  const [scoreData, setScoreData] = useState([]);

  const [inputData, setInputData] = useState({ ...inputSchema });
  const [errors, setErrors] = useState({ ...errorSchema });

  const goBack = () => navigate(-1);
  const restoreInputState = () => {
    setInputData({ ...inputSchema });
    setErrors({ ...errorSchema });
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

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    setIsSubmitting(true);
    try {
      formData.append("data", JSON.stringify({ secret }));
      formData.append("fileimg", file);
      const data = await apiRead(formData, "kpi", "uploadfile");
      if (data && data.error === false) return data.data;
      else return null;
    } catch (error) {
      showNotifications("danger", "Gagal mengupload file. Mohon periksa koneksi internet anda dan coba lagi.");
      console.error("Gagal mengupload file. Mohon periksa koneksi internet anda dan coba lagi.", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    if (name === "typepayment") {
      if (value === "cash") setInputData((prevState) => ({ ...prevState, bank_code: "CASH" }));
      else if (value === "indodana") setInputData((prevState) => ({ ...prevState, bank_code: "INDODANA" }));
      else if (value === "rata") setInputData((prevState) => ({ ...prevState, bank_code: "RATA" }));
      else setInputData((prevState) => ({ ...prevState, bank_code: "", status: "0" }));
    }
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

  const handleToggle = async (e, params, status, endpoint, scope = "kpi") => {
    e.preventDefault();
    const successmsg = "Selamat! Perubahan anda berhasil disimpan.";
    const errormsg = "Terjadi kesalahan saat menyimpan perubahan. Mohon periksa koneksi internet anda dan coba lagi.";
    const formData = new FormData();
    formData.append("data", JSON.stringify({ secret, status }));
    formData.append("idedit", params);
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

  const fetchData = async () => {
    const errormsg = `Terjadi kesalahan saat memuat halaman ${toTitleCase(slug)} ${toTitleCase(params)}. Mohon periksa koneksi internet anda dan coba lagi.`;
    setIsFetching(true);
    const formData = new FormData();
    const addtFormData = new FormData();
    const now = new Date();
    let data;
    try {
      switch (slug) {
        case "PROGRAM":
          formData.append("data", JSON.stringify({ secret, idprogram: params }));
          data = await apiRead(formData, "kpi", "viewprogramdetail");
          if (data && data.data && data.data.length > 0) {
            setProgramDetailData(data.data);
            setPageTitle(`Detail Program ${data.data[0].name}`);
            const month = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", month: "2-digit" }).format(now);
            addtFormData.append("data", JSON.stringify({ secret, idemployee: data.data[0].idpic, month }));
            const scoredata = await apiRead(addtFormData, "kpi", "viewscore");
            setScoreData(scoredata && scoredata.data && scoredata.data.length > 0 ? scoredata.data : []);
            setIsDataShown(true);
          } else {
            setProgramDetailData([]);
            setPageTitle("");
            setScoreData([]);
            setIsDataShown(false);
          }
          break;
        case "JOB":
          formData.append("data", JSON.stringify({ secret, idaction: params }));
          data = await apiRead(formData, "kpi", "viewjobdetail");
          if (data && data.data && data.data.length > 0) {
            setJobDetailData(data.data);
            setPageTitle(`Detail Job #${params}`);
            setIsDataShown(true);
          } else {
            setJobDetailData([]);
            setPageTitle("");
            setIsDataShown(false);
          }
          break;
        case "HASIL KERJA":
          formData.append("data", JSON.stringify({ secret, idaction: params }));
          data = await apiRead(formData, "kpi", "viewjobreportdetail");
          if (data && data.data && data.data.length > 0) {
            setReportDetailData(data.data);
            setPageTitle(`Detail Hasil Kerja #${params}`);
            setIsDataShown(true);
          } else {
            setReportDetailData([]);
            setPageTitle("");
            setIsDataShown(false);
          }
          break;
        default:
          setIsDataShown(false);
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
      if (emplydata && emplydata.data && emplydata.data.length > 0) setAllEmplyData(emplydata.data);
      else setAllEmplyData([]);
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
    let switchedData;
    setIsFormFetching(true);
    try {
      switch (slug) {
        case "PROGRAM":
          switchedData = currentData(programDetailData, "idprogramdetail");
          log(`id ${slug} data switched:`, switchedData.idprogramdetail);
          setInputData({ id: switchedData.idprogramdetail, idsource: switchedData.idsource, program_name: switchedData.progname, channel: switchedData.channel, target: switchedData.target, bobot: switchedData.bobot, start_time: switchedData.starttime, end_time: switchedData.endtime, day: switchedData.day, date: switchedData.date, type: switchedData.type, desc: switchedData.info, jobplan: switchedData.job });
          setJobType(switchedData.type);
          setDay(switchedData.day);
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
      case "PROGRAM":
        if (selectedMode === "update") {
          if (jobType === "3") requiredFields = ["program_name", "channel", "target", "bobot", "start_time", "end_time", "date", "jobplan"];
          else requiredFields = ["program_name", "channel", "target", "bobot", "start_time", "end_time", "jobplan"];
        } else {
          if (jobType === "3") requiredFields = ["program.idsource", "program.progname", "program.channel", "program.target", "program.bobot", "program.starttime", "program.endtime", "program.date", "program.job"];
          else requiredFields = ["program.idsource", "program.progname", "program.channel", "program.target", "program.bobot", "program.starttime", "program.endtime", "program.job"];
        }
        break;
      case "HASIL KERJA":
        requiredFields = "correction";
        break;
      case "JOB":
        requiredFields = ["link", "desc"];
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
        case "PROGRAM":
          if (selectedMode === "update") submittedData = { secret, idprogdetail: selectedData, idsource: inputData.idsource, progname: inputData.program_name, channel: inputData.channel, target: inputData.target, bobot: inputData.bobot, starttime: inputData.start_time, endtime: inputData.end_time, day: day, date: inputData.date, type: jobType, info: inputData.desc, job: inputData.jobplan };
          else submittedData = { secret, idpic: programDetailData[0].idpic, idprogram: params, detail: inputData.program };
          break;
        case "HASIL KERJA":
          submittedData = { secret, correction: inputData.correction };
          break;
        case "JOB":
          submittedData = { secret, description: inputData.desc, note: inputData.note, link: inputData.link, options: inputData.options };
          break;
        default:
          break;
      }
      const formData = new FormData();
      formData.append("data", JSON.stringify(submittedData));
      if (slug === "HASIL KERJA") formData.append("idedit", selectedData);
      if (slug === "JOB") formData.append("idedit", selectedData);
      await apiCrud(formData, scope, endpoint);
      showNotifications("success", successmsg);
      log("submitted data:", submittedData);
      closeForm();
      await fetchData();
      await fetchAdditionalData();
    } catch (error) {
      showNotifications("danger", errormsg);
      console.error(errormsg, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (slug) {
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
            { label: "Minggu", onClick: () => handleDayChange(index, "7"), active: inputData.program[index].day === "7" },
          ];
          return buttons;
        };

        const handleFormOptionChange = (mode, params) => {
          if (mode === "type") setJobType(params);
          else setDay(params);
        };

        const typebuttons = [
          { label: "Harian", onClick: () => handleFormOptionChange("type", "1"), active: jobType === "1" },
          { label: "Mingguan", onClick: () => handleFormOptionChange("type", "2"), active: jobType === "2" },
          { label: "Bulanan", onClick: () => handleFormOptionChange("type", "3"), active: jobType === "3" },
        ];

        const daysbuttons = [
          { label: "Senin", onClick: () => handleFormOptionChange("day", "1"), active: day === "1" },
          { label: "Selasa", onClick: () => handleFormOptionChange("day", "2"), active: day === "2" },
          { label: "Rabu", onClick: () => handleFormOptionChange("day", "3"), active: day === "3" },
          { label: "Kamis", onClick: () => handleFormOptionChange("day", "4"), active: day === "4" },
          { label: "Jumat", onClick: () => handleFormOptionChange("day", "5"), active: day === "5" },
          { label: "Sabtu", onClick: () => handleFormOptionChange("day", "6"), active: day === "6" },
          { label: "Minggu", onClick: () => handleFormOptionChange("day", "7"), active: day === "7" },
        ];

        return (
          <Fragment>
            <DashboardHead title={isFetching ? "Memuat data ..." : isDataShown ? pageTitle : "Tidak ada data."} />
            <DashboardToolbar>
              <Button id={`${pageid}-back-previous-page`} buttonText="Kembali" radius="md" onClick={goBack} startContent={<Arrow direction="left" />} />
              <Button id={`add-new-data-${pageid}`} radius="md" buttonText="Tambah" onClick={openForm} startContent={<Plus />} />
            </DashboardToolbar>
            <DashboardBody>
              <Table byNumber isEditable isNoData={!isDataShown} isLoading={isFetching}>
                <THead>
                  <TR>
                    <TH type="custom" isSorted onSort={() => handleSort(programDetailData, setProgramDetailData, "status", "number")}>
                      Status
                    </TH>
                    <TH isSorted onSort={() => handleSort(programDetailData, setProgramDetailData, "progname", "text")}>
                      Nama Program
                    </TH>
                    <TH isSorted onSort={() => handleSort(programDetailData, setProgramDetailData, "type", "number")}>
                      Tipe
                    </TH>
                    <TH isSorted onSort={() => handleSort(programDetailData, setProgramDetailData, "day", "number")}>
                      Hari
                    </TH>
                    <TH isSorted onSort={() => handleSort(programDetailData, setProgramDetailData, "date", "number")}>
                      Tanggal
                    </TH>
                    <TH isSorted onSort={() => handleSort(programDetailData, setProgramDetailData, "starttime", "number")}>
                      Jam Mulai
                    </TH>
                    <TH isSorted onSort={() => handleSort(programDetailData, setProgramDetailData, "endtime", "number")}>
                      Jam Berakhir
                    </TH>
                    <TH isSorted onSort={() => handleSort(programDetailData, setProgramDetailData, "channel", "text")}>
                      Channel
                    </TH>
                    <TH isSorted onSort={() => handleSort(programDetailData, setProgramDetailData, "sourcename", "text")}>
                      Sumber
                    </TH>
                    <TH isSorted onSort={() => handleSort(programDetailData, setProgramDetailData, "target", "text")}>
                      Target
                    </TH>
                    <TH isSorted onSort={() => handleSort(programDetailData, setProgramDetailData, "bobot", "text")}>
                      Bobot
                    </TH>
                    <TH isSorted onSort={() => handleSort(programDetailData, setProgramDetailData, "achievement", "number")}>
                      Pencapaian
                    </TH>
                    <TH isSorted onSort={() => handleSort(programDetailData, setProgramDetailData, "score", "number")}>
                      Skor
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {programDetailData.map((data, index) => (
                    <TR key={index} onEdit={() => openEdit(data.idprogramdetail)}>
                      <TD type="custom">
                        <ToggleSwitch id={data.idprogramdetail} isChecked={data.status === "0"} onToggle={(e) => handleToggle(e, data.idprogramdetail, data.status === "0" ? "1" : "0", "statusprogdetail")} isLoading={isToggling} />
                      </TD>
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
                      <TD>{data.achievement}</TD>
                      <TD>{data.score}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </DashboardBody>
            <DashboardHead title="Skor Kinerja" />
            <DashboardBody>
              <Table byNumber isNoData={scoreData.length <= 0} isLoading={isFetching}>
                <THead>
                  <TR>
                    <TH isSorted onSort={() => handleSort(scoreData, setScoreData, "target", "number")}>
                      Target
                    </TH>
                    <TH isSorted onSort={() => handleSort(scoreData, setScoreData, "value", "number")}>
                      Value
                    </TH>
                    <TH isSorted onSort={() => handleSort(scoreData, setScoreData, "achievement", "number")}>
                      Pencapaian
                    </TH>
                    <TH isSorted onSort={() => handleSort(scoreData, setScoreData, "score", "number")}>
                      Skor
                    </TH>
                    <TH isSorted onSort={() => handleSort(scoreData, setScoreData, "scorecreate", "date")}>
                      Tanggal Dibuat
                    </TH>
                    <TH isSorted onSort={() => handleSort(scoreData, setScoreData, "scoreupdate", "date")}>
                      Tanggal Diupdate
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {scoreData.map((data, index) => (
                    <TR key={index}>
                      <TD>{data.target}</TD>
                      <TD>{data.value}</TD>
                      <TD>{data.achievement}</TD>
                      <TD>{data.score}</TD>
                      <TD>{newDate(data.scorecreate, "id")}</TD>
                      <TD>{data.scoreupdate === "0000-00-00 00:00:00" ? "-" : newDate(data.scoreupdate, "id")}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </DashboardBody>
            {isFormOpen && (
              <SubmitForm size="md" formTitle={selectedMode === "update" ? "Ubah Detail Program" : "Tambah Detail Program"} operation={selectedMode} fetching={isFormFetching} onSubmit={selectedMode === "update" ? (e) => handleSubmit(e, "editprogramdetail") : (e) => handleSubmit(e, "addprogramdetail")} loading={isSubmitting} onClose={closeForm}>
                {selectedMode === "update" ? (
                  <Fragment>
                    <Input id={`${pageid}-name`} radius="md" label="Nama Program" placeholder="Masukkan nama program" type="text" name="program_name" value={inputData.program_name} onChange={handleInputChange} errormsg={errors.program_name} required />
                    <TabGroup buttons={typebuttons} />
                    {jobType === "1" ? (
                      <Fieldset>
                        <Input id={`${pageid}-starttime`} radius="md" label="Jam Mulai" type="time" name="start_time" value={inputData.start_time} onChange={handleInputChange} errormsg={errors.start_time} required />
                        <Input id={`${pageid}-endtime`} radius="md" label="Jam Berakhir" type="time" name="end_time" value={inputData.end_time} onChange={handleInputChange} errormsg={errors.end_time} required />
                      </Fieldset>
                    ) : jobType === "2" ? (
                      <Fragment>
                        <TabSwitch buttons={daysbuttons} />
                        <Fieldset>
                          <Input id={`${pageid}-starttime`} radius="md" label="Jam Mulai" type="time" name="start_time" value={inputData.start_time} onChange={handleInputChange} errormsg={errors.start_time} required />
                          <Input id={`${pageid}-endtime`} radius="md" label="Jam Berakhir" type="time" name="end_time" value={inputData.end_time} onChange={handleInputChange} errormsg={errors.end_time} required />
                        </Fieldset>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <Input id={`${pageid}-date`} radius="md" label="Tanggal" type="number" placeholder="Masukkan tanggal" name="date" value={inputData.date} onChange={handleInputChange} errormsg={errors.date} required min={1} max={31} />
                        <Fieldset>
                          <Input id={`${pageid}-starttime`} radius="md" label="Jam Mulai" type="time" name="start_time" value={inputData.start_time} onChange={handleInputChange} errormsg={errors.start_time} required />
                          <Input id={`${pageid}-endtime`} radius="md" label="Jam Berakhir" type="time" name="end_time" value={inputData.end_time} onChange={handleInputChange} errormsg={errors.end_time} required />
                        </Fieldset>
                      </Fragment>
                    )}
                    <Select id={`${pageid}-source`} searchable radius="md" label="Sumber" placeholder="Pilih sumber" name="idsource" value={inputData.idsource} options={allEmplyData.map((item) => ({ value: item.idemployee, label: item.name }))} onChange={(selectedValue) => handleInputChange({ target: { name: "idsource", value: selectedValue } })} errormsg={errors.idsource} required />
                    <Fieldset>
                      <Input id={`${pageid}-channel`} radius="md" label="Channel" placeholder="Masukkan channel" type="text" name="channel" value={inputData.channel} onChange={handleInputChange} errormsg={errors.channel} required />
                      <Select id={`${pageid}-plan`} radius="md" label="Tipe" name="jobplan" noemptyval value={inputData.jobplan} options={jobplanopt} onChange={(selectedValue) => handleInputChange({ target: { name: "jobplan", value: selectedValue } })} errormsg={errors.jobplan} required />
                    </Fieldset>
                    <Fieldset>
                      <Input id={`${pageid}-target`} radius="md" label="Target" placeholder="Masukkan target" type="text" name="target" value={inputData.target} onChange={handleInputChange} errormsg={errors.target} required />
                      <Input id={`${pageid}-bobot`} radius="md" label="Bobot" placeholder="Masukkan bobot" type="text" name="bobot" value={inputData.bobot} onChange={handleInputChange} errormsg={errors.bobot} required />
                    </Fieldset>
                    <Textarea id={`${pageid}-info`} radius="md" label="Informasi Tambahan" placeholder="Masukkan informasi tambahan" name="desc" value={inputData.desc} onChange={handleInputChange} errormsg={errors.desc} rows={5} />
                  </Fragment>
                ) : (
                  <Fragment>
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
                        <Select id={`${pageid}-plan-${index}`} radius="md" label="Tipe" name="job" value={item.job} options={jobplanopt} onChange={(selectedValue) => handleRowChange("program", index, { target: { name: "job", value: selectedValue } })} errormsg={errors[`program.${index}.job`] ? errors[`program.${index}.job`] : ""} required />
                        <Textarea id={`${pageid}-info-${index}`} radius="md" label="Informasi Tambahan" placeholder="Masukkan informasi tambahan" name="info" value={item.info} onChange={(e) => handleRowChange("program", index, e)} errormsg={errors[`program.${index}.info`] ? errors[`program.${index}.info`] : ""} rows={5} />
                      </Fieldset>
                    ))}
                  </Fragment>
                )}
              </SubmitForm>
            )}
          </Fragment>
        );
      case "JOB":
        const openSCorrection = (params, data) => {
          setSelectedData(params);
          setInputData({ desc: data.description, note: data.note, link: data.link, options: data.options, correction: data.correction });
          setIsFormOpen(true);
        };

        const handleMediaSelect = async (file) => {
          if (file) {
            const link = await handleFileUpload(file);
            setInputData({ ...inputData, link });
          }
        };

        return (
          <Fragment>
            <DashboardHead title={isFetching ? "Memuat data ..." : isDataShown ? pageTitle : "Tidak ada data."} />
            <DashboardToolbar>
              <DashboardTool>
                <Button id={`${pageid}-back-previous-page`} buttonText="Kembali" radius="md" onClick={goBack} startContent={<Arrow direction="left" />} />
              </DashboardTool>
            </DashboardToolbar>
            <DashboardBody>
              <Table byNumber isNoData={!isDataShown} isLoading={isFetching}>
                <THead>
                  <TR>
                    <TH type="custom">Action</TH>
                    <TH isSorted onSort={() => handleSort(jobDetailData, setJobDetailData, "options", "text")}>
                      Tipe Pengerjaan
                    </TH>
                    <TH isSorted onSort={() => handleSort(jobDetailData, setJobDetailData, "link", "text")}>
                      Link Konten
                    </TH>
                    <TH isSorted onSort={() => handleSort(jobDetailData, setJobDetailData, "description", "text")}>
                      Deskripsi
                    </TH>
                    <TH isSorted onSort={() => handleSort(jobDetailData, setJobDetailData, "note", "text")}>
                      Catatan
                    </TH>
                    <TH isSorted onSort={() => handleSort(jobDetailData, setJobDetailData, "correction", "text")}>
                      Koreksi
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {jobDetailData.map((data, index) => (
                    <TR key={index}>
                      <TD type="custom">{data.correction === "" ? <span style={{ color: "var(--color-green)" }}>Baik</span> : <Button size="sm" buttonText="Perbaiki" onClick={() => openSCorrection(data.idactiondetail, data)} />}</TD>
                      <TD>{data.options}</TD>
                      <TD type="link">{data.link}</TD>
                      <TD>{data.description === "" ? "-" : data.description}</TD>
                      <TD>{data.note === "" ? "-" : data.note}</TD>
                      <TD>{data.correction === "" ? "Belum ada koreksi." : data.correction}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </DashboardBody>
            {isFormOpen && (
              <SubmitForm size="md" formTitle="Perbaiki Hasil Pengerjaan" operation="update" fetching={isFormFetching} onSubmit={(e) => handleSubmit(e, "editcorection")} loading={isSubmitting} onClose={closeForm}>
                <Textarea id={`${pageid}-correction`} radius="md" label="Koreksi SPV" name="correction" value={inputData.correction} rows={5} readonly />
                <Fieldset>
                  <Select id={`${pageid}-type`} noemptyval radius="md" label="Tipe Laporan" placeholder="Pilih tipe" name="options" value={inputData.options} options={reporttypeopt} onChange={(selectedValue) => handleInputChange({ target: { name: "options", value: selectedValue } })} errormsg={errors.options} required />
                  {inputData.options === "link" ? (
                    <Input id={`${pageid}-link`} type="url" radius="md" label="Link Konten" name="link" placeholder={`Masukkan link dengan https://`} value={inputData.link} onChange={handleInputChange} errormsg={errors.link} required />
                  ) : inputData.options === "img" ? (
                    <Input id={`${pageid}-link`} type="file" accept="image/*" radius="md" label="File Gambar" name="link" placeholder="Pilih Gambar" onChange={(file) => handleMediaSelect(file)} required />
                  ) : inputData.options === "video" ? (
                    <Input id={`${pageid}-link`} type="file" accept="video/*" radius="md" label="File Video" name="link" placeholder="Pilih Video" onChange={(file) => handleMediaSelect(file)} required />
                  ) : (
                    <Input id={`${pageid}-link`} type="file" radius="md" label="File" name="link" placeholder="Pilih File" onChange={(file) => handleMediaSelect(file)} required />
                  )}
                  <Textarea id={`${pageid}-desc`} radius="md" label="Deskripsi Pengerjaan" name="desc" placeholder="Masukkan hasil pengerjaan" value={inputData.desc} onChange={handleInputChange} errormsg={errors.desc} rows={5} required />
                  <Textarea id={`${pageid}-note`} radius="md" label="Catatan" name="note" placeholder="Masukkan catatan" value={inputData.note} onChange={handleInputChange} errormsg={errors.note} rows={5} />
                </Fieldset>
              </SubmitForm>
            )}
          </Fragment>
        );
      case "HASIL KERJA":
        const openACorrection = (params) => {
          setSelectedData(params);
          setIsFormOpen(true);
          log("selected job detail id:", params);
        };

        return (
          <Fragment>
            <DashboardHead title={isFetching ? "Memuat data ..." : isDataShown ? pageTitle : "Tidak ada data."} />
            <DashboardToolbar>
              <Button id={`${pageid}-back-previous-page`} buttonText="Kembali" radius="md" onClick={goBack} startContent={<Arrow direction="left" />} />
            </DashboardToolbar>
            <DashboardBody>
              <Table byNumber isNoData={!isDataShown} isLoading={isFetching}>
                <THead>
                  <TR>
                    <TH type="custom">Action</TH>
                    <TH isSorted onSort={() => handleSort(reportDetailData, setReportDetailData, "options", "text")}>
                      Tipe Pengerjaan
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportDetailData, setReportDetailData, "link", "text")}>
                      Link Konten
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportDetailData, setReportDetailData, "description", "text")}>
                      Deskripsi
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportDetailData, setReportDetailData, "note", "text")}>
                      Catatan
                    </TH>
                    <TH isSorted onSort={() => handleSort(reportDetailData, setReportDetailData, "correction", "text")}>
                      Koreksi
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {reportDetailData.map((data, index) => (
                    <TR key={index}>
                      <TD type="custom">
                        <Button size="sm" buttonText="Koreksi" onClick={() => openACorrection(data.idactiondetail)} />
                      </TD>
                      <TD>{data.options}</TD>
                      <TD type="link">{data.link}</TD>
                      <TD>{data.description === "" ? "-" : data.description}</TD>
                      <TD>{data.note === "" ? "-" : data.note}</TD>
                      <TD>{data.correction === "" ? "Belum ada koreksi." : data.correction}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </DashboardBody>
            {isFormOpen && (
              <SubmitForm size="sm" formTitle={selectedMode === "update" ? "Ubah Koreksi" : "Tambah Koreksi"} operation={selectedMode} fetching={isFormFetching} onSubmit={(e) => handleSubmit(e, "addcorection")} loading={isSubmitting} onClose={closeForm}>
                <Textarea id={`${pageid}-correction`} radius="md" label="Koreksi" placeholder="Masukkan koreksi" name="correction" value={inputData.correction} onChange={handleInputChange} errormsg={errors.correction} rows={5} />
              </SubmitForm>
            )}
          </Fragment>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchData();
    fetchAdditionalData();
  }, [slug, params, currentPage, limit]);

  if (!isLoggedin) return <Navigate to="/login" />;
  return (
    <Pages title={`${pageTitle} - Dashboard`} loading={isOptimizing}>
      <DashboardContainer>{renderContent()}</DashboardContainer>
    </Pages>
  );
};

export default DashboardParamsPage;
