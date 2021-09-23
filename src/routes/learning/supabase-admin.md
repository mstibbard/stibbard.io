---
layout: learning
title: Supabase Admin
publishedOn: 2021-09-23
tags:
  - supabase
---

This is the Supabase equivalent of the Firebase Admin SDK.

## Why do I need Supabase Admin?

You need this capability for certain actions in your server side code.

Your server will (generally) not have a valid user session, which means it cannot interact with your database tables with row level security (RLS) implemented.

E.g. you have an endpoint that receives Stripe webhooks and want to persist some details from the webhook to a RLS enabled table.

## ⚠️ Warning ⚠️

The entire point of the Supabase Admin is to bypass your security. Therefore, ensure the admin is never exposed client-side, and only use the admin if absolutely necessary.

Again, **_never use the admin in client code_**.

## Dependencies

We need to import a secret key from our environment variables. So add `dotenv` (or similar) to your project dependencies.

I have a learning snippet on handling secret environment variables with SvelteKit [here](/learning/sveltekit-env-variables).

## How do I do it?

It's really simple.

Grab the `service_role` `secret` from your Supabase > Settings > API and add it as an environment variable.

_.env_

```
SUPABASE_SERVICE_KEY=blablabla
```

Then create a client like normal but use the `service_role` instead of the `anon` key.

_src/lib/utils/supabase-admin.ts_

```ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseServiceKey = process.env['SUPABASE_SERVICE_KEY'];

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
```

Now you can use `supabaseAdmin` in your project's server-side code to bypass all row level security.

You use `supabaseAdmin` the same way you use the normal supabase client.

E.g.

```ts
import { supabaseAdmin } from '$lib/utils/supabase-admin';

await supabaseAdmin.from('table_name').select('*');
```
