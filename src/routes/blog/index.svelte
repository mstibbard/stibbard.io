<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';
  import type { BlogPost } from 'src/global';

  const allPosts = import.meta.glob('./*.md');

  let content: Promise<BlogPost>[] = [];
  for (let path in allPosts) {
    content.push(
      allPosts[path]().then(({ metadata }) => {
        return { path, metadata };
      })
    );
  }

  export const load: Load = async () => {
    const getPosts: BlogPost[] = await Promise.all(content);
    const posts = getPosts.sort(function (a, b) {
      return (
        new Date(b.metadata.publishedOn).valueOf() -
        new Date(a.metadata.publishedOn).valueOf()
      );
    });

    return {
      props: {
        posts
      }
    };
  };
</script>

<script lang="ts">
  import PageHeading from '$lib/components/pageHeading.svelte';
  import Section from '$lib/components/section.svelte';

  export let posts: BlogPost[];
</script>

<svelte:head>
  <title>Blog · stibbard.io</title>
</svelte:head>

<Section name="Blog">
  <PageHeading>Blog</PageHeading>

  <ul>
    {#each posts as { path, metadata: { title, excerpt, tags } }}
      <li class="mb-7">
        <a href={`/blog/${path.replace('.md', '')}`}>
          <div class="prose prose-xl text-gray-900 dark:text-gray-100">
            {title}
          </div>
          <p class="prose text-gray-600 dark:text-gray-400 max-w-none">
            {excerpt}
          </p>
        </a>
        {#if tags}
          <p class="prose prose-sm">
            {#each tags as tag}
              <a href={`/tags/${tag}`}>#{tag}</a>&nbsp;
            {/each}
          </p>
        {/if}
      </li>
    {/each}
  </ul>
</Section>
