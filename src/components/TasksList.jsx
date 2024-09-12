import { Avatar, Card, Descriptions, List, Popconfirm, message } from "antd";
import axios from "axios";
import taskIcon from "../icons/task.png";
import { PlusCircleOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  DeleteOutlined,
  EditOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const user = Cookies.get("user") && JSON.parse(Cookies.get("user"));
const Task = () => {
  const [tasks, setTasks] = useState(null);
  const [isloading, setIsLoading] = useState(false);

  const getTasks = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3006/tasks/${user.squad}`
      );
      setTasks(data);
    } catch (error) {
      message.error(error.response.message);
    }
  };

  const frequency = [
    { value: "monday", label: "Lundi" },
    { value: "tuesday", label: "Mardi" },
    { value: "wednesday", label: "Mercredi" },
    { value: "thursday", label: "Jeudi" },
    { value: "friday", label: "Vendredi" },
    { value: "saturday", label: "Samedi" },
    { value: "sunday", label: "Dimanche" },
  ];

  useEffect(() => {
    setIsLoading(true);
    getTasks();
    setIsLoading(false);
  }, []);

  const onDelete = async (taskId) => {
    try {
      const response = await axios.post(
        `http://localhost:3006/task/delete/${taskId}`
      );
      message.success(response.data.message);
      getTasks();
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  return isloading ? (
    <h1>Chargement en cour</h1>
  ) : (
    <div className="task_container">
      <div className="title">
        <h2>Liste des tâches</h2>
        <Link to="/task/create">
          <PlusCircleOutlined
            style={{ fontSize: 30, color: "white", paddingRight: "10px" }}
          />
        </Link>
      </div>

      {tasks?.map((task) => (
        <Card
          // title={task.name}
          title={
            <div className="cardTitle">
              <Avatar
                size={60}
                src={task.avatar || taskIcon}
                style={{ marginRight: "20px" }}
              />
              <h2>{task.name}</h2>
            </div>
          }
          style={{
            width: "95%",
            backgroundColor: "#95D0B4",
            marginBottom: "15px",
            border: "solid #327B5A 1px",
          }}
          key={task._id}
          extra={
            <div className="actionKeys">
              <Link to={`/task/edit/${task._id}`}>
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
          }
        >
          <Descriptions column={3}>
            <Descriptions.Item label="point" key={1} span={3}>
              {task.value}
            </Descriptions.Item>
            <Descriptions.Item label="frequence" key={2} span={3}>
              <List
                dataSource={task.frequency}
                renderItem={(item) => (
                  <List.Item key={item}>
                    {frequency.map((day) => {
                      if (day.value === item) {
                        return <p key={day.value}>{day.label}</p>;
                      } else {
                        return null;
                      }
                    })}
                  </List.Item>
                )}
              />
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ))}
    </div>
  );
};

export default Task;
