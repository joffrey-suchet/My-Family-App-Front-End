import React from "react";

import "./scss/App.scss";

import Mymenu from "./components/Menu";
import Signup from "./components/Signup";
import UserList from "./components/UserList";
import Settings from "./components/Settings";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";

import Cookies from "js-cookie";
import Login from "./components/Login";
import TasksList from "./components/TasksList";
import CreateUpdateTask from "./components/CreateUpdateTask";

function App() {
  const user = Cookies.get("user");

  return !user ? (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  ) : (
    <Router>
      <Mymenu />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/user/:id" element={<Signup option="edit" />} />
          <Route path="/user/signup" element={<Signup option="create" />} />
          <Route path="/taskslist" element={<TasksList />} />
          <Route
            path="/task/create"
            element={<CreateUpdateTask option="create" />}
          />
          <Route
            path="/task/edit/:id"
            element={<CreateUpdateTask option="edit" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
