import { useRef, useEffect } from "react";

import styles from "./index.module.scss";

const SpinWheel = () => {
  const items: string[] = [
    "cat",
    "cow",
    "dog",
    "pig",
    "duck",
    "horse",
    "sheep",
    "chicken",
  ];

  let speed: number = 0;
  let pause: boolean = false;
  let currentDeg: number = 0;
  const step: number = 360 / items.length;
  let maxRotation: number =
    Math.floor(Math.random() * (360 * 6 - 360 * 3 + 1)) + 360 * 3;
  const colors: { b: number; g: number; r: number }[] = items.map(
    (_, index) => ({
      b: index % 2 === 0 ? 255 : 255,
      g: index % 2 === 0 ? 255 : 220,
      r: index % 2 === 0 ? 255 : 206,
    })
  );
  let itemDegs: {
    [key in (typeof items)[number]]: { endDeg: number; startDeg: number };
  } = {};

  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      ctx.fillStyle = "#0E2FDB";
      ctx.font = "bold 24px serif";
      ctx.translate(centerX, centerY);
      ctx.rotate(toRad((startDeg + endDeg) / 2));
      ctx.fillText(items[i], 130, 10);

      ctx.restore();

      if (
        endDeg % 360 > 0 &&
        endDeg % 360 < 90 &&
        startDeg % 360 > 270 &&
        startDeg % 360 < 360
      ) {
        console.log(items[i]);
      }

      itemDegs[items[i]] = { endDeg: endDeg, startDeg: startDeg };
    }
  };

  const animate = () => {
    if (pause) return;

    const percent =
      ((currentDeg - maxRotation) * 100) / (0 - maxRotation) / 100;

    speed = Math.sin((percent * Math.PI) / 2) * 20;

    if (speed < 0.01) {
      speed = 0;
      pause = true;
    }

    currentDeg += speed;

    drawWheel();

    window.requestAnimationFrame(animate);
  };

  const spin = () => {
    if (speed !== 0) return;

    currentDeg = 0;
    maxRotation = 0;

    drawWheel();

    const randomResult = items[Math.floor(Math.random() * items.length)];

    maxRotation = 360 * 6 - itemDegs[randomResult].endDeg + 10;

    itemDegs = {};
    pause = false;

    window.requestAnimationFrame(animate);
  };

  useEffect(() => drawWheel());

  return (
    <div className={styles["spin-wheel-container"]}>
      <div className={styles["wheel"]}>
        <canvas width="500" height="500" ref={canvasRef} />
        <div onClick={spin} className={styles["center-circle"]}>
          <span>Spin</span>
          <div className={styles["triangle"]} />
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
