'use client';
import React from "react";

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen flex flex-col items-center justify-center bg-violet-600"
    >
      <div className="text-center">
        <div className="text-6xl mb-4" aria-hidden="true">✅</div>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Habit Tracker
        </h1>
        <p className="mt-3 text-violet-200 text-sm">
          Building better habits, one day at a time.
        </p>
      </div>
    </div>
  );
}