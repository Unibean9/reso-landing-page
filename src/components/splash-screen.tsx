"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Cormorant_Garamond, Be_Vietnam_Pro } from "next/font/google";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const SPLASH_STORAGE_KEY = "reso-splash-seen-v1";

const splashDisplay = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const splashBody = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "500"],
  display: "swap",
});

const letters = siteConfig.name.split("");

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExit] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(SPLASH_STORAGE_KEY)) return;

    setVisible(true);
    document.body.style.overflow = "hidden";

    const exitTimer = window.setTimeout(() => setExit(true), 2600);
    const hideTimer = window.setTimeout(() => {
      localStorage.setItem(SPLASH_STORAGE_KEY, "1");
      setVisible(false);
      document.body.style.overflow = "";
    }, 3400);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center overflow-hidden",
            splashDisplay.className,
            splashBody.className
          )}
          aria-hidden={exiting}
        >
          {/* Nền */}
          <motion.div
            className="absolute inset-0 bg-[#021412]"
            animate={{ scale: exiting ? 1.08 : 1 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,#00897b44,transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#26a69a33,transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#4db6ac22,transparent_40%)]" />

          {/* Vòng sáng xoay */}
          <motion.div
            className="absolute size-[min(90vw,520px)] rounded-full border border-uni-teal-500/20"
            initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
            animate={{
              opacity: exiting ? 0 : 0.6,
              scale: exiting ? 1.2 : 1,
              rotate: exiting ? 90 : 0,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <motion.div
            className="absolute size-[min(70vw,400px)] rounded-full border border-uni-cyan-100/10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: exiting ? 0 : 0.4, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.15, ease: "easeOut" }}
          />

          {/* Hạt sáng */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute size-1 rounded-full bg-uni-teal-300/60"
              style={{
                left: `${15 + (i * 7) % 70}%`,
                top: `${20 + (i * 11) % 60}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: exiting ? 0 : [0.2, 0.8, 0.2],
                scale: exiting ? 0 : [0.5, 1.2, 0.5],
                y: exiting ? 0 : [0, -12, 0],
              }}
              transition={{
                duration: 2.2,
                delay: 0.3 + i * 0.08,
                repeat: exiting ? 0 : Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Nội dung */}
          <motion.div
            className="relative z-10 flex flex-col items-center px-6 text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{
              opacity: exiting ? 0 : 1,
              y: exiting ? -40 : 0,
            }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.1 }}
              className="mb-8 flex size-[clamp(5.5rem,22vw,7.5rem)] items-center justify-center rounded-3xl bg-white/95 p-3 shadow-[0_0_80px_-12px_#26a69acc]"
            >
              <Image
                src={siteConfig.logo}
                alt={siteConfig.name}
                width={375}
                height={375}
                priority
                className="size-full object-contain"
              />
            </motion.div>

            <div className="flex overflow-hidden" aria-label={siteConfig.name}>
              {letters.map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  initial={{ opacity: 0, y: 48, rotateX: -80 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.25 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={cn(
                    splashDisplay.className,
                    "inline-block text-[clamp(3.5rem,12vw,5.5rem)] font-bold leading-none tracking-[0.08em] text-white"
                  )}
                  style={{ transformPerspective: 600 }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className={cn(
                splashBody.className,
                "mt-5 max-w-xs text-sm font-light tracking-wide text-uni-cyan-100/90 sm:text-base"
              )}
            >
              Tích điểm thông minh
            </motion.p>

            <motion.div
              className="mt-10 h-px w-40 overflow-hidden rounded-full bg-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="h-full origin-left rounded-full bg-linear-to-r from-uni-teal-300 to-uni-cyan-100"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: exiting ? 1 : 1 }}
                transition={{ duration: 2.2, delay: 0.85, ease: [0.4, 0, 0.2, 1] }}
              />
            </motion.div>
          </motion.div>

          {/* Curtain thoát */}
          <motion.div
            className="absolute inset-x-0 bottom-0 z-20 h-[52%] bg-app-bg"
            initial={{ y: "100%" }}
            animate={{ y: exiting ? 0 : "100%" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
