import MainLayout from "../../layout/MainLayout";
import { privateRoutes } from "./privateRoutes";
import ProtectRoute from "./ProtectRoute";

export const getRoutes = () => {
  // Wrap private routes with ProtectRoute for access control
  privateRoutes.forEach((r) => {
    r.element = <ProtectRoute route={r}>{r.element}</ProtectRoute>;
  });

  return {
    path: "/",
    element: <MainLayout />,
    children: privateRoutes,
  };
};
