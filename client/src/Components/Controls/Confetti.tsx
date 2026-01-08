// confetti.ts
import confetti from "canvas-confetti"

export const fireConfetti = () => {
  const duration = 1.5 * 1000; // 1.5 seconds
  const animationEnd = Date.now() + duration;

  const defaults = { 
    startVelocity: 30,
    spread: 360,
    ticks: 120,
    zIndex: 9999
  };

  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: {
        x: Math.random(),   // random across the width
        y: Math.random() - 0.2 // a bit above the screen
      }
    });
  }, 250);
};
