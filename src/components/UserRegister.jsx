// components/UserRegister.jsx
import React, { useState } from "react";
import { registerUser } from "../utils/storage";

const UserRegister = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage("ユーザ名とパスワードを入力してください。");
      return;
    }
    const user = registerUser(username, password);
    setMessage("登録しました。ログイン状態になります。");
    onLogin(user);
  };

  return (
    <div>
      <h2>ユーザ登録画面</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <div style={{ marginBottom: "8px" }}>
          <label>
            ユーザ名:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "8px" }}>
          <label>
            パスワード:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <button type="submit">登録</button>
      </form>
      {message && <p style={{ marginTop: "8px" }}>{message}</p>}
    </div>
  );
};

export default UserRegister;
