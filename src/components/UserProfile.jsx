// components/UserProfile.jsx
import React, { useState } from "react";
import { getCurrentUser, updateUserProfile, loginUser } from "../utils/storage";

const UserProfile = ({ currentUser, onLogin }) => {
  const [user, setUser] = useState(currentUser || getCurrentUser());
  const [bio, setBio] = useState(user?.bio || "");
  const [favoriteColor, setFavoriteColor] = useState(user?.favoriteColor || "");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!user) {
      setMessage("ログインしてからプロフィールを保存してください。");
      return;
    }
    const updated = updateUserProfile(user.id, { bio, favoriteColor });
    setUser(updated);
    onLogin(updated);
    setMessage("プロフィールを保存しました。");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const logged = loginUser(loginName, loginPassword);
    if (!logged) {
      setMessage("ログインに失敗しました。ユーザ名/パスワードを確認してください。");
      return;
    }
    setUser(logged);
    setBio(logged.bio || "");
    setFavoriteColor(logged.favoriteColor || "");
    onLogin(logged);
    setMessage("ログインしました。");
  };

  return (
    <div>
      <h2>ユーザ入力画面（プロフィール）</h2>

      <section style={{ marginBottom: "24px" }}>
        <h3>ログイン</h3>
        <form onSubmit={handleLogin} style={{ maxWidth: "400px" }}>
          <div style={{ marginBottom: "8px" }}>
            <label>
              ユーザ名:
              <input
                type="text"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "8px" }}>
            <label>
              パスワード:
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{ width: "100%" }}
              />
            </label>
          </div>
          <button type="submit">ログイン</button>
        </form>
      </section>

      <section>
        <h3>プロフィール入力</h3>
        {user ? (
          <form onSubmit={handleProfileSave} style={{ maxWidth: "400px" }}>
            <div style={{ marginBottom: "8px" }}>
              <label>
                自己紹介:
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ width: "100%", height: "80px" }}
                />
              </label>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <label>
                好きな色:
                <input
                  type="text"
                  value={favoriteColor}
                  onChange={(e) => setFavoriteColor(e.target.value)}
                  style={{ width: "100%" }}
                />
              </label>
            </div>
            <button type="submit">プロフィール保存</button>
          </form>
        ) : (
          <p>ログインしてからプロフィールを編集できます。</p>
        )}
      </section>

      {message && <p style={{ marginTop: "8px" }}>{message}</p>}
    </div>
  );
};

export default UserProfile;
