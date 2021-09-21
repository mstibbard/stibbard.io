---
layout: learning
title: Environment variables in SvelteKit
publishedOn: 2021-09-21
tags:
  - sveltekit
---

## What are environment variables?

Environment variables are named variables which change the way our application runs. This enables us to have multiple environments, with different databases etc, without requiring any code changes.

## Why & when should I use environment variables?

Use environment variables to differentiate between environments (product, preview, dev, etc.) for things such as:

- database credentials and urls
- publishable keys (e.g. with supabase, the `anon` and `url`)
- secrets (e.g. with stripe, the secret key)

For example, we generally have a separate database for production and development. Our environment variable for DATABASE_URL locally could be `DATABASE_URL=dbdev.ourapp.com` while our deployed application would have `DATABASE_URL=dbprod.ourapp.com`.

## Where do environment variables live?

They are stored in a `.env` file, or some variation of that such as `.env.local`, etc. My preference is to use `.env`.

`.env` files **must not** be added to version control - so make sure they are in our `.gitignore`.

_.gitignore_

```
...
.env
```

Because these are kept out of version control, it is common to pair every `.env` file with a `.env.example` file showing what it should contain. The example file should be version controlled.

## What does a .env file look like?

An environment variable file is plaintext.

Below is a mockup of `.env` and `.env.example` for a simple application using supabase and stripe.

_.env_

```
VITE_SUPABASE_URL=https://abcdefg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJdfdnuu3e3ej3Wjew.eyJewqedsa
VITE_STRIPE_PUBLIC_KEY=pk_test_24mk3szSd4233
STRIPE_SECRET_KEY=sk_test_24mfdsk3E4r
```

_.env.example_

```
VITE_SUPABASE_URL=https://xxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=<jwt_token>
VITE_STRIPE_PUBLIC_KEY=<stripe_public_key>
STRIPE_SECRET_KEY=<stripe_secret_key>
```

## OK, so what's different about them with SvelteKit?

### Public / publishable keys

SvelteKit uses Vite which provides access to environment variables via `import.meta.env.VAR_NAME`.

`import.meta.env.VAR_NAME` is limited to public/publishable keys which are prefixed with `VITE_`.

Importing the two publishable supabase keys from the example above would be:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

### Secret keys

But what if we want to make use of a secret key which shouldn't be exposed to the world. Such as our `STRIPE_SECRET_KEY`?

We can do so by adding the `dotenv` package to our application dependencies.

```bash
npm install dotenv
or
yarn add dotenv
```

Now, wherever we need to access our secrets, we import the package and point it at our environment variable file.

This example is a snippet from initialising stripe

_src/lib/utils/stripe.ts_

```typescript
...
import dotenv from 'dotenv';

// dotenv.config looks for a .env file in the project's root
// directory. If using a .env.local etc or a file in a
// subdirectory a path must be specified
// e.g. dotenv.config({ path: '.env.local' });
dotenv.config();

const stripeSecretKey = process.env['STRIPE_SECRET_KEY'] as string;
...
```

Now our application can access our secret environment variables.
