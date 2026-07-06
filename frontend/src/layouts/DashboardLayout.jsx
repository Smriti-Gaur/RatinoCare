import { Outlet } from "react-router-dom";

const DashboardLayout = () => {

  return (

    <div className="min-h-screen">

      Dashboard Layout

      <Outlet />

    </div>

  );

};

export default DashboardLayout;