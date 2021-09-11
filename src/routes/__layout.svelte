<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.postcss';

  let darkMode: boolean;
  let darkModeReady = false;

  onMount(() => {
    darkMode = document.documentElement.classList.contains('dark');
    document.body.classList.add('transition', 'ease-in-out', 'duration-500');
    darkModeReady = true;
  });
</script>

<div name="container" class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
  <nav class="py-6 flex justify-between items-center" aria-label="Main">
    <div>
      {#if darkModeReady}
        <button
          aria-label="Toggle Dark Mode"
          type="button"
          class="w-10 h-10 p-3 bg-blue-200 rounded dark:bg-gray-700"
          on:click|preventDefault={() => {
            document.documentElement.classList.toggle('dark');
            darkMode = !darkMode;
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            class="w-4 h-4 text-gray-800 dark:text-gray-200"
          >
            {#if darkMode}
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            {:else}
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            {/if}
          </svg>
        </button>
      {/if}
    </div>
    <div class="space-x-3">
      <a href="/learning" class="text-gray-900 dark:text-gray-100">Learning</a>
      <a href="/blog" class="text-gray-900 dark:text-gray-100">Blog</a>
      <a href="/" class="text-gray-900 dark:text-gray-100">Home</a>
    </div>
  </nav>

  <main class="mb-2">
    <slot />
  </main>

  <footer
    class="pt-6 border-t border-gray-200 dark:border-gray-600 items-center"
  >
    <nav class="flex justify-center space-x-3 order-3" aria-label="Footer">
      <a
        href="/learning"
        class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-500"
        >Learning</a
      >
      <a
        href="/blog"
        class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-500"
        >Blog</a
      >
      <a
        href="/"
        class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-500"
        >Home</a
      >
    </nav>
    <div class="mt-4 flex justify-center space-x-6 order-2">
      <a
        href="https://twitter.com/MatthewStibbard"
        class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-500"
      >
        <span class="sr-only">Twitter</span>
        <svg
          class="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
          />
        </svg>
      </a>

      <a
        href="https://github.com/mstibbard"
        class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-500"
      >
        <span class="sr-only">GitHub</span>
        <svg
          class="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </div>
    <div class="mt-4 mb-8 order-1 flex justify-center">
      <a
        href="/"
        class="text-base text-green-600 hover:text-green-800 dark:text-yellow-600 dark:hover:text-yellow-800"
        >stibbard.io</a
      >
    </div>
  </footer>
</div>
