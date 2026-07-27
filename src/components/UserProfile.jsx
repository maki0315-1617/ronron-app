import React, { useState } from "react";
import { getCurrentUser, updateUserProfile, loginUser } from "../utils/storage";

const UserProfile = ({ currentUser, onLogin }) => {
  const [user, setUser] = useState(currentUser || getCurrentUser());
  const [bio, setBio] = useState(user?.bio || "");
  const [favoriteColor, setFavoriteColor] = useState(
    user?.favoriteColor || ""
  );
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!user) {
      setMessage("ログインしてください。");
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
      setMessage("ログイン失敗。ユーザ名/パスワードを確認してください。");
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

      <section>
        <h3>ログイン</h3>
        <form onSubmit={handleLogin} style={{ maxWidth: "400px" }}>
          <label>
            ユーザ名:
            <input
              type="text"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            パスワード:
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>

          <button type="submit">ログイン</button>
        </form>
      </section>

      <section style={{ marginTop: "24px" }}>
        <h3>プロフィール入力</h3>

        {user ? (
          <form onSubmit={handleProfileSave} style={{ maxWidth: "400px" }}>
            <label>
              自己紹介:
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ width: "100%", height: "80px" }}
              />
            </label>

            <label>
              好きな色:
              <input
                type="text"
                value={favoriteColor}
                onChange={(e) => setFavoriteColor(e.target.value)}
                style={{ width: "100%" }}
              />
            </label>

            <button type="submit">プロフィール保存</button>
          </form>
        ) : (
          <p>ログインしてください。</p>
        )}
      </section>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UserProfile;
