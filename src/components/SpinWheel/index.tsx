import { useRef, useState, useEffect } from "react";

import styles from "./index.module.scss";

const SpinWheel = () => {
  const speed = useRef<number>(0);
  const [items, setItems] = useState<string[]>([]);
  const [winner, setWinner] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  let currentDeg: number = 0;
  let pause: boolean = false;
  const step: number = 360 / items.length;
  let maxRotation: number =
    Math.floor(Math.random() * (360 * 6 - 360 * 3 + 1)) + 360 * 3;
  let itemDegs: {
    [key in (typeof items)[number]]: { endDeg: number; startDeg: number };
  } = {};
  const colors: { b: number; g: number; r: number }[] = items.map(() => ({
    b: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    r: Math.floor(Math.random() * 255),
  }));

  const toRad = (deg: number) => deg * (Math.PI / 180.0);

  const drawWheel = () => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    let startDeg = currentDeg;
    const centerX = canvasRef.current.width / 2;
    const centerY = canvasRef.current.height / 2;

    for (let i = 0; i < items.length; i++, startDeg += step) {
      const color = colors[i];
      const endDeg = startDeg + step;

      ctx.beginPath();
      ctx.arc(centerX, centerY, centerX - 2, toRad(startDeg), toRad(endDeg));
      ctx.fillStyle = `rgb(${color.r - 30},${color.g - 30},${color.b - 30})`;
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, centerX - 30, toRad(startDeg), toRad(endDeg));
      ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      ctx.save();

      ctx.textAlign = "center";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 36px serif";
      ctx.translate(centerX, centerY);
      ctx.rotate(toRad((startDeg + endDeg) / 2));
      ctx.fillText(items[i], 250, 10);

      ctx.restore();

      if (
        pause &&
        endDeg % 360 > 0 &&
        endDeg % 360 < 90 &&
        startDeg % 360 > 270 &&
        startDeg % 360 < 360
      ) {
        setWinner(items[i]);
      }

      itemDegs[items[i]] = { endDeg: endDeg, startDeg: startDeg };
    }
  };

  const animate = () => {
    if (pause) return;

    const percent =
      ((currentDeg - maxRotation) * 100) / (0 - maxRotation) / 100;

    speed.current = Math.sin((percent * Math.PI) / 2) * 20;

    if (speed.current < 0.01) {
      pause = true;
      speed.current = 0;
    }

    currentDeg += speed.current;

    drawWheel();

    window.requestAnimationFrame(animate);
  };

  const spin = () => {
    if (speed.current !== 0) return;

    setWinner("");

    currentDeg = 0;
    maxRotation = 0;

    drawWheel();

    const randomResult = items[Math.floor(Math.random() * items.length)];

    maxRotation = 360 * 6 - itemDegs[randomResult].endDeg + 25;

    itemDegs = {};
    pause = false;

    window.requestAnimationFrame(animate);
  };

  // eslint-disable-next-line
  useEffect(() => drawWheel(), [items]);

  return (
    <div className={styles["spin-wheel-container"]}>
      {items.length ? (
        <div className={styles["wheel"]}>
          <canvas width="800" height="800" ref={canvasRef} />
          <div onClick={spin} className={styles["center-circle"]}>
            <span>Spin</span>
            <div className={styles["triangle"]} />
          </div>
        </div>
      ) : null}
      <div className={styles["general"]}>
        {winner ? <span>The winner: {winner}</span> : null}
        <textarea
          rows={20}
          cols={40}
          ref={textAreaRef}
          placeholder="Enter item separated by new line"
          onChange={(e) => {
            const newItems = e.target.value.split("\n");

            setItems(newItems);

            drawWheel();
          }}
        />
      </div>
    </div>
  );
};

export default SpinWheel;
