import React, { useState, useEffect } from "react";
import { loadDayData, saveDayData } from "../utils/storage";

const MIN_YEAR = 2026;
const MIN_MONTH = 6;
const MAX_YEAR = 2030;
const MAX_MONTH = 11;

// 絵文字マーク
const MARK_OPTIONS = [
  { value: "paw", label: "🐾", color: "#ffb3c6" },
  { value: "sleep", label: "💤", color: "#b3d9ff" },
  { value: "clover", label: "🍀", color: "#ffe5b3" },
  { value: "rainbow", label: "🌈", color: "#ffd6ff" },
  { value: "sparkle", label: "✨", color: "#fff7b3" },
  { value: "cat", label: "🐱", color: "#d6eaff" },
  { value: "food1", label: "🍎", color: "#ffcccc" },
  { value: "food2", label: "🍔🍟", color: "#ffe0b3" },
  { value: "food3", label: "🍓🍰🍫", color: "#ffd6e8" },
  { value: "hospital", label: "🏥", color: "#e0f7ff" },
  { value: "cake", label: "🎂", color: "#ffe5f0" },
];

// 季節背景（かわいいイラスト）
const SEASON_BG = {
  spring: "https://cdn.pixabay.com/photo/2017/03/27/14/56/spring-2178728_1280.png",
  summer: "https://cdn.pixabay.com/photo/2017/07/31/11/21/summer-2552692_1280.png",
  autumn: "https://cdn.pixabay.com/photo/2016/09/15/15/19/autumn-1673896_1280.png",
  winter: "https://cdn.pixabay.com/photo/2016/11/29/05/08/snowman-1867221_1280.png",
};

const getSeason = (month) => {
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
};

