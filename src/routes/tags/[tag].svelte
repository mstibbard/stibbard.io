<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';
  import type { BlogPost, LearningSnippet } from 'src/global';

  const allPosts = import.meta.glob('../blog/*.md');
  const allSnippets = import.meta.glob('../learning/*.md');

  let blogContent: Promise<BlogPost>[] = [];
  let snippetContent: Promise<LearningSnippet>[] = [];

  for (let path in allPosts) {
    blogContent.push(
      allPosts[path]().then(({ metadata }) => {
        return { path, metadata };
      })
    );
  }

  for (let path in allSnippets) {
    snippetContent.push(
      allSnippets[path]().then(({ metadata }) => {
        return { path, metadata };
      })
    );
  }

  function sortByDateDescending(
    list: BlogPost[] | LearningSnippet[]
  ): BlogPost[] | LearningSnippet[] {
    list.sort(function (a, b) {
      return (
        new Date(b.metadata.publishedOn).valueOf() -
        new Date(a.metadata.publishedOn).valueOf()
      );
    });

    return list;
  }

  function filterForTag(
    list: BlogPost[] | LearningSnippet[],
    tag: string
  ): BlogPost[] | LearningSnippet[] {
    const filteredList: BlogPost[] | LearningSnippet[] = list.filter((item) => {
      return item.metadata.tags?.includes(tag);
    });

    return filteredList;
  }

  export const load: Load = async ({ page }) => {
    const getPosts: BlogPost[] = await Promise.all(blogContent);
    const getSnippets: LearningSnippet[] = await Promise.all(snippetContent);
    const tag = page.params.tag;

    const dateOrderedPosts = sortByDateDescending(getPosts);
    const dateOrderedSnippets = sortByDateDescending(getSnippets);

    const filteredPosts = filterForTag(dateOrderedPosts, tag);
    const filteredSnippets = filterForTag(dateOrderedSnippets, tag);

    return {
      props: {
        filteredPosts,
        filteredSnippets,
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
  export let filteredSnippets: LearningSnippet[];
  export let tag: string;
</script>

{#if filteredPosts.length !== 0}
  <Section name={`${tag} blog posts`}>
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
{/if}

{#if filteredSnippets.length !== 0}
  <Section name={`${tag} learning snippets`}>
    <PageHeading>#{tag} Learning Snippets</PageHeading>

    <ul>
      {#each filteredSnippets as { path, metadata: { title, tags } }}
        <li class="mb-7">
          <a href={`/learning/${path.replace('.md', '')}`}>
            <div class="prose prose-xl text-gray-900 dark:text-gray-100">
              {title}
            </div>
          </a>
        </li>
      {/each}
    </ul>
  </Section>
{/if}
