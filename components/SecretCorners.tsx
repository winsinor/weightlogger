'use client';

const CORNERS = [
  'fixed top-0 left-0',
  'fixed top-0 right-0',
  'fixed bottom-0 left-0',
  'fixed bottom-0 right-0',
];

interface SecretCornersProps {
  cheatMode: boolean;
  onToggle: () => void;
}

export default function SecretCorners({ cheatMode, onToggle }: SecretCornersProps) {
  return (
    <>
      {CORNERS.map((pos, i) => (
        <button
          key={i}
          onClick={onToggle}
          className={`${pos} w-8 h-8 z-[100] opacity-0 cursor-default`}
          tabIndex={-1}
          aria-hidden="true"
        />
      ))}
      {/* Tiny indicator dot — only visible when cheat mode is on */}
      {cheatMode && (
        <div className="fixed bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 z-[100] animate-pulse pointer-events-none" />
      )}
    </>
  );
}
