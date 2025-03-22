import { Outlet } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar";

export function Layout() {
  return (
    <>
      <NavigationBar></NavigationBar>
      <main className="">
        <Outlet />
      </main>
    </>
  );
}
