---
layout: learning
title: Toasts in SvelteKit
publishedOn: 2021-08-22
tags:
  - sveltekit
  - tailwindcss
---

<script>
  import Button from "$lib/components/button.svelte";
  import Toasts from "$lib/components/toasts.svelte";
  import { addToast } from "$lib/stores/toast";
</script>

<Toasts />

## What is a Toast message?

Toast messages provide feedback to the user. Toasts:

- appear and disappear in the span of a few seconds
- do not (or should not) require any user interaction
- should be very short, ideally a few words in length

## Why & when should I use toasts?

Use toasts when you want to give the user quick, non-critical feedback. E.g. informing the user that their form submission succeeded.

You _can_ use toasts for non-critical errors but keep it to a minimum. Use them sparingly because failures require some kind of action from the user to resolve (e.g. resubmit) - which you don't want them to miss.

## What will it look like?

Click below to trigger some examples:

<Button onClick={() => {
addToast({
message: "It really worked!",
type: "success"
})
}}>Success toast</Button>

<Button onClick={() => {
addToast({
message: "Something went wrong",
type: "error"
})
}}>Error toast</Button>

<Button onClick={() => {
addToast({
message: "You're about to make toast",
type: "info",
dismissible: true
})
}}>Info toast, dismissible</Button>

<Button onClick={() => {
addToast({
message: "🍞 is NOT toast",
type: "warning",
dismissible: true,
duration: 5000,
})
}}>Warning toast, 5 sec duration</Button>

<Button onClick={() => {
addToast({
message: "It really worked!",
type: "success",
dismissible: true
})
addToast({
message: "You're about to make toast",
type: "info",
dismissible: true
})
addToast({
message: "Something went wrong",
type: "error",
dismissible: true
})
addToast({
message: "🍞 is NOT toast",
type: "warning",
dismissible: true
})
}}>One of each default, dismissible</Button>

You can grab the code directly from [this blogs' repo on GitHub](https://github.com/mstibbard/stibbard.io) if you'd prefer.

## OK, how do I make one with SvelteKit?

**Assumptions:**

- you have a SvelteKit project already created (`npm init svelte@next app-name`) w/ TypeScript
- you have TailwindCSS installed (`npx svelte-add@latest tailwindcss`)

**Steps Summary:**

1. Make a writable store
2. Create a parent Toasts component to handle multiple toast messages
3. Create a child Toast component to handle individual messages and their styles
4. Add the parent Toasts component to your `__layout.svelte` for app-wide access
5. Call the `addToast` function from our writable store wherever we want to trigger a toast

## Yeah, I'm going to need more detail than that

1. First we create our Toast type. Then we create a writable store that is a list of Toasts. We also add helper functions to `dismissToast` and `addToast`. This handles occasions where multiple toasts occur in a short period of time (e.g. click the button a bunch of times!)

<Button onClick={() => {
addToast({
message: "Clicky clicky!!",
type: "success",
dismissible: true
})
}}>Click me a couple times</Button>

_src/global.d.ts_

```typescript
export type Toast = {
  id: number;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
  dismissible: boolean;
  duration: number;
};
```

_src/lib/stores/toast.ts_

```typescript
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
```

2. Create the parent Toast component. This handles the display of one or more toasts by making use of Svelte's stores and auto-subscriptions (the handy `$` prefix). `$toasts` keeps an eye on our list of toasts, and for each toast in the list we display a child Toast component. We make use of a keyed each block `{#each $toasts as toast (toast.id)}` so that our previously made `dismissToast` helper can find the right Toast to delete

_src/lib/components/toasts.svelte_

```typescript
<script lang="ts">
  import Toast from '$lib/components/toast.svelte';
  import { dismissToast, toasts } from '$lib/stores/toast';
</script>

{#if $toasts}
  <section
    aria-live="assertive"
    class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
  >
    <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
      {#each $toasts as toast (toast.id)}
        <Toast
          type={toast.type}
          message={toast.message}
          dismissible={toast.dismissible}
          on:dismiss={() => dismissToast(toast.id)}
        />
      {/each}
    </div>
  </section>
{/if}
```

3. Create the child Toast component and add styling. This is almost entirely styling, so if you are not using TailwindCSS feel free to replace this with vanilla CSS or your preferred framework. **Note:** This requires safelisting styles in your `tailwind.config.cjs`. I've included the safelist needed for below

_src/lib/components/toast.svelte_

```typescript
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  // PROPS
  export let type: string;
  export let message: string;
  export let dismissible: boolean;

  let color: string;

  if (type === 'success') {
    color = 'green';
  } else if (type === 'error') {
    color = 'red';
  } else if (type === 'info') {
    color = 'blue';
  } else if (type === 'warning') {
    color = 'yellow';
  }
</script>

<div
  transition:fade
  class="max-w-sm w-full bg-{color}-50 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
>
  <div class="p-4">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        {#if type === 'success'}
          <svg
            class="h-5 w-5 text-green-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        {:else if type === 'error'}
          <svg
            class="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        {:else if type === 'info'}
          <svg
            class="h-5 w-5 text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        {:else if type === 'warning'}
          <svg
            class="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        {/if}
      </div>

      <div class="ml-3 w-0 flex-1 flex justify-between">
        <div class="w-0 flex-1 text-sm font-medium text-{color}-800">
          {message}
        </div>
      </div>

      {#if dismissible}
        <div class="ml-4 flex-shrink-0 flex">
          <button
            on:click={() => dispatch('dismiss')}
            class="rounded-md inline-flex text-{color}-700 hover:text-{color}-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-{color}-400"
          >
            <span class="sr-only">Close</span>
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
```

_tailwind.config.cjs_

```javascript
...
purge: {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: [
    'bg-green-50',
    'text-green-700',
    'text-green-800',
    'hover:text-green-900',
    'focus:ring-green-400',
    'bg-red-50',
    'text-red-700',
    'text-red-800',
    'hover:text-red-900',
    'focus:ring-red-400',
    'bg-yellow-50',
    'text-yellow-700',
    'text-yellow-800',
    'hover:text-yellow-900',
    'focus:ring-yellow-400',
    'bg-blue-50',
    'text-blue-700',
    'text-blue-800',
    'hover:text-blue-900',
    'focus:ring-blue-400'
  ]
},
...
```

4. Add the parent Toasts component to the page(s) you want. For this example, let's put it directly in our layout so it's accessible application wide

_src/routes/\_\_layout.svelte_

```typescript
<script>
  ...
  import Toasts from '$lib/components/toasts.svelte'
  ...
</script>

<main>
  <Toasts />
  ...
</main>
```

5. Trigger the toasts wherever you want. This button is the result of the below code

<Button onClick={() => {
addToast({
message: "It really worked!",
type: "success"
})
}}>Click me please!</Button>

_example.svelte_

```typescript
<script>
  import { addToast } from "$lib/stores/toast";
</script>

<button
  type='button'
  on:click={() => {
    addToast({
      message: "It really worked!",
      type: "success"
    })
  }
  class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-500"
>
  Click me please!
</button>
```
