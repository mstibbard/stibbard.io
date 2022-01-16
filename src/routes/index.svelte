<script lang="ts">
  import PageHeading from '$lib/components/pageHeading.svelte';
  import Section from '$lib/components/section.svelte';
</script>

<svelte:head>
  <title>stibbard.io</title>
  <meta name="og:title" content="stibbard.io" />
  <meta property="og:url" content="https://www.stibbard.io/" />
  <meta
    name="og:description"
    content="Matt Stibbard's personal site, where he writes (very occasionally) about topics he's learned or found interesting at the time."
  />
  <meta
    name="description"
    content="Matt Stibbard's personal site, where he writes (very occasionally) about topics he's learned or found interesting at the time."
  />
  <meta property="twitter:title" content="stibbard.io" />
  <meta property="twitter:url" content="https://www.stibbard.io/" />
  <meta
    name="twitter:description"
    content="Matt Stibbard's personal site, where he writes (very occasionally) about topics he's learned or found interesting at the time."
  />
</svelte:head>

<Section name="Intro">
  <PageHeading>Hi, I'm Matt Stibbard</PageHeading>
  <div
    class="prose dark:prose-dark text-gray-600 dark:text-gray-400 max-w-none"
  >
    <p>
      I love coffee, finance, and technology. I live in Sydney, Australia.
      &#127462;&#127482;
    </p>

    <p>
      You've stumbled upon my personal site. This is where I write (very
      occasionally) on topics that I've learned or find interesting at the time.
    </p>

    <p>It is mostly for my own future reference.</p>

    <p>
      You can also follow me on <a href="https://twitter.com/MatthewStibbard"
        >Twitter</a
      > if that's your thing.
    </p>
  </div>
</Section>

<Section name="Aussie Founders">
  <h1
    class="mb-4 text-2xl md:text-4xl font-bold tracking-tight text-black dark:text-white"
  >
    Aussie Founders
  </h1>
  <div
    class="prose dark:prose-dark text-gray-600 dark:text-gray-400 max-w-none dark:max-w-none"
  >
    <p>
      Aussie Founders is a growing community bringing together & supporting
      Aussies having a go at their own business.
    </p>

    <p>
      Whether you have goals of raising capital & hyper growth, or bootstrapping
      a side project, you'll find likeminded people to learn with, share the
      highs and lows, and keep each other accountable.
    </p>

    <p>
      If that sounds of interest to you, come and join us on the <a
        href="https://discord.gg/BHyBgErXnd">Aussie Founders Discord</a
      >.
    </p>
  </div>
</Section>
