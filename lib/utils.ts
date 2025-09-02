// lib/utils.ts
import type { ClassValue } from 'clsx'
import type { Ref } from 'vue'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  // penting: pakai spread
  return twMerge(clsx(...inputs))
}

export function valueUpdater<T = any>(updaterOrValue: T | ((v:any)=>T), ref: Ref) {
  ref.value = typeof updaterOrValue === 'function'
    ? (updaterOrValue as Function)(ref.value)
    : updaterOrValue
}
