import { Link } from "react-router-dom";

export function NavigationBar() {
  return (
    <>
      <div className="container-fluid bg-primary ">
        <Link to="/">
          <button className="btn m-2 fw-medium text-bg-primary">Home</button>
        </Link>
        <Link to="/userPage">
          <button className="btn m-2 fw-medium text-bg-primary">User Page</button>
        </Link>
        <Link to="/dashboard">
          <button className="btn m-2 fw-medium text-bg-primary">Dashboard</button>
        </Link>
      </div>
    </>
  );
}
