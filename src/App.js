import React, { useEffect, useState, Fragment } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useContent } from "@ibrahimstudio/react";
import { useAuth } from "./libs/securities/auth";
import { useApi } from "./libs/apis/office";
import { useNotifications } from "./components/feedbacks/context/notifications-context";
import { useLoading } from "./components/feedbacks/context/loading-context";
import LoginPage from "./pages/login";
import DashboardOverviewPage from "./pages/overview-dashboard";
import DashboardSlugPage from "./pages/slug-dashboard";
import DashboardParamsPage from "./pages/params-dashboard";
import ErrorPage from "./pages/404";

function App() {
  const { pathname } = useLocation();
  const { toPathname } = useContent();
  const { isLoggedin, secret, level } = useAuth();
  const { apiRead } = useApi();
  const { setLoading } = useLoading();
  const { showNotifications } = useNotifications();
  const [tabMenus, setTabMenus] = useState([]);

  const fetchData = async () => {
    const errormsg = `Terjadi kesalahan saat memuat Dashboard. Mohon periksa koneksi internet anda dan coba lagi.`;
    setLoading(true);
    const menuFormData = new FormData();
    try {
      menuFormData.append("data", JSON.stringify({ secret, level }));
      const menudata = await apiRead(menuFormData, "kpi", "viewmenu");
      const menuparams = menudata.data;
      if (menuparams && menuparams.length > 0) {
        setTabMenus(menuparams);
      } else {
        setTabMenus([]);
      }
    } catch (error) {
      showNotifications("danger", errormsg);
      console.error(errormsg, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedin) fetchData();
  }, [isLoggedin]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardOverviewPage />} />
      <Route path="*" element={<ErrorPage />} />
      {/* prettier-ignore */}
      <Fragment>
        {tabMenus.map((menu, index) => (
          <Fragment key={index}>
            {menu["Sub Menu"] && menu["Sub Menu"].map((submenu, idx) => (
              <Fragment key={idx}>
                <Route
                  path={`/${toPathname(menu["Menu Utama"].menu)}/${toPathname(submenu.submenu)}`}
                  element={<DashboardSlugPage parent={menu["Menu Utama"].menu} slug={submenu.submenu} />}
                />
                <Route
                  path={`/${toPathname(menu["Menu Utama"].menu)}/${toPathname(submenu.submenu)}/:params`}
                  element={<DashboardParamsPage parent={menu["Menu Utama"].menu} slug={submenu.submenu} />}
                />
              </Fragment>
            ))}
          </Fragment>
        ))}
      </Fragment>
    </Routes>
  );
}

export default App;
