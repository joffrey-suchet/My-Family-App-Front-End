import { Link } from "react-router-dom";
import settings from "../icons/settings.png";
import loger from "../icons/loger.png";
import { Avatar } from "antd";
import logo from "../icons/logo.png";
const Mymenu = () => {
  return (
    <div className="menu">
      <Link to="/settings">
        <Avatar size={50} src={settings} />
      </Link>
      <Link to="/">
        <Avatar size={50} src={loger} />
      </Link>
      <img className="logo" alt="logo" src={logo} />
    </div>
  );
};

export default Mymenu;
