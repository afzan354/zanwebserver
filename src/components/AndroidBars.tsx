import React from 'react';
import { Wifi, Signal, BatteryCharging } from 'lucide-react';

interface AndroidStatusBarProps {
  time?: string;
  batteryLevel?: number;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  time = '12:00',
  batteryLevel = 92,
}) => {
  return (
    <div className="h-7 w-full bg-[#101418] px-5 flex items-center justify-between text-[11px] font-medium text-[#7C8794] select-none z-20 border-b border-[#232C38]/40">
      <div className="flex items-center gap-1.5 font-mono">
        <span>{time}</span>
        <span className="text-[10px] text-[#7C6CF0] font-semibold">ZAN</span>
      </div>
      <div className="flex items-center gap-2">
        <Wifi className="w-3.5 h-3.5 text-[#7C8794]" />
        <Signal className="w-3.5 h-3.5 text-[#7C8794]" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-mono">{batteryLevel}%</span>
          <BatteryCharging className="w-3.5 h-3.5 text-[#7C6CF0]" />
        </div>
      </div>
    </div>
  );
};

export const AndroidNavBar: React.FC<{
  onBack?: () => void;
  onHome?: () => void;
}> = ({ onBack, onHome }) => {
  return (
    <div className="h-10 w-full bg-[#101418] border-t border-[#232C38]/40 flex items-center justify-center relative select-none">
      {/* Android modern gesture pill */}
      <button
        onClick={onHome}
        aria-label="Gesture Home bar"
        className="w-32 h-1 bg-[#7C8794]/40 hover:bg-[#7C6CF0] rounded-full transition-colors cursor-pointer"
      />
    </div>
  );
};
