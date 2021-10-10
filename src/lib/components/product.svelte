<script lang="ts">
  import dayjs from 'dayjs';
  import type { BusinessModels, RevenueModels } from 'src/global';

  export let businessModel: BusinessModels;
  export let launchDate: Date | '' = '';
  export let name: string;
  export let revenueModel: RevenueModels;
  export let what: string;
</script>

<div class="col-span-1">
  <div
    class="border border-gray-800 dark:border-gray-400 rounded-lg p-3 hover:bg-blue-200 dark:hover:bg-blue-900"
  >
    <div class="grid space-y-1">
      <div class="row-start-1 font-bold text-black dark:text-white">
        {name}
      </div>

      <div class="row-start-2 text-sm text-gray-700 dark:text-gray-300 pb-4">
        {what}
      </div>

      <div class="row-start-3 text-sm text-gray-700 dark:text-gray-300">
        <span class="font-semibold">Business Model</span>: {businessModel}
      </div>

      <div class="row-start-4 text-sm text-gray-700 dark:text-gray-300 pb-4">
        <span class="font-semibold">Revenue Model</span>: {revenueModel}
      </div>

      <div
        class="row-start-5 text-sm text-gray-700 dark:text-gray-300 col-span-2"
      >
        {#if launchDate === ''}
          Coming soon...
        {:else}
          <span class="font-semibold">Launched</span>:
          {dayjs(launchDate).format('D MMM YYYY')}
        {/if}
      </div>
    </div>
  </div>
</div>
