import { Avatar, Button, Form, Input, message, Select, Upload } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import ImgCrop from "antd-img-crop";
import { useDraggerProps } from "../utils/draggerProps";

const CreateUpdateTask = ({ option }) => {
  const [task, setTask] = useState(null);

  const [selectedDays, setSelectedDays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [base64, setBase64] = useState("");
  const user = JSON.parse(Cookies.get("user"));

  const draggerProps = useDraggerProps(fileList, setFileList, setBase64);

  const { Option } = Select;
  const { id } = useParams();
  const navigate = useNavigate();

  const frequency = [
    { value: "monday", label: "Lundi" },
    { value: "tuesday", label: "Mardi" },
    { value: "wednesday", label: "Mercredi" },
    { value: "thursday", label: "Jeudi" },
    { value: "friday", label: "Vendredi" },
    { value: "saturday", label: "Samedi" },
    { value: "sunday", label: "Dimanche" },
  ];

  const point = [
    { value: 1, name: 1 },
    { value: 2, name: 2 },
    { value: 3, name: 3 },
    { value: 4, name: 4 },
    { value: 5, name: 5 },
  ];

  const onFinish = async (body) => {
    body.squad = user.squad;
    body.avatar = fileList;
    body.frequency = selectedDays;

    const formData = new FormData();
    Object.keys(body).forEach((key) => {
      if (key === "frequency") {
        formData.append(key, JSON.stringify(body[key]));
      } else {
        formData.append(key, body[key]);
      }
    });
    try {
      if (body.name && body.frequency) {
        const response = await axios.post(
          `http://localhost:3006/task/${option}/${
            option === "edit" ? task._id : ""
          }`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          if (option === "create") {
            message.success("La tâche a bien été créé!");
          } else {
            message.success("La tâche a bien été mofifié!");
          }
          navigate("/tasksList");
        }
      }
    } catch (error) {
      console.log("catsh", error);

      message.error(error.response.data.message);
    }
  };

  const getTask = useCallback(async () => {
    const { data } = await axios.get(`http://localhost:3006/task/${id}`);
    setTask(data);
    setSelectedDays(data.frequency);
  }, [id]);

  useEffect(() => {
    setIsLoading(true);

    if (option === "edit") getTask();
    setIsLoading(false);
  }, [getTask, option]);

  const handleChange = (selected) => {
    if (selected.includes("selectAll")) {
      const daysValues = [];
      frequency.forEach((day) => daysValues.push(day.value));
      setSelectedDays(daysValues);
    } else {
      setSelectedDays(selected);
    }
    console.log(selectedDays);
  };

  return (option === "create") & !isLoading || task ? (
    <div
      className={
        option === "create"
          ? "formContainerCreateTask"
          : "formContainerTaskUpdate"
      }
    >
      {option === "edit" ? <h1>Modification</h1> : <h1>Créer une tache</h1>}

      <Form onFinish={onFinish} layout={"vertical"} className="form">
        <Form.Item
          label="Nom de la tâche"
          name="name"
          initialValue={task && task.name}
          rules={[
            {
              required: true,
              message: "Veuillez saisir le nom!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Avatar" name="avatar">
          <ImgCrop rotate>
            <Upload {...draggerProps} className="avatar">
              {base64 ? (
                <Avatar size={100} src={base64} />
              ) : (
                <p>Glissez ou cliquez</p>
              )}
            </Upload>
          </ImgCrop>
        </Form.Item>
        <Form.Item
          label="Fréquence"
          name="frequency"
          rules={[
            {
              required: true,
              message: "Veuillez saisir une fréquence",
            },
          ]}
          initialValue={option === "edit" ? task.frequency : []}
        >
          <Select
            mode="multiple"
            allowClear
            onChange={handleChange}
            value={selectedDays}
          >
            <Option value="selectAll">Tout les jours</Option>
            {frequency.map((day) => (
              <Option key={day.value} value={day.value}>
                {day.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Nombre de points"
          name="value"
          initialValue={option === "edit" && task?.value}
        >
          <Select>
            {point.map((p) => (
              <Option value={p.value} key={p.value}>
                {p.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Enregistrer
          </Button>
        </Form.Item>
      </Form>
    </div>
  ) : (
    <h1>Chargement en cour</h1>
  );
};
export default CreateUpdateTask;
