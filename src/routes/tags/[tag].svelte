<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';
  import type { BlogPost } from 'src/global';

  const allPosts = import.meta.glob('../blog/*.md');

  let content: Promise<BlogPost>[] = [];
  for (let path in allPosts) {
    content.push(
      allPosts[path]().then(({ metadata }) => {
        return { path, metadata };
      })
    );
  }

  export const load: Load = async ({ page }) => {
    const getPosts: BlogPost[] = await Promise.all(content);
    const tag = page.params.tag;

    const dateOrderedPosts = getPosts.sort(function (a, b) {
      return (
        new Date(b.metadata.publishedOn).valueOf() -
        new Date(a.metadata.publishedOn).valueOf()
      );
    });

    const filteredPosts = dateOrderedPosts.filter((post) => {
      return post.metadata.tags?.includes(tag);
    });

    return {
      props: {
        filteredPosts,
        tag
      }
    };
  };
</script>

<script lang="ts">
  import PageHeading from '$lib/components/pageHeading.svelte';
  import Section from '$lib/components/section.svelte';

  // PROPS
  export let filteredPosts: BlogPost[];
  export let tag: string;
</script>

<Section name="Tag">
  <PageHeading>#{tag} Blog Posts</PageHeading>

  <ul>
    {#each filteredPosts as { path, metadata: { title, excerpt, tags } }}
      <li class="mb-7">
        <a href={`/blog/${path.replace('.md', '')}`}>
          <div class="prose prose-xl text-gray-900 dark:text-gray-100">
            {title}
          </div>
          <p class="prose text-gray-600 dark:text-gray-400 max-w-none">
            {excerpt}
          </p>
        </a>
      </li>
    {/each}
  </ul>
</Section>
