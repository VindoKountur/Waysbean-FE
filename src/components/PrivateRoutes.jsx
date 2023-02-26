import { Outlet, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const UserRoute = () => {
  const [cookies, setCookie] = useCookies(["users"]);
  let isUser = cookies.users?.email && cookies.users.email !== 'admin@mail.com';

  return isUser ? <Outlet /> : <Navigate to="/" />;
}


export const AdminRoute = () => {
  const [cookies, setCookie] = useCookies(["users"]);
  let isAdmin = cookies.users?.email === "admin@mail.com";

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
}
