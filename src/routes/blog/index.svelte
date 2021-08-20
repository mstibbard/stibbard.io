<script context="module" lang="ts">
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

  export const load = async () => {
    const getPosts: BlogPost[] = await Promise.all(content);
    const posts = getPosts.sort(function (a, b) {
      return (
        new Date(b.metadata.date).valueOf() -
        new Date(a.metadata.date).valueOf()
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

<Section name="Blog">
  <PageHeading>Blog</PageHeading>

  <ul>
    {#each posts as { path, metadata }}
      <li class="mb-7">
        <a href={`/blog/${path.replace('.md', '')}`}>
          <div class="prose prose-xl text-gray-900 dark:text-gray-100">
            {metadata.title}
          </div>
          <p class="prose text-gray-600 dark:text-gray-400 max-w-none">
            {metadata.excerpt}
          </p>
        </a>
      </li>
    {/each}
  </ul>
</Section>
