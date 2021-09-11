<script lang="ts">
  import dayjs from 'dayjs';

  export let name: string;
  export let launchDate: Date | '';
  export let mrr: number | string;
  export let url: string = '';
  export let users: number;
  export let usersCalled: string = 'Users';
</script>

<div class="col-span-1">
  {#if url !== ''}
    <a href={url}>
      <div
        class="border border-gray-800 dark:border-gray-400 rounded-lg p-3 hover:bg-blue-200 dark:hover:bg-blue-900"
      >
        <div class="grid grid-cols-2 grid-rows-4">
          <div
            class="row-start-1 font-bold text-black dark:text-white col-span-2"
          >
            {name}
          </div>
          <div
            class="row-start-2 text-sm text-gray-700 dark:text-gray-300 col-span-2"
          >
            <span class="font-semibold">Launched</span>:
            {#if launchDate === ''}
              TBC
            {:else}
              {dayjs(launchDate).format('D MMM YYYY')}
            {/if}
          </div>

          <div class="row-start-3 text-sm text-gray-700 dark:text-gray-300">
            <span class="font-semibold">MRR</span>: {#if typeof mrr === 'number'}${/if}{mrr}
          </div>
          <div class="row-start-3 text-sm text-gray-700 dark:text-gray-300">
            <span class="font-semibold">MoM Chg</span>: {#if typeof mrr !== 'number'}N/A{:else}0%{/if}
          </div>

          <div class="row-start-4 text-sm text-gray-700 dark:text-gray-300">
            <span class="font-semibold">{usersCalled}</span>: {users}
          </div>
          <div class="row-start-4 text-sm text-gray-700 dark:text-gray-300">
            <span class="font-semibold">MoM Chg</span>: 0%
          </div>
        </div>
      </div>
    </a>
  {:else}
    <div class="border border-gray-800 dark:border-gray-400 rounded-lg p-3">
      <div class="grid grid-cols-2 grid-rows-4">
        <div
          class="row-start-1 font-bold text-black dark:text-white col-span-2"
        >
          {name}
        </div>
        <div
          class="row-start-2 text-sm text-gray-700 dark:text-gray-300 col-span-2"
        >
          <span class="font-semibold">Launched</span>:
          {#if launchDate === ''}
            TBC
          {:else}
            {dayjs(launchDate).format('D MMM YYYY')}
          {/if}
        </div>

        <div class="row-start-3 text-sm text-gray-700 dark:text-gray-300">
          <span class="font-semibold">MRR</span>: {#if typeof mrr === 'number'}${/if}{mrr}
        </div>
        <div class="row-start-3 text-sm text-gray-700 dark:text-gray-300">
          <span class="font-semibold">MoM Chg</span>: {#if typeof mrr !== 'number'}N/A{:else}0%{/if}
        </div>

        <div class="row-start-4 text-sm text-gray-700 dark:text-gray-300">
          <span class="font-semibold">{usersCalled}</span>: {users}
        </div>
        <div class="row-start-4 text-sm text-gray-700 dark:text-gray-300">
          <span class="font-semibold">MoM Chg</span>: 0%
        </div>
      </div>
    </div>
  {/if}
</div>
