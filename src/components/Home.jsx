import { Button } from "antd";
import Cookies from "js-cookie";
import { message } from "antd";
import axios from "axios";

const Home = () => {
  const userConnected = JSON.parse(Cookies.get("user"));

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
  return (
    <div className="home_container">
      <div className="header">
        <h2>Home</h2>
      </div>
      <Button type="primary" size="small" onClick={onClick}>
        Répartir les tâches
      </Button>
    </div>
  );
};

export default Home;
