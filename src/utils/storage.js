import { supabase } from "./supabase";

/* -----------------------------
   ユーザ登録（重複チェック付き）
----------------------------- */
export const registerUser = async (username, password) => {
  // 既存ユーザ名のチェック
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .single();

  if (existingUser) {
    throw new Error("このユーザ名は既に使われています");
  }

  // 新規登録
  const { data, error } = await supabase
    .from("users")
    .insert([{ username, password }])
    .select()
    .single();

  if (error) throw error;

  localStorage.setItem("current_user", JSON.stringify(data));
  return data;
};

/* -----------------------------
   ログイン
----------------------------- */
export const loginUser = async (username, password) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !data) return null;

  localStorage.setItem("current_user", JSON.stringify(data));
  return data;
};

/* -----------------------------
   ログアウト
----------------------------- */
export const logoutUser = () => {
  localStorage.removeItem("current_user");
};

/* -----------------------------
   現在ユーザ取得
----------------------------- */
export const getCurrentUser = () => {
  const raw = localStorage.getItem("current_user");
  if (!raw) return null;
  return JSON.parse(raw);
};

/* -----------------------------
   プロフィール更新
----------------------------- */
export const updateUserProfile = async (userId, { bio, favoriteColor }) => {
  const { data, error } = await supabase
    .from("users")
    .update({
      bio,
      favoriteColor,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("プロフィール更新エラー:", error);
    return null;
  }

  localStorage.setItem("current_user", JSON.stringify(data));
  return data;
};

/* -----------------------------
   日付データ読み込み（date型対応）
----------------------------- */
export const loadDayData = async (userId) => {
  const { data, error } = await supabase
    .from("day_data")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("読み込みエラー:", error);
    return {};
  }

  const result = {};
  data.forEach((row) => {
    // Supabase の date 型は "YYYY-MM-DD" 形式で返る
    const key = row.date_key; // 例: "2026-07-01"
    result[key] = { mark: row.mark, time: row.time };
  });

  return result;
};

/* -----------------------------
   日付データ保存（date型対応）
----------------------------- */
export const saveDayData = async (userId, dayStates) => {
  const rows = Object.entries(dayStates).map(([date_key, v]) => {
    // date_key を "YYYY-MM-DD" 形式に統一
    const normalizedKey = new Date(date_key)
      .toISOString()
      .split("T")[0]; // 例: "2026-07-01"

    return {
      user_id: userId,
      date_key: normalizedKey,
      mark: v.mark || null,
      time: v.time || null,
    };
  });

  // 既存削除
  await supabase.from("day_data").delete().eq("user_id", userId);

  // 新規保存
  const { error } = await supabase.from("day_data").insert(rows);
  if (error) console.error("保存エラー:", error);
};
