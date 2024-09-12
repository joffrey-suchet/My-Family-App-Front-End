import { Link } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
const Settings = () => {
  return (
    <div className="settingsContainer">
      <h1 className="settingTitle">Paramètres</h1>
      <div className="settingLine">
        <Link to="/users" className="custom-link">
          <h2>Utilisateurs</h2>
        </Link>
        <Link to={"/user/signup"}>
          <PlusCircleOutlined
            style={{ fontSize: 30, color: "green", paddingRight: "10px" }}
          />
        </Link>
      </div>
      <div className="settingLine">
        <Link to="/tasksList" className="custom-link">
          <h2>Taches</h2>
        </Link>
        <Link to="/task/create">
          <PlusCircleOutlined
            style={{ fontSize: 30, color: "green", paddingRight: "10px" }}
          />
        </Link>
      </div>
    </div>
  );
};
export default Settings;
