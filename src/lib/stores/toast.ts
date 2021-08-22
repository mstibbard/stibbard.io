import type { Toast } from 'src/global';
import { writable } from 'svelte/store';

export const toasts = writable<Toast[]>([]);

export const dismissToast = (id: number): void => {
  toasts.update((all) => all.filter((t) => t.id !== id));
};

export const addToast = (toast: Toast): void => {
  // Create a unique ID so we can easily find and remove
  // it if it is dismissible
  const id = Math.floor(Math.random() * 1000);

  // Setup toast defaults
  const defaults = {
    id,
    dismissible: false,
    duration: 3000
  };

  // Push the toast to the top of the list of toasts
  const t = { ...defaults, ...toast };
  toasts.update((all) => [t, ...all]);

  // Dismiss toast after "duration" amount of time.
  if (t.duration) setTimeout(() => dismissToast(id), t.duration);
};
