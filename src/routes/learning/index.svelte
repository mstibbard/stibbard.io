<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';
  import type { LearningSnippet } from 'src/global';

  const allPosts = import.meta.glob('./*.md');

  let content: Promise<LearningSnippet>[] = [];
  for (let path in allPosts) {
    content.push(
      allPosts[path]().then(({ metadata }) => {
        return { path, metadata };
      })
    );
  }

  export const load: Load = async () => {
    const getPosts: LearningSnippet[] = await Promise.all(content);
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

  // PROPS
  export let posts: LearningSnippet[];
</script>

<svelte:head>
  <title>Learning · stibbard.io</title>
  <meta name="og:title" content="Learning · stibbard.io" />
  <meta property="og:url" content="https://www.stibbard.io/learning" />
  <meta
    name="og:description"
    content="Short how-to's and other learnings by Matt Stibbard."
  />
  <meta
    name="description"
    content="Short how-to's and other learnings by Matt Stibbard."
  />
  <meta property="twitter:title" content="Learning · stibbard.io" />
  <meta property="twitter:url" content="https://www.stibbard.io/learning" />
  <meta
    name="twitter:description"
    content="Short how-to's and other learnings by Matt Stibbard."
  />
</svelte:head>

<Section name="Learning">
  <PageHeading>Learning</PageHeading>

  <ul>
    {#each posts as { path, metadata: { title, tags } }}
      <li class="mb-7">
        <a href={`/learning/${path.replace('.md', '')}`}>
          <div class="prose prose-xl text-gray-900 dark:text-gray-100">
            {title}
          </div>
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
