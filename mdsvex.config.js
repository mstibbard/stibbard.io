import relativeImages from 'mdsvex-relative-images';

const config = {
  layout: {
    blog: 'src/lib/layouts/blog.svelte'
  },
  extensions: ['.svelte.md', '.md', '.svx'],
  smartypants: {
    dashes: 'oldschool'
  },
  remarkPlugins: [relativeImages],
  rehypePlugins: []
};

export default config;
