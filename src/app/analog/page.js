"use client"; // Add this line to mark this as a client component

import { useEffect, useState, useRef } from "react";

export default function SignupPage() {
  const [isPressing, setIsPressing] = useState(false);
  const [isFutureDate, setIsFutureDate] = useState(false);

  const earthSize = 15;
  const horizontalRadius = 150;
  const verticalRadius = 73;
  const horizontalMargin = 25;
  const verticalMargin = 10;

  const today = new Date();
  let year = today.getFullYear();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayNumber = Math.floor(diff / oneDay);

  // Function to calculate the date from the day number
  const dateFromDay = (day) => {
    const date = new Date(year, 0);
    return new Date(date.setDate(day));
  };

  const currentDateRef = useRef(dateFromDay(dayNumber)); // Use useRef for mutable date
  const xRef = useRef(horizontalRadius * Math.cos(initialAngle())); // Use useRef for x position
  const yRef = useRef(verticalRadius * Math.sin(initialAngle())); // Use useRef for y position

  const [position, setPosition] = useState({
    x: horizontalRadius + xRef.current - earthSize / 2 + horizontalMargin,
    y: verticalRadius - yRef.current - earthSize / 2 + verticalMargin,
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isPressing) return;

      const { clientX, clientY } = e.touches ? e.touches[0] : e;

      const rect = document.getElementById("ellipse").getBoundingClientRect();
      const ellipseCenterX = rect.x + rect.width / 2 + horizontalMargin;
      const ellipseCenterY = rect.y + rect.height / 2 + verticalMargin;
      const angle = Math.atan2(
        ellipseCenterY - clientY,
        clientX - ellipseCenterX
      );

      xRef.current = horizontalRadius * Math.cos(angle);
      yRef.current = verticalRadius * Math.sin(angle);

      setPosition({
        x: horizontalRadius + xRef.current - earthSize / 2 + horizontalMargin,
        y: verticalRadius - yRef.current - earthSize / 2 + verticalMargin,
      });

      let oldDate = currentDateRef.current;

      let dayNumber =
        (182.5 + (isLeapYear() ? 0.5 : 0)) * (Math.sin(angle / 2) + 1) + 1;
      currentDateRef.current = dateFromDay(dayNumber);

      if (
        oldDate.getDate() === 1 &&
        oldDate.getMonth() === 0 &&
        currentDateRef.current.getDate() === 31 &&
        currentDateRef.current.getMonth() === 11
      ) {
        year--;
      } else if (
        oldDate.getDate() === 31 &&
        oldDate.getMonth() === 11 &&
        currentDateRef.current.getDate() === 1 &&
        currentDateRef.current.getMonth() === 0
      ) {
        year++;
      }

      if (currentDateRef.current.getTime() > today.getTime()) {
        setIsFutureDate(true);
      } else {
        setIsFutureDate(false);
      }
    };

    const handleMouseUp = () => {
      setIsPressing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPressing]);

  const handleMouseDown = () => {
    setIsPressing(true);
  };

  // Function to determine if it's a leap year
  const isLeapYear = () => {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  };

  // Function to calculate the initial angle
  const initialAngle = () => {
    return (
      2 * Math.asin((dayNumber - 1) / (182.5 + (isLeapYear() ? 0.5 : 0)) - 1)
    );
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-white text-4xl font-light">Sign Up</h1>
      <div className="flex flex-col items-start space-y-4 bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-white text-lg">Name</h2>
        <input
          className="text-white bg-transparent border-b border-white p-2 w-full"
          type="text"
        />

        <h2 className="text-white text-lg">Password</h2>
        <input
          className="text-white bg-transparent border-b border-white p-2 w-full"
          type="password"
        />

        <div className="flex flex-col items-start">
          <h2 className="text-white text-lg">Date of Birth</h2>
          <button
            id="date"
            className="bg-white text-gray-800 rounded-md py-2 px-4 relative"
            onMouseDown={handleMouseDown}
          >
            <div>
              {addZero(currentDateRef.current.getDate())}/
              {addZero(currentDateRef.current.getMonth() + 1)}/
              {currentDateRef.current.getFullYear()}
            </div>
            <div
              className={`absolute top-0 left-0 w-full h-full bg-black ${
                isFutureDate ? "text-red-500" : ""
              }`}
            />
          </button>

          <div
            id="datePicker"
            className="absolute z-50 bg-black rounded-lg w-64 p-4 mt-4 clip-path-circle"
          >
            <svg className="w-full">
              <ellipse
                id="ellipse"
                cx="175"
                cy="83"
                rx="150"
                ry="73"
                className="stroke-yellow stroke-0.5"
              />
              <image
                id="earth"
                x={position.x}
                y={position.y}
                height="15"
                width="15"
                href="../earth.png"
              />
            </svg>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white rounded-lg py-2 px-4 w-full mt-6"
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
}

const addZero = (num) => (num < 10 ? "0" + num : num);
