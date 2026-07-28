import React, { useState } from "react";
import Calendar from "./components/Calendar";
import UserRegister from "./components/UserRegister";
import UserProfile from "./components/UserProfile";
import { getCurrentUser, logoutUser } from "./utils/storage";

const App = () => {
  const [screen, setScreen] = useState("calendar");
  const [user, setUser] = useState(getCurrentUser());

  const handleLogin = (userObj) => {
    setUser(userObj);
    setScreen("calendar");
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setScreen("calendar");
  };

  return (
    <div className="container py-3">
      <header className="mb-3">
        <h1 className="mb-2">ロン君のお世話カレンダー</h1>

        <img
          src="/ron.png"
          alt="黒猫ロン君"
          style={{ width: "120px" }}
          className="mb-3"
        />

        <nav className="d-flex gap-2 align-items-center mb-2">
          <button className="btn btn-primary" onClick={() => setScreen("calendar")}>
            カレンダー
          </button>
          <button className="btn btn-secondary" onClick={() => setScreen("register")}>
            ユーザ登録
          </button>
          <button className="btn btn-info" onClick={() => setScreen("profile")}>
            ログイン
          </button>

          {user && (
            <button
              className="btn btn-danger ms-3"
              onClick={handleLogout}
            >
              ログアウト
            </button>
          )}
        </nav>

        <div>
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
