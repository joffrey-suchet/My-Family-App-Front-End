import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  List,
  Popconfirm,
  Row,
  Tabs,
} from "antd";
import Cookies from "js-cookie";
import { message, Checkbox } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { frequency } from "../utils/frequency";
import { WarningOutlined } from "@ant-design/icons";
const Home = () => {
  const userConnected = JSON.parse(Cookies.get("user"));

  const isAdmins = userConnected.role === "admins";
  const [users, setUsers] = useState([]);
  const [userTasks, setUserTasks] = useState();
  const [stat, setStat] = useState("0");

  const onClick = async () => {
    try {
      const body = { squad: userConnected.squad };
      const response = await axios.post(
        "http://localhost:3006/tasks/distribution",
        body
      );
      console.log(response);
    } catch (error) {
      console.log("catch", error);

      message.error(error.response.data.message);
    }
  };

  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3006/users/${userConnected.squad}`
      );

      setUsers(response.data);
    } catch (error) {
      console.log(error);
      message.error(error.message.data);
    }
  }, [userConnected.squad]);

  const getUserTasks = useCallback(async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3006/userWeeklyTasks/${id}`
      );
      setUserTasks(response.data);
    } catch (error) {
      console.log(error);
      message.error(error.message.data);
    }
  }, []);

  useEffect(() => {
    isAdmins && getUsers();
    getUserTasks(userConnected.id);
  }, [isAdmins, getUsers, getUserTasks, userConnected.id]);

  const onCheckboxhange = async (day, task, keychanged) => {
    console.log(day);
    console.log(task);
    const body = task;
    body[keychanged] = true;
    console.log(body);

    await axios.post(
      `http://localhost:3006/user/taskCompleted/${userConnected.id}/${task.task._id}`,
      body
    );
    window.location.reload();
  };

  const displayUserTasks = () => {
    return (
      <Row
        gutter={[12, 20]}
        style={{
          padding: "0 15px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {userTasks.weeklyTasks.map((day, key) => (
          <Col span={24} key={key}>
            <Card
              title={
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    color: "darkblue",
                    textAlign: "center",
                  }}
                >
                  {frequency[day.day]}
                </div>
              }
              headStyle={{
                border: "none",
                margin: "-15px",
                height: "50px",
              }}
              className="card"
            >
              <List
                style={{ margin: "-20px" }}
                dataSource={day.tasks}
                renderItem={(item) => (
                  <List.Item key={item._id} style={{ paddingBottom: "0px" }}>
                    <List.Item.Meta
                      avatar={
                        item.task.avatar && (
                          <Avatar src={item.task.avatar} size={30} />
                        )
                      }
                      title={item.task.name}
                      description={
                        <Descriptions>
                          <Descriptions.Item label="point">
                            {item.value}
                          </Descriptions.Item>
                        </Descriptions>
                      }
                    />
                    <div>
                      <h3>Valider</h3>
                      <Popconfirm
                        title="Confirmer que la tâche est effectué?"
                        okText="Confirmer"
                        okButtonProps={{ type: "danger" }}
                        cancelText="Annuler"
                        onConfirm={() =>
                          onCheckboxhange(day, item, "completed")
                        }
                        icon={<WarningOutlined />}
                      >
                        <Checkbox
                          defaultChecked={item.completed}
                          style={{ transform: "scale(1.5)", margin: "10px" }}
                          disabled={
                            userConnected.id !== userTasks._id || item.completed
                          }
                        />
                      </Popconfirm>
                      <br />
                      <Checkbox
                        style={{ transform: "scale(1.5)", margin: "10px" }}
                        disabled={
                          userConnected.id === userTasks._id ? true : false
                        }
                      />
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  const onChange = (id) => {
    getUserTasks(id);

    setStat(id);
  };

  const removeTabs = () => {
    setStat("0");
  };

  return (
    <div className="home_container">
      <div className="header">
        <h2>{userConnected.name}</h2>
      </div>
      {isAdmins && (
        <Button type="primary" size="small" onClick={onClick}>
          Répartir les tâches
        </Button>
      )}

      {isAdmins ? (
        <Tabs
          centered
          tabBarExtraContent={
            stat === "0" ? (
              <></>
            ) : (
              <Button>
                <CloseOutlined
                  onClick={removeTabs}
                  style={{ color: "red", size: "20px" }}
                />
              </Button>
            )
          }
          activeKey={stat}
          onChange={onChange}
          items={users.map((user) => ({
            key: user._id,
            label: user.name,
            children: userTasks && displayUserTasks(),
          }))}
        />
      ) : (
        userTasks && displayUserTasks()
      )}
    </div>
  );
};

export default Home;
