import { Button, Card, Input, message, Radio } from "antd";
import { Form } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

const Login = () => {
  const [switchForm, setSwitchForm] = useState(false);

  const handleLogin = async (body) => {
    try {
      const response = await axios.post("http://localhost:3006/login", body);
      if (response.data) {
        Cookies.set("user", JSON.stringify(response.data));
        window.location.reload();
      } else console.log(response);
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const handleCreateSquad = async (body) => {
    try {
      const response = await axios.post("http://localhost:3006/squad", body);
      if (response.status === 200) {
        Cookies.set("user", JSON.stringify(response.data));
        message.success("Le groupe est créé");
        window.location.reload();
      }
    } catch (error) {
      console.log(error.response);
      message.error(error.response.data.message);
    }
  };
  const formChange = (e) => {
    setSwitchForm(e.target.value);
  };
  return (
    <div className="login_form">
      <Card
        className="form_card"
        style={{
          marginBottom: "30px",
          width: "80vw",
          maxWidth: "400px",
          minWidth: "300px",
        }}
        title={
          <Radio.Group value={switchForm} onChange={formChange}>
            <Radio.Button value={true}>Créer un groupe</Radio.Button>
            <Radio.Button value={false}>Se connecter</Radio.Button>
          </Radio.Group>
        }
      >
        {switchForm ? (
          <Form onFinish={handleCreateSquad} layout={"vertical"}>
            <Form.Item
              label="Nom du groupe"
              name="squad"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir le nom du groupe!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Nom de l'utilisateur"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir votre nom d'utilisateur!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mot de passe"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir votre Mot de passe!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Enregistrer
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form onFinish={handleLogin} layout={"vertical"}>
            <Form.Item
              label="Nom du groupe"
              name="squad"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir le nom du groupe!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Nom d'utilisateur"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir votre nom d'utilisateur!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mot de passe"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir votre Mot de passe!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Se connecter
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};
export default Login;
