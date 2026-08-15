"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface CountdownProps {
  date: Date;
}

/**
 * A component to display a countdown timer.
 *
 * @param {CountdownProps} props - The properties for the component.
 * @param {CountdownProps["date"]} props.date - The date to count down to.
 * @returns {JSX.Element} The rendered component.
 */

const Countdown: React.FC<CountdownProps> = ({ date }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  /**
   * Check if the countdown is less than 30 minutes.
   */
  const isEndingSoon = days === 0 && hours === 0 && minutes <= 30;

  useEffect(() => {
    /**
     * Create a timer to update the countdown every second.
     */
    const intervalId = setInterval(() => {
      const now = new Date();
      const diff = date.getTime() - now.getTime();

      if (diff <= 0) {
        // If the time is over, set all the states to 0.
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      } else {
        // Calculate the days, hours, minutes and seconds left.
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Update the states with the calculated values.
        setDays(days);
        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
      }
    }, 1000);

    // Clear the timer when the component is unmounted.
    return () => clearInterval(intervalId);
  }, [date]);

  if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <div className="font-semibold">Time left:</div>

      <div
        className={cn(
          "space-x-0.5 text-green-500",
          days === 0 && hours > 30 && "text-orange-300",
          isEndingSoon && "text-destructive"
        )}
      >
        {/* Format the days, hours, minutes and seconds with padding */}
        <span>{days.toString().padStart(2, "0")}d</span>
        <span>{hours.toString().padStart(2, "0")}h</span>
        <span>{minutes.toString().padStart(2, "0")}m</span>
        <span>{seconds.toString().padStart(2, "0")}s</span>
      </div>
    </div>
  );
};

export default Countdown;
