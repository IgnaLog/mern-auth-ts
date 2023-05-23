import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState<string[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const effectRan = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    if (effectRan.current === true || import.meta.env.PROD) {
      const getUsers = async () => {
        try {
          const response = await axiosPrivate.get("/users", {
            signal: controller.signal,
          });
          const userNames = response.data.map(
            (user: { username: any }) => user.username
          );
          console.log(response.data);
          setUsers(userNames);
        } catch (err) {
          console.error(err);
          navigate("/login", { state: { from: location }, replace: true });
        }
      };

      getUsers();
    }
    return () => {
      effectRan.current = true;
      controller.abort();
    };
  }, []);

  return (
    <article>
      <h2>Users List</h2>
      {users?.length ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  );
};

export default Users;