const Calendar = ({ currentUser }) => {
  const now = new Date();
  let initYear = now.getFullYear();
  let initMonth = now.getMonth();

  if (initYear < MIN_YEAR || (initYear === MIN_YEAR && initMonth < MIN_MONTH)) {
    initYear = MIN_YEAR;
    initMonth = MIN_MONTH;
  }
  if (initYear > MAX_YEAR || (initYear === MAX_YEAR && initMonth > MAX_MONTH)) {
    initYear = MAX_YEAR;
    initMonth = MAX_MONTH;
  }

  const [year, setYear] = useState(initYear);
  const [month, setMonth] = useState(initMonth);
  const [dayStates, setDayStates] = useState({});

  useEffect(() => {
    if (!currentUser) return;

    const load = async () => {
      const data = await loadDayData(currentUser.id);
      setDayStates(data || {});
    };

    load();
  }, [currentUser]);

  const changeMonth = (delta) => {
    let newYear = year;
    let newMonth = month + delta;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    const beforeMin =
      newYear < MIN_YEAR || (newYear === MIN_YEAR && newMonth < MIN_MONTH);
    const afterMax =
      newYear > MAX_YEAR || (newYear === MAX_YEAR && newMonth > MAX_MONTH);

    if (beforeMin || afterMax) return;

    setYear(newYear);
    setMonth(newMonth);
  };

  const buildCalendar = () => {
    const firstDate = new Date(year, month, 1);
    const firstDay = firstDate.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  };

  const formatDateKey = (d) => {
    const mm = (month + 1).toString().padStart(2, "0");
    const dd = d.toString().padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const handleMarkChange = async (dateKey, markValue) => {
    const prev = dayStates[dateKey] || {};
    const newState = {
      ...dayStates,
      [dateKey]: {
        ...prev,
        mark: markValue,
      },
    };

    setDayStates(newState);

    if (currentUser) {
      await saveDayData(currentUser.id, newState);
    }
  };

  const handleTextChange = async (dateKey, textValue) => {
    const newState = {
      ...dayStates,
      [dateKey]: { ...(dayStates[dateKey] || {}), text: textValue },
    };

    setDayStates(newState);

    if (currentUser) {
      await saveDayData(currentUser.id, newState);
    }
  };

  const cells = buildCalendar();
  const season = getSeason(month);
  const bgImage = SEASON_BG[season];

  return (
    <div>
      <h2 className="mb-3">
        ロン君のお世話カレンダー（{year}年 {month + 1}月）
      </h2>

      <div className="mb-3">
        <button className="btn btn-pink" onClick={() => changeMonth(-1)}>
          ← 前の月
        </button>
        <button className="btn btn-pink ms-2" onClick={() => changeMonth(1)}>
          次の月 →
        </button>
      </div>

      {/* 📱 スマホ縦長 */}
      <div className="d-block d-md-none">
        {cells.filter((d) => d !== null).map((d) => {
          const dateKey = formatDateKey(d);
          const state = dayStates[dateKey] || {};
          const markObj = MARK_OPTIONS.find((m) => m.value === state.mark);

          return (
            <div
              key={d}
              className="p-3 mb-3 rounded shadow-sm"
              style={{
                backgroundImage: bgImage ? `url("${bgImage}")` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: "15px",
                minHeight: "180px",
              }}
            >
              <div
                className="fw-bold mb-2 text-center"
                style={{
                  fontSize: "1.4rem",
                  backgroundColor: "#ffb3c6",
                  color: "white",
                  width: "60px",
                  margin: "0 auto",
                  borderRadius: "50px",
                }}
              >
                {d}日
              </div>

              <select
                className="form-select mt-2"
                value={state.mark || ""}
                onChange={(e) => handleMarkChange(dateKey, e.target.value)}
                style={{
                  backgroundColor: markObj ? markObj.color : "white",
                  borderRadius: "20px",
                  padding: "10px",
                }}
              >
                <option value="">未選択</option>
                {MARK_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                className="form-control mt-3"
                value={state.text || ""}
                onChange={(e) => handleTextChange(dateKey, e.target.value)}
                placeholder="メモを書く"
                style={{
                  borderRadius: "15px",
                  backgroundColor: "#ffffff",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* 🖥 PC横長 */}
      <div className="d-none d-md-block">
        <table className="table table-bordered text-center">
          <thead>
            <tr style={{ backgroundColor: "#ffe5f0" }}>
              <th>日</th>
              <th>月</th>
              <th>火</th>
              <th>水</th>
              <th>木</th>
              <th>金</th>
              <th>土</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: Math.ceil(cells.length / 7) }).map(
              (_, rowIndex) => (
                <tr key={rowIndex}>
                  {cells.slice(rowIndex * 7, rowIndex * 7 + 7).map((d, i) => {
                    if (!d)
                      return (
                        <td key={i} style={{ backgroundColor: "#fff0f5" }}></td>
                      );

                    const dateKey = formatDateKey(d);
                    const state = dayStates[dateKey] || {};
                    const markObj = MARK_OPTIONS.find(
                      (m) => m.value === state.mark
                    );

                    const isWeekend = i === 0 || i === 6;

                    return (
                      <td
                        key={i}
                        className="p-2"
                        style={{
                          backgroundImage: bgImage ? `url("${bgImage}")` : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundColor: isWeekend ? "#ffe5f0" : "#fff0f5",
                          borderRadius: "10px",
                          minHeight: "160px",
                        }}
                      >
                        <div
                          className="fw-bold mb-2"
                          style={{
                            fontSize: "1.2rem",
                            backgroundColor: "#ffb3c6",
                            color: "white",
                            width: "40px",
                            margin: "0 auto",
                            borderRadius: "50px",
                          }}
                        >
                          {d}
                        </div>

                        <select
                          className="form-select mt-2"
                          value={state.mark || ""}
                          onChange={(e) =>
                            handleMarkChange(dateKey, e.target.value)
                          }
                          style={{
                            backgroundColor: markObj ? markObj.color : "white",
                            borderRadius: "20px",
                            padding: "10px",
                          }}
                        >
                          <option value="">未選択</option>
                          {MARK_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          className="form-control mt-2"
                          value={state.text || ""}
                          onChange={(e) =>
                            handleTextChange(dateKey, e.target.value)
                          }
                          placeholder="メモを書く"
                          style={{
                            borderRadius: "15px",
                            backgroundColor: "#ffffff",
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;
