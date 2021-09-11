<script lang="ts">
  import PageHeading from '$lib/components/pageHeading.svelte';
  import Product from '$lib/components/product.svelte';
  import Section from '$lib/components/section.svelte';
</script>

<Section name="Intro">
  <PageHeading>Hi, I'm Matt Stibbard</PageHeading>
  <div
    class="prose dark:prose-dark text-gray-600 dark:text-gray-400 max-w-none"
  >
    <p>
      I'm a Management Consultant turned Indie Hacker. I love coffee, finance,
      and technology. I live in Sydney, Australia. &#127462;&#127482;
    </p>

    <p>
      You've stumbled upon my personal site. This is where I keep track of the
      products I've built and my lessons learned along the way.
    </p>

    <p>
      Check out my <a href="/learning">Learning</a> page for short snippets and
      other reference materials. For longform content, check out my
      <a href="blog">Blog</a>.
    </p>

    <p>
      You can also follow me on <a href="https://twitter.com/MatthewStibbard"
        >Twitter</a
      >.
    </p>
  </div>
</Section>

<Section name="Aussie Indie Hackers">
  <h1
    class="mb-4 text-2xl md:text-4xl font-bold tracking-tight text-black dark:text-white"
  >
    Aussie Founders
  </h1>
  <div
    class="prose dark:prose-dark text-gray-600 dark:text-gray-400 max-w-none dark:max-w-none"
  >
    <p>
      Thinking of bootstrapping your own product? Already well on your way? Join
      the fledgling <a href="https://discord.gg/BHyBgErXnd"
        >Aussie Founders Discord</a
      >. It's a friendly group of likeminded people keen to learn together,
      share wins, and keep each other accountable.
    </p>
  </div>
</Section>

<Section name="Products">
  <h1
    class="mb-4 text-2xl md:text-4xl font-bold tracking-tight text-black dark:text-white"
  >
    Products
  </h1>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <Product
      name="Aussie Founders"
      launchDate={new Date(2021, 7, 2)}
      mrr="N/A"
      url="https://discord.gg/BHyBgErXnd"
      users={6}
      usersCalled="Members"
    />
    <Product name="Cafe Hero" launchDate="" mrr={0} users={0} />
    <Product name="CODENAME: BAKERY" launchDate="" mrr={0} users={0} />
    <Product name="CODENAME: PROSPER" launchDate="" mrr={0} users={0} />
  </div>
</Section>
