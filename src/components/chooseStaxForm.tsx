"use client";
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ChooseStaxFormProps {
  min?: number;
  max?: number;
  userBalance?: number;
  onConfirm: (amount: number) => void;
}

export default function ChooseStaxForm({
  min = 0,
  max = 10,
  userBalance = 0,
  onConfirm,
}: ChooseStaxFormProps) {
  const [amount, setAmount] = useState<number>(min);

  const isInsufficientFunds = userBalance < min;
  const effectiveMax = isInsufficientFunds ? min : Math.min(max, userBalance);

  const handleSliderChange = (value: number[]) => {
    setAmount(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val)) {
      setAmount(val);
    }
  };

  const handleBlur = () => {
    // Clamp value on blur
    let newAmount = amount;
    if (newAmount < min) newAmount = min;
    if (newAmount > effectiveMax) newAmount = effectiveMax;
    setAmount(newAmount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure value is within bounds
    const finalAmount = Math.min(Math.max(amount, min), effectiveMax);
    onConfirm(finalAmount);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 p-6 w-full max-w-md mx-auto bg-surface-panel rounded-xl border border-border-grey shadow-2xl"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="stax-amount" className="text-white text-xl font-bold">
            Buy-in Amount
          </Label>
          <span className="text-brand-accent font-mono text-lg">${amount}</span>
        </div>

        <div className="flex items-center gap-4">
          <Slider
            id="stax-slider"
            min={min}
            max={effectiveMax}
            step={1}
            value={[amount]}
            onValueChange={handleSliderChange}
            className="flex-1 cursor-pointer"
            disabled={isInsufficientFunds}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-400 font-mono">
          <span>Min: ${min}</span>
          <span>Max: ${effectiveMax}</span>
        </div>

        <div className="pt-2">
          <Label
            htmlFor="custom-amount"
            className="text-sm text-gray-300 mb-1 block"
          >
            Custom Amount
          </Label>
          <Input
            id="custom-amount"
            type="number"
            value={amount}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-full bg-primary-black text-white border-border-grey focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isInsufficientFunds}
        className={`w-full py-3 px-4 font-bold rounded-lg transition-all transform shadow-md uppercase tracking-wider ${
          isInsufficientFunds
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-brand-accent hover:bg-brand-accent-hover text-white active:scale-95"
        }`}
      >
        {isInsufficientFunds ? "Insufficient Funds" : "Confirm Buy-in"}
      </button>
    </form>
  );
}
