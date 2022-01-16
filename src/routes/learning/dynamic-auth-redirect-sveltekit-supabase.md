---
layout: learning
title: Dynamic Authentication Redirects with SvelteKit, Supabase, and Vercel
publishedOn: 2021-09-30
updatedOn: 2022-01-16
tags:
  - sveltekit
  - supabase
  - vercel
---

<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>

  <title>Dynamic Authentication Redirects with SvelteKit, Supabase, and Vercel · stibbard.io</title>
  <meta name="og:title" content="Dynamic Authentication Redirects with SvelteKit, Supabase, and Vercel · stibbard.io" />
  <meta property="og:url" content="https://www.stibbard.io/learning/dynamic-auth-redirect-sveltekit-supabase" />
  <meta name="og:description" content="How to set up dynamic Authentication redirects when working with SvelteKit, Supabase, and Vercel" />
  <meta name="description" content="How to set up dynamic Authentication redirects when working with SvelteKit, Supabase, and Vercel" />
  <meta property="twitter:title" content="Dynamic Authentication Redirects with SvelteKit, Supabase, and Vercel · stibbard.io" />
  <meta property="twitter:url" content="https://www.stibbard.io/learning/dynamic-auth-redirect-sveltekit-supabase" />
  <meta name="twitter:description" content="How to set up dynamic Authentication redirects when working with SvelteKit, Supabase, and Vercel" />
</svelte:head>

## What is the problem?

Most projects use multiple environments: dev, preview, production, etc. This has many benefits, but also causes some new challenges.

One challenge is managing redirect URLs between Vercel environments and Supabase.

Vercel dynamically generates preview environment URLs upon deployment. The URL can be random or based on git branch names. It is generally unpredictable.

An example URL would be `https://fake-branch-name.projectname.vercel.app`.

When paired with Supabase this creates a chicken and egg problem. Our code (specifically, our Supabase API call to login/register a user) must provide the redirect URL, but you don't have the URL until you deploy and Vercel generates one for you.

So our deployed code needs details that we don't have until after we've deployed our code. And if we update our code with the generated URL and redeploy, we get yet another URL!

## Ok, how do I fix it?

Fortunately this has an easy solution in SvelteKit.

We need to:

1. Dynamically create our redirect URL in our client-side code (only needs to be done once, set-and-forget)
2. Add our Vercel-generated URL as an Additional Redirect URL in the Supabase UI (required for every unique preview url from Vercel)

### Dynamic URL creation on the client-side

As we don't know the URL until after we deploy, our code needs to dynamically create the URL and pass it to the Supabase API's login/register functions.

Using the built-in SvelteKit features [$app/env](https://kit.svelte.dev/docs#modules-$app-env) and [$app/stores](https://kit.svelte.dev/docs#modules-$app-stores), we can do just that.

We use `dev` from `$app/env` to check if we are in development (i.e. we ran `yarn dev`) and dynamically change our URL prefix between http and https. _Technically we could skip this step but we also want to be able to test on our local machine._

```ts
import { dev } from '$app/env';
const prefix: string = dev ? 'http://' : 'https://';
```

We use `$page.url.host` from `$app/stores` to grab the host domain details that the application is running on. For example, the page you are reading now has a `$page.url.host` of _**{$page.url.host}**_.

We then create a variable and combine the two to create our redirect URL.

```ts
import { page } from '$app/stores';
const redirectUrl = `${prefix}${$page.url.host}`;
// redirectUrl would be http://localhost:3000 if you run in dev OR
// redirectUrl would be https://www.stibbard.io if you were on the current page
```

Now, combining it all would look like:

```ts
<script lang="ts">
  import { dev } from '$app/env';
  import { page } from '$app/stores';
  import { supabase } from '$src/utils/supabase';

  let email: string;
  const prefix: string = dev ? 'http://' : 'https://';
  const redirectUrl: string = `${prefix}${$page.url.host}`;

  const handleSubmit = async () => {
    await supabase.auth.signIn(
      { email },
      { redirectTo: redirectUrl }
    );
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={email} type="email" required />
  <button type="submit">Send magic link</button>
</form>
```

Now we can deploy our code and `redirectUrl` will be valid regardless of the Vercel-generated URL.

### Supabase UI whitelisting

**NOTE:** The Supabase UI part will need to be done for every unique unique URL you get from Vercel.

Now that we have the Vercel-generated URL, we need to whitelist the redirect link in the Supabase UI.

Navigate to Authentication settings (Authentication > Settings), and add our Vercel-generated URL to the `Additional Redirect URLs` line.

For example:

```
http://localhost:3000,https://fake-branch-name.projectname.vercel.app
```

Now all future deployments (regardless of environment) will have working authentication!
