import { Avatar, Button, Card, Col, Descriptions, List, Row, Tabs } from "antd";
import Cookies from "js-cookie";
import { message } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { frequency } from "../utils/frequency";

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
      console.log(response.data);

      setUsers(response.data);
    } catch (error) {
      console.log(error);
      message.error(error.message.data);
    }
  }, [userConnected.squad]);

  const getUserTasks = useCallback(async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3006/userDailyTasks/${id}`
      );
      console.log(response.data);

      setUserTasks(response.data);
    } catch (error) {
      console.log(error);
      message.error(error.message.data);
    }
  }, []);

  useEffect(() => {
    isAdmins && getUsers();
  }, [isAdmins, getUsers]);

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
            <Card title={frequency[day.day]}>
              <List
                dataSource={day.tasks}
                renderItem={(item) => (
                  <List.Item key={item._id}>
                    <List.Item.Meta
                      avatar={
                        item.avatar && <Avatar src={item.avatar} size={50} />
                      }
                      title={<h2>{item.name}</h2>}
                      description={
                        <Descriptions>
                          <Descriptions.Item label="point">
                            {item.value}
                          </Descriptions.Item>
                        </Descriptions>
                      }
                    />
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
        <h2>Home</h2>
      </div>
      <Button type="primary" size="small" onClick={onClick}>
        Répartir les tâches
      </Button>
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
        <p>En construction</p>
      )}
    </div>
  );
};

export default Home;
