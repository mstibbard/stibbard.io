import relativeImages from 'mdsvex-relative-images';

const config = {
  layout: {
    blog: 'src/lib/layouts/blog.svelte',
    learning: 'src/lib/layouts/learning.svelte'
  },
  extensions: ['.svelte.md', '.md', '.svx'],
  smartypants: {
    dashes: 'oldschool'
  },
  remarkPlugins: [relativeImages],
  rehypePlugins: []
};

export default config;
