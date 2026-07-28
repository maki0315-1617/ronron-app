import React, { useState } from "react";
import { registerUser } from "./storage";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    setErrorMessage(""); // エラー初期化

    try {
      await registerUser(username, password);
      alert("登録が完了しました！");
    } catch (err) {
      // storage.js からのエラーメッセージを表示
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

      {/* エラーメッセージ表示 */}
      {errorMessage && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
