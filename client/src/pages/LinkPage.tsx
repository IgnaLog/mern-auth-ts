import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LinkPage = () => {
  const { auth } = useAuth();

  console.log("LinkPage accessToken: " + auth?.accessToken);

  return (
    <section>
      <h1>Links</h1>
      <br />
      <h2>Public</h2>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <br />
      <h2>Private</h2>
      <Link to="/">Home</Link>
      <Link to="/editor">Editors Page</Link>
      <Link to="/admin">Admin Page</Link>
      <Link to="/lounge">Lounge Page</Link>
    </section>
  );
};

export default LinkPage;
