import React, { useState, useEffect } from "react";

interface ActiveStatusProps {
  currentTime: string;
  targetTime: string;
}

export const ActiveStatus: React.FC<ActiveStatusProps> = ({
  currentTime,
  targetTime,
}) => {
  const [divColor, setDivColor] = useState("green");

  useEffect(() => {
    const targetTimeDate = new Date(targetTime);
    const currentTimeDate = new Date(currentTime);
    const currentHours = currentTimeDate.getHours();
    const currentMinutes = currentTimeDate.getMinutes();

    const targetHours = targetTimeDate.getHours();
    const targetMinutes = targetTimeDate.getMinutes();

    // Calculate the time difference in minutes
    const timeDiffMinutes =
      targetHours * 60 + targetMinutes - (currentHours * 60 + currentMinutes);

    // Determine the color based on the time difference
    const newDivColor = timeDiffMinutes <= 120 ? "green" : "red"; // 120 minutes = 2 hours

    setDivColor(newDivColor);
  }, [currentTime, targetTime]);

  return (
    <div className="lg:col-span-1">
      <svg
        className={`h-6 w-3 text-${divColor}-500 mr-2`}
        viewBox="0 0 24 24"
        fill={divColor}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    </div>
  );
};
