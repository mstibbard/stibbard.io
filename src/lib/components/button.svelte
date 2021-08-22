<script lang="ts">
  export let onClick: () => void | undefined;
  export let type = 'button';
</script>

<button
  {type}
  on:click={onClick}
  class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-500"
>
  <slot />
</button>
