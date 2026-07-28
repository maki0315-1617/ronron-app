import React, { useState } from "react";
import { registerUser } from "../utils/storage";

export default function UserRegister({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    setErrorMessage("");

    try {
      const user = await registerUser(username, password);
      onLogin(user);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      <h2>ユーザ登録</h2>

      <div>
        <label>ユーザ名：</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label>パスワード：</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={handleRegister}>登録</button>

      {errorMessage && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
