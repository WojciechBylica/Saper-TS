import { useTimer } from "./useTimer";

export const Timer = () => {
  const { timeLeft } = useTimer();

  return (
    <>
      {timeLeft.map((data, index) => (
        <span key={`time${index}`}>
          {data.number}
          {data.measure}
          {index === 0 && ":"}
        </span>
      ))}
    </>
  );
};
