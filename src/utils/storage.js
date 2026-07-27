// utils/storage.js
// localStorage を簡易DBとして扱うヘルパー

const USERS_KEY = "ron_calendar_users";
const CURRENT_USER_KEY = "ron_calendar_current_user";
const DAY_DATA_PREFIX = "ron_calendar_daydata_"; // + userId

const loadUsers = () => {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerUser = (username, password) => {
  const users = loadUsers();
  const exists = users.find((u) => u.username === username);
  if (exists) {
    // 既存ユーザは上書きせず、そのまま返す
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(exists));
    return exists;
  }
  const newUser = {
    id: Date.now().toString(),
    username,
    password,
    bio: "",
    favoriteColor: "",
  };
  users.push(newUser);
  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  return newUser;
};

export const loginUser = (username, password) => {
  const users = loadUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return null;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const getCurrentUser = () => {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const updateUserProfile = (userId, { bio, favoriteColor }) => {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return null;
  const updated = {
    ...users[idx],
    bio,
    favoriteColor,
  };
  users[idx] = updated;
  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
  return updated;
};

// 日付ごとの ○×△ と時間を保存・読み込み
export const loadDayData = (userId) => {
  const raw = localStorage.getItem(DAY_DATA_PREFIX + userId);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const saveDayData = (userId, data) => {
  localStorage.setItem(DAY_DATA_PREFIX + userId, JSON.stringify(data));
};
