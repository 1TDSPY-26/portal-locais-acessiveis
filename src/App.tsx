import {Outlet} from "react-router";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
