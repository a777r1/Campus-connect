import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string;
  height?: string;
  lines?: number;
}

function SkeletonBase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-slate-200 dark:bg-[#2a2a3e] rounded-lg animate-pulse",
        className
      )}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          className={cn(
            "h-4 rounded",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white dark:bg-[#1a1a2e] rounded-2xl border border-slate-100 dark:border-[#2a2a3e] overflow-hidden", className)}>
      <SkeletonBase className="h-48 rounded-none" />
      <div className="p-6 space-y-4">
        <SkeletonBase className="h-3 w-24" />
        <SkeletonBase className="h-6 w-3/4" />
        <SkeletonText lines={2} />
        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-[#2a2a3e]">
          <SkeletonBase className="h-4 w-20" />
          <SkeletonBase className="h-10 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonEventHorizontal({ className }: { className?: string }) {
  return (
    <div className={cn("flex bg-white dark:bg-[#1a1a2e] rounded-2xl border border-slate-100 dark:border-[#2a2a3e] overflow-hidden", className)}>
      <SkeletonBase className="w-32 sm:w-48 h-32 rounded-none flex-shrink-0" />
      <div className="flex-1 p-4 sm:p-6 space-y-3">
        <SkeletonBase className="h-5 w-3/4" />
        <SkeletonBase className="h-3 w-1/2" />
        <SkeletonBase className="h-3 w-1/3" />
        <div className="flex justify-between items-center pt-2">
          <SkeletonBase className="h-3 w-20" />
          <SkeletonBase className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStat({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white dark:bg-[#1a1a2e] p-6 rounded-2xl border border-slate-100 dark:border-[#2a2a3e]", className)}>
      <SkeletonBase className="w-10 h-10 rounded-xl mb-4" />
      <SkeletonBase className="h-7 w-16 mb-2" />
      <SkeletonBase className="h-3 w-20" />
    </div>
  );
}

export function SkeletonGalleryItem({ className }: { className?: string }) {
  const heights = ['h-48', 'h-56', 'h-64', 'h-72'];
  const randomHeight = heights[Math.floor(Math.random() * heights.length)];
  return (
    <SkeletonBase className={cn("rounded-3xl", randomHeight, className)} />
  );
}

export default SkeletonBase;
