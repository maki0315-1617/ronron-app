import { supabase } from "./supabase";

/* -----------------------------
   ユーザ登録（重複チェック付き）
----------------------------- */
export const registerUser = async (username, password) => {
  // ① 既存ユーザ名のチェック
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .single();

  if (existingUser) {
    throw new Error("このユーザ名は既に使われています");
  }

  // ② 新規登録
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
   日付データ読み込み（ISO形式に統一）
----------------------------- */
export const loadDayData = async (userId) => {
  const { data, error } = await supabase
    .from("day_data")
    .select("*")
    .eq("user_id", userId);

  if (error) return {};

  const result = {};
  data.forEach((row) => {
    // Supabase の date 型は "YYYY-MM-DD" で返るのでそのまま使える
    const normalizedKey = row.date_key; // 例: "2026-07-01"
    result[normalizedKey] = { mark: row.mark, time: row.time };
  });

  return result;
};

/* -----------------------------
   日付データ保存（ISO形式で保存）
----------------------------- */
export const saveDayData = async (userId, dayStates) => {
  const rows = Object.entries(dayStates).map(([date_key, v]) => ({
    user_id: userId,
    date_key, // "YYYY-MM-DD" 形式で渡すことが重要
    mark: v.mark || null,
    time: v.time || null,
  }));

  // 既存削除
  await supabase.from("day_data").delete().eq("user_id", userId);

  // 新規保存
  await supabase.from("day_data").insert(rows);
};
