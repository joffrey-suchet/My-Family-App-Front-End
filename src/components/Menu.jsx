import { Link } from "react-router-dom";
import settings from "../icons/settings.png";
import loger from "../icons/loger.png";
import { Avatar } from "antd";
const Mymenu = () => {
  return (
    <div className="menu">
      <Link to="/settings">
        <Avatar size={50} src={settings} />
      </Link>
      <Link to="/">
        <Avatar size={50} src={loger} />
      </Link>
    </div>
  );
};

export default Mymenu;
