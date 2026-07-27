import React, { useState } from "react";
import Calendar from "./components/Calendar";
import UserRegister from "./components/UserRegister";
import UserProfile from "./components/UserProfile";
import { getCurrentUser } from "./utils/storage";

const App = () => {
  const [screen, setScreen] = useState("calendar");
  const [user, setUser] = useState(getCurrentUser());

  const handleLogin = (userObj) => {
    setUser(userObj);
    setScreen("calendar");
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "16px" }}>
      <header style={{ marginBottom: "16px" }}>
        <h1>ロン君のカレンダー</h1>

        {/* 黒猫ロン君のイラスト */}
        <img
          src="/ron.png"
          alt="黒猫ロン君"
          style={{ width: "120px", marginBottom: "12px" }}
        />

        <nav style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <button onClick={() => setScreen("calendar")}>カレンダー</button>
          <button onClick={() => setScreen("register")}>ユーザ登録</button>
          <button onClick={() => setScreen("profile")}>ユーザ入力</button>
        </nav>

        <div style={{ marginTop: "8px" }}>
          {user ? (
            <span>ログイン中ユーザ: {user.username}</span>
          ) : (
            <span>未ログイン</span>
          )}
        </div>
      </header>

      <main>
        {screen === "calendar" && <Calendar currentUser={user} />}
        {screen === "register" && <UserRegister onLogin={handleLogin} />}
        {screen === "profile" && (
          <UserProfile currentUser={user} onLogin={handleLogin} />
        )}
      </main>
    </div>
  );
};

export default App;
