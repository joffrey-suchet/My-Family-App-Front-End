import { Button, Card, List, Tabs } from "antd";
import Cookies from "js-cookie";
import { message } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const Home = () => {
  const userConnected = JSON.parse(Cookies.get("user"));
  const isAdmins = userConnected.role === "admins";
  const [data, setData] = useState([]);

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

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3006/users/${userConnected.squad}`
      );
      console.log(response.data);

      setData(response.data);
    } catch (error) {
      console.log(error);
      message.error(error.message.data);
    }
  }, [userConnected.squad]);

  useEffect(() => {
    getData();
  }, [getData]);

  const daysOfWeek = [
    { value: "monday", label: "Lundi" },
    { value: "tuesday", label: "Mardi" },
    { value: "wednesday", label: "Mercredi" },
    { value: "thursday", label: "Jeudi" },
    { value: "friday", label: "Vendredi" },
    { value: "saturday", label: "Samedi" },
    { value: "sunday", label: "Dimanche" },
  ];

  const displayUserTasks = (userTasks) =>
    daysOfWeek.map((day) => (
      <Card key={day.value} title={day.label}>
        <List
          dataSource={userTasks[day.value].reference}
          renderItem={(item) => <List.Item>{item} </List.Item>}
        />
      </Card>
    ));

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
          defaultActiveKey="1"
          items={data.map((user, key) => ({
            key: key,
            label: user.name,
            children: displayUserTasks(user.weeklyTasks),
          }))}
        />
      ) : (
        <p>En construction</p>
      )}
    </div>
  );
};

export default Home;
