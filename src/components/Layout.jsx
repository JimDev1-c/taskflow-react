import { Outlet } from "react-router-dom";
import { BarreLaterale } from "./BarreLaterale";

export const Layout = () => {
  return (
    // Le layout conserve la navigation visible et injecte la page active dans Outlet.
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <BarreLaterale />
      <main style={{ flex: 1, padding: "30px", background: "#F8FAFC" }}>
        <Outlet />
      </main>
    </div>
  );
};