import { Avatar, Popconfirm, message } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import inconnu from "../icons/inconnu.jpg";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  WarningOutlined,
} from "@ant-design/icons";
const UserList = () => {
  const [users, setUsers] = useState([]);
  const user = JSON.parse(Cookies.get("user"));

  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3006/users/${user.squad}`
      );
      setUsers(response.data);
    } catch (error) {
      console.log("catch", error);
      message.error(error.response.data.message);
    }
  }, [user.squad]);
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const onDelete = async (userId) => {
    try {
      const response = await axios.post(
        `http://localhost:3006/user/delete/${userId}`
      );
      message.success(response.data.message);
      getUsers();
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  return users.length ? (
    <div className="user_list_container">
      <div className="title">
        <h2>Utilisateurs</h2>{" "}
        <Link to="/user/signup" className="custom-lk">
          <PlusCircleOutlined
            style={{ fontSize: 30, color: "white", paddingRight: "10px" }}
          />
        </Link>
      </div>

      {users?.map((user, key) => (
        <div className="usersList" key={key}>
          <div className="userData">
            <Avatar
              size={50}
              src={user.avatar || inconnu}
              style={{ marginRight: "20px" }}
            />

            <h2 key={user._id}>{user.name}</h2>
          </div>
          <div className="actionKeys">
            <Link to={`/user/${user._id}`}>
              <EditOutlined style={{ fontSize: 22, color: "#4273C8" }} />
            </Link>
            <Popconfirm
              title="Supprimer l'utilisateur?"
              okText="Confirmer"
              okButtonProps={{ type: "danger" }}
              cancelText="Annuler"
              onConfirm={() => onDelete(user._id)}
              icon={<WarningOutlined />}
            >
              <DeleteOutlined
                style={{ color: "#C30E0E", marginLeft: "20px", fontSize: 22 }}
                type="delete"
              />
            </Popconfirm>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <h1>Chargement en cour</h1>
  );
};

export default UserList;
