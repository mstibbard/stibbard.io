<script>
  // MDsveX layouts have an issue with pre-processing
  // impacting TS, SCSS etc. This file uses JSDoc types
  // instead. Thanks @michael0liver on GitHub.
  // https://github.com/pngwn/MDsveX/issues/116

  import PageHeading from '$lib/components/pageHeading.svelte';
  import dayjs from 'dayjs';

  // PROPS
  /** @type string */
  export let title;
  /** @type Date */
  export let publishedOn;
  /** @type Date */
  export let updatedOn;
  /** @type string[] */
  export let tags;
</script>

<div class="py-8">
  <PageHeading>{title}</PageHeading>

  <div
    class="text-sm flex flex-col items-center justify-center text-gray-700 dark:text-gray-300 mb-4"
  >
    {#if updatedOn}
      <p>Published: {dayjs(publishedOn).format('dddd, DD MMM YYYY')}</p>
      <p>Updated: {dayjs(updatedOn).format('dddd, DD MMM YYYY')}</p>
    {:else}
      {dayjs(publishedOn).format('dddd, DD MMM YYYY')}
    {/if}
  </div>

  {#if tags}
    <div class="mb-4 flex flex-col items-center justify-center">
      <p class="prose prose-sm">
        {#each tags as tag}
          <a href={`/tags/${tag}`}>#{tag}</a>&nbsp;
        {/each}
      </p>
    </div>
  {/if}

  <div class="prose dark:prose-dark max-w-none mt-6">
    <slot />
  </div>
</div>
