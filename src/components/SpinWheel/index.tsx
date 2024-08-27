import { useRef } from "react";

import styles from "./index.module.scss";

const SpinWheel = () => {
  const items = ["cat", "dog", "duck", "chicken"];

  let speed = 0;
  let pause = false;
  let currentDeg = 0;
  let itemDegs: any = {};
  let step = 360 / items.length;

  const canvasRef = useRef<any>(null);

  const toRad = (deg: number) => {
    return deg * (Math.PI / 180.0);
  };

  const easeOutSine = (x: number) => {
    return Math.sin((x * Math.PI) / 2);
  };

  const getPercent = (input: number, min: number, max: number) => {
    return ((input - min) * 100) / (max - min) / 100;
  };

  const randomRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  let maxRotation = randomRange(360 * 3, 360 * 6);

  const draw = () => {
    const canvas = canvasRef.current;

    const { width, height } = canvas;

    const radius = width / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
    ctx.fillStyle = `rgb(${33},${33},${33})`;
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    let startDeg = currentDeg;
    for (let i = 0; i < items.length; i++, startDeg += step) {
      let endDeg = startDeg + step;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 30, toRad(startDeg), toRad(endDeg));
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(toRad((startDeg + endDeg) / 2));
      ctx.fillText(items[i], 130, 10);
      ctx.restore();

      itemDegs[items[i]] = { endDeg: endDeg, startDeg: startDeg };

      if (
        startDeg % 360 < 360 &&
        startDeg % 360 > 270 &&
        endDeg % 360 < 90 &&
        endDeg % 360 > 0
      ) {
        console.log(items[i]);
      }
    }
  };

  const createWheel = () => {
    step = 360 / items.length;

    draw();
  };

  const animate = () => {
    if (pause) return;

    speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
    if (speed < 0.01) {
      speed = 0;
      pause = true;
    }
    currentDeg += speed;
    draw();
    window.requestAnimationFrame(animate);
  };

  const spin = () => {
    if (speed !== 0) return;

    createWheel();

    const randomResult = items[Math.floor(Math.random() * items.length)];

    maxRotation = 360 * 6 - itemDegs[randomResult].endDeg + 10;

    pause = false;

    window.requestAnimationFrame(animate);
  };

  return (
    <div className={styles["spin-wheel-container"]}>
      <div className={styles["wheel"]}>
        <canvas id="canvas" width="500" height="500" ref={canvasRef} />
        <div onClick={spin} className={styles["center-circle"]}>
          <div className={styles["triangle"]} />
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
