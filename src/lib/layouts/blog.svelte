<script>
  import PageHeading from '$lib/components/pageHeading.svelte';

  export let title = 'placeholder';
  export let date = 'placeholder';
  export let cover = 'placeholder';
</script>

<div class="py-8">
  <PageHeading>{title}</PageHeading>

  <div class="text-sm text-gray-700 dark:text-gray-300 mb-4">
    Published on: {date}
  </div>

  <img src={cover} alt="cover" />

  <div class="prose dark:prose-dark max-w-none mt-6">
    <slot />
  </div>
</div>
