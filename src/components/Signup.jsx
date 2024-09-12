import {
  Form,
  Input,
  Button,
  message,
  Select,
  Avatar,
  Switch,
  Upload,
} from "antd";
import axios from "axios";
import ImgCrop from "antd-img-crop";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useDraggerProps } from "../utils/draggerProps";
import Cookies from "js-cookie";

const Signup = ({ option }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [base64, setBase64] = useState("");

  const { id } = useParams();

  const roles = [
    { value: "user", name: "Utilisateur" },
    { value: "admins", name: "Administrateur" },
  ];

  const userConnected = JSON.parse(Cookies.get("user"));
  const draggerProps = useDraggerProps(fileList, setFileList, setBase64);
  const getUser = useCallback(async () => {
    const { data } = await axios.get(`http://localhost:3006/user/${id}`);

    setUser(data);
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    if (option === "edit") getUser();
    setIsLoading(false);
  }, [option, getUser]);

  const onFinish = async (body) => {
    body.squad = userConnected.squad;
    body.avatar = fileList;
    const formData = new FormData();
    Object.keys(body).forEach((key) => {
      formData.append(key, body[key]);
    });
    try {
      if (body.name) {
        const response = await axios.post(
          `http://localhost:3006/user/${option}/${option === "edit" ? id : ""}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          if (option === "create") {
            message.success("L'utilisateur a bien été créé!");
          } else {
            message.success("L'utilisateur a bien été mofifié!");
          }
        }
      }
      navigate("/users");
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const onChange = (checked) => {
    setShowPassword(!showPassword);
  };

  return (option === "create") & !isLoading || user ? (
    <div
      className={
        option === "create" ? "formContainerSignup" : "formContainerUserUpdate"
      }
    >
      <Form onFinish={onFinish} layout={"vertical"}>
        <Form.Item
          label="Nom d'utilisateur"
          name="name"
          initialValue={user && user.name}
          rules={[
            {
              required: true,
              message: "Veuillez saisir votre nom d'utilisateur!",
            },
          ]}
        >
          <Input autoComplete="username" />
        </Form.Item>
        <Form.Item label="Avatar">
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
        {option === "create" && (
          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le role!",
              },
            ]}
          >
            <Select>
              {roles.map((role) => (
                <Select.Option key={role.value} value={role.value}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {option === "edit" && (
          <Form.Item label="Modifier le mot de passe">
            <Switch
              checkedChildren="oui"
              unCheckedChildren="non"
              onChange={onChange}
            />
          </Form.Item>
        )}

        {(option === "create" || showPassword) && (
          <>
            {option === "edit" && (
              <Form.Item
                label="Mot de passe actuel"
                name="currentPassword"
                rules={[
                  {
                    required: true,
                    message: "veuillez saisir votre mot de passe actuel",
                  },
                ]}
              >
                <Input.Password autoComplete="current-password" />
              </Form.Item>
            )}
            <Form.Item
              label="Nouveau mot de passe"
              name="password"
              rules={[
                {
                  required: true,
                  message: "veuillez saisir votre nouveau mot de passe",
                },
              ]}
            >
              <Input.Password autoComplete="new-password" />
            </Form.Item>
            <Form.Item
              label="Confimer votre nouveau mot de passe"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "veuillez confirmer votre mot de passe",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Le nouveau mot de passe que vous avez saisi ne correspond pas !"
                      )
                    );
                  },
                }),
              ]}
              dependencies={["password"]}
              hasFeedback
            >
              <Input.Password autoComplete="confirm-password" />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {option === "create"
              ? "Créer l'utilisateur"
              : "Modifier l'utilisateur"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  ) : (
    <h1>Chargement en cour</h1>
  );
};

export default Signup;
