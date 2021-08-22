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
