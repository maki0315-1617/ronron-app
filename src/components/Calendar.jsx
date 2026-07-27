import React, { useState, useEffect } from "react";
import { saveDayData, loadDayData } from "../utils/storage";

const MIN_YEAR = 2026;
const MIN_MONTH = 6; // 7月
const MAX_YEAR = 2030;
const MAX_MONTH = 11; // 12月

const MARK_OPTIONS = [
  { value: "circle", label: "〇", color: "#4CAF50" },
  { value: "cross", label: "×", color: "#F44336" },
  { value: "triangle", label: "△", color: "#FF9800" },
];

const Calendar = ({ currentUser }) => {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(6);
  const [dayStates, setDayStates] = useState({});

  useEffect(() => {
    if (!currentUser) return;
    const data = loadDayData(currentUser.id);
    setDayStates(data || {});
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

  const getCurrentTime = () => {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, "0");
    const mm = now.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const handleMarkChange = (dateKey, markValue) => {
    const prev = dayStates[dateKey] || {};
    const newState = {
      ...dayStates,
      [dateKey]: {
        ...prev,
        mark: markValue,
        time: prev.time || getCurrentTime(),
      },
    };
    setDayStates(newState);
    if (currentUser) saveDayData(currentUser.id, newState);
  };

  const handleTimeChange = (dateKey, timeValue) => {
    const newState = {
      ...dayStates,
      [dateKey]: { ...(dayStates[dateKey] || {}), time: timeValue },
    };
    setDayStates(newState);
    if (currentUser) saveDayData(currentUser.id, newState);
  };

  const cells = buildCalendar();

  return (
    <div>
      <h2>
        {year}年 {month + 1}月
      </h2>

      <div style={{ marginBottom: "8px" }}>
        <button onClick={() => changeMonth(-1)}>前の月</button>
        <button onClick={() => changeMonth(1)} style={{ marginLeft: "8px" }}>
          次の月
        </button>
      </div>

      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <thead>
          <tr>
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
                      <td
                        key={i}
                        style={{
                          border: "1px solid #ccc",
                          height: "80px",
                          backgroundColor: "#f9f9f9",
                        }}
                      />
                    );

                  const dateKey = formatDateKey(d);
                  const state = dayStates[dateKey] || {};
                  const markObj =
                    MARK_OPTIONS.find((m) => m.value === state.mark) || null;

                  return (
                    <td
                      key={i}
                      style={{
                        border: "1px solid #ccc",
                        padding: "4px",
                        verticalAlign: "top",
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>{d}</div>

                      <select
                        value={state.mark || ""}
                        onChange={(e) =>
                          handleMarkChange(dateKey, e.target.value)
                        }
                        style={{
                          width: "100%",
                          backgroundColor: markObj ? markObj.color : "#fff",
                          color: markObj ? "#fff" : "#000",
                          marginTop: "4px",
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
                        type="time"
                        value={state.time || ""}
                        onChange={(e) =>
                          handleTimeChange(dateKey, e.target.value)
                        }
                        style={{ width: "100%", marginTop: "4px" }}
                      />

                      <div
                        style={{
                          fontSize: "12px",
                          marginTop: "4px",
                          color: state.time ? "#000" : "#888",
                        }}
                      >
                        選択時間: {state.time || "未設定"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
