import React from 'react';
import { Edit3 } from 'lucide-react';

interface FloatingWriteButtonProps {
  onClick: () => void;
}

export function FloatingWriteButton({ onClick }: FloatingWriteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-40"
    >
      <Edit3 className="w-6 h-6" />
    </button>
  );
}