export default function getWindDirection(degrees: number) {
  return (
    <p style={{ width: "fit-content", transform: `rotate(${degrees}deg)` }}>
      ⬆
    </p>
  );
}
