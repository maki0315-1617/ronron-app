export function getCurrentUser() {
  const data = localStorage.getItem("currentUser");
  return data ? JSON.parse(data) : null;
}

export function logoutUser() {
  localStorage.removeItem("currentUser");
}

export function registerUser(username, password) {
  return new Promise((resolve, reject) => {
    if (!username || !password) {
      reject(new Error("ユーザ名とパスワードを入力してください"));
      return;
    }

    const user = { username, password };
    localStorage.setItem("currentUser", JSON.stringify(user));
    resolve(user);
  });
}
