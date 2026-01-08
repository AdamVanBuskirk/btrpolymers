// QuickStatsProgress.tsx
import React from "react";

interface ProgressProps {
  actions: number;
  goal: number;
}

const ProgressBar: React.FC<ProgressProps> = ({ actions, goal }) => {
  const percentage = Math.min((actions / goal) * 100, 100);

  return (
    <div style={{ margin: "10px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          color: "#bbb",
          marginBottom: "4px",
        }}
      >
        <span>Progress</span>
        <span>
          {(actions ?? 0).toLocaleString()}/{(goal ?? 0).toLocaleString()}
        </span>
      </div>
      <div
        style={{
          backgroundColor: "#1c1f26",
          borderRadius: "10px",
          height: "12px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: (percentage >= 100) ? "linear-gradient(90deg, #00d084, #00b26f)" : "linear-gradient(90deg, #ea580c, #c2410c)", // 👈 #00d084, #00b26f green gradient
            borderRadius: "10px",
            transition: "width 0.4s ease",
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
