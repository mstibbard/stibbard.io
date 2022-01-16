---
layout: learning
title: Stripe Checkout with Phoenix LiveView
publishedOn: 2022-01-14
tags:
  - elixir
  - phoenix
  - stripe
---

<svelte:head>

  <title>Stripe Checkout with Phoenix LiveView · stibbard.io</title>
  <meta name="og:title" content="Stripe Checkout with Phoenix LiveView · stibbard.io" />
  <meta property="og:url" content="https://www.stibbard.io/learning/elixir-phoenix-stripe-checkout" />
  <meta name="og:description" content="How to get up and running with Stripe Checkout in Phoenix LiveView projects" />
  <meta name="description" content="How to get up and running with Stripe Checkout in Phoenix LiveView projects" />
  <meta property="twitter:title" content="Stripe Checkout with Phoenix LiveView · stibbard.io" />
  <meta property="twitter:url" content="https://www.stibbard.io/learning/elixir-phoenix-stripe-checkout" />
  <meta name="twitter:description" content="How to get up and running with Stripe Checkout in Phoenix LiveView projects" />
</svelte:head>

## What is Stripe Checkout?

Stripe Checkout lets you receive a payment from customers without having to handle any card details or create your own payment capture form.

You redirect the user to Stripe and then wait for Stripe to let you know the payment has succeeded (or failed).

## Why use Stripe Checkout?

- So you can get paid real money
- It saves a lot of time (designing, building the form, keeping on top of security, etc)
- You don't need to capture, handle, and dispose of any credit card details on your server(s)

## OK, how do I set up Stripe Checkout in a Phoenix LiveView app?

\_Note: Check out the [GitHub repo](https://github.com/mstibbard/stripe_checkout_example) for the demo app

At a high level there are 3 parts to implementing Stripe Checkout:

1. Prepare your app to handle a Stripe webhook response
2. Triggering a Stripe Checkout
3. Managing prices from Stripe

**Assumptions:**

- you have a Phoenix project already created (`mix phx.new stripe_checkout_example`). This guide was written using Phoenix v1.6.6
- you have a [Stripe](https://www.stripe.com) account
  - You have grabbed your [Stripe Test API Key](https://dashboard.stripe.com/test/apikeys). It looks something like `sk_test_62JhKCJET...`
  - You have created a 1 test price and 1 test tax rate
- you have installed and logged into the [Stripe CLI](https://stripe.com/docs/stripe-cli)

**Steps Summary:**

1. Prepare your app to handle a Stripe webhook response (upon successful/failed payments)
   - Set up your environment variables
   - Install and configure `:stripity_stripe`
   - Capture the raw body of the Stripe webhook message
   - Handle the webhook response
   - Check it works
2. Triggering a Stripe Checkout
   - Prepare our app and database for checkout data
   - Create a web page
   - Create a checkout event handler and update LiveView assigns
   - Update the StripeHandler module
   - Check it works
3. Managing prices from Stripe

## 1. Prepare your app to handle a Stripe webhook response

### Set up your environment variables

In a terminal, start the Stripe CLI listener for local testing (`stripe listen --forward-to localhost:4000/webhook/stripe`) and retrieve the signing secret from the resulting message.

The secret will look something like `whsec_aBcDeFgHiJk...`

Create a `.env` file with the following in the root directory of your Phoenix app.

```elixir
# .env
export STRIPE_API_KEY=sk_test_... # Grab from Stripe Dashboard test mode
export STRIPE_WEBHOOK_SIGNING_SECRET=whsec_... # Grab from Stripe listener
```

_Note: Ensure `.env` is in your `.gitignore` so it is **NOT** committed to your git repo._

Once you've updated your `.env` file with the secrets, execute `source .env` in your terminal.

### Install and configure stripity_stripe

Install the `:stripity_stripe` dependency. Check out the [stripity_stripe GitHub repo](https://github.com/code-corps/stripity_stripe) to see if there's newer versions than below. We are _**NOT**_ using the latest version from Hex because at the time of this writing the maintainers do not have publishing permissions, so the version on Hex is outdated.

```elixir
# mix.exs
defp deps do
  [
    ...,
    {:stripity_stripe,
      git: "https://github.com/code-corps/stripity_stripe",
      ref: "e593641f4087d669f48c1e7435be181bbe3990e0"}
  ]
end
```

Update your config files.

```elixir
# config/dev.exs and config/runtime.exs
config :stripity_stripe,
  api_key: System.get_env("STRIPE_SECRET"),
  stripe_webhook_secret: System.get_env("STRIPE_WEBHOOK_SIGNING_SECRET")
```

### Capture the raw body of the Stripe webhook message

Add the `Stripe.WebhookPlug` to your endpoint. This **MUST** come before the default `Plug.Parsers`.

```elixir
# lib/stripe_checkout_example_web/endpoint.ex
plug Stripe.WebhookPlug,
  at: "/webhook/stripe",
  handler: StripeCheckoutExampleWeb.StripeHandler,
  secret: {Application, :fetch_env!, [:stripity_stripe, :stripe_webhook_secret]}

plug Plug.Parsers,
  ...
```

### Handle the webhook response

Create a `StripeHandler` module.

```elixir
# lib/stripe_checkout_example_web/stripe_handler.ex
defmodule StripeCheckoutExampleWeb.StripeHandler do
  @behaviour Stripe.WebhookHandler

  @impl true
  def handle_event(%Stripe.Event{type: "checkout.session.completed"} = event) do
    # The logic you want to execute on a successful payment goes here
    # For testing purposes, we will just output the result
    IO.inspect(event, label: "STRIPE EVENT")

    {:ok, "success"}
  end

  # Return HTTP 200 for unhandled events
  @impl true
  def handle_event(_event), do: :ok
end
```

We now have everything in place to receive a webhook from Stripe. Let's give it a try!

### Check it works

You will need 3 terminals open:

1. In the first terminal, ensure the Stripe CLI listener is running (`stripe listen --forward-to localhost:4000/webhook/stripe`)

2. In the second terminal, ensure your app is running (`mix phx.server`). Remember you may need to run `source .env` in the terminal first

3. In the third terminal, execute `stripe trigger checkout.session.completed`. We've only set up our webhook to watch for `checkout.session.completed`, but [there are a lot of other types](https://stripe.com/docs/api/events/types) we could listen for

If you flip back to your second terminal and watch your server output, you should see something like:

```
[info] POST /webhook/stripe
[info] Sent 200 in 12ms
[info] POST /webhook/stripe
[info] Sent 200 in 1ms
[info] POST /webhook/stripe
[info] Sent 200 in 1ms
[info] POST /webhook/stripe
[info] Sent 200 in 307┬╡s
[info] POST /webhook/stripe
STRIPE EVENT: %Stripe.Event{
  account: nil,
  api_version: "2020-08-27",
  created: 1641526150,
  data: %{
    object: %Stripe.Session{
      ... stripe fixture data here ...
    }
  },
  id: "evt_1KF98cFSYzAEE2mTpvM7GX1G",
  livemode: false,
  object: "event",
  pending_webhooks: 4,
  request: %{id: nil, idempotency_key: nil},
  type: "checkout.session.completed"
}
```

## 2. Triggering a Stripe Checkout

### Prepare our app and database for checkout data

Run `mix phx.gen.context amount:integer name payment_intent_id`. This will generate our database migration and schema, as well as all the standard CRUD functions. If this were a real app, we'd generally also want to set up the relationship to our `:users` table here.

Run `mix ecto.migrate`

### Create a web page

We'll create a basic page with 3 buttons that trigger a Stripe Checkout with different IDs.

We will also list all the existing checkouts stored in our database.

```elixir
# lib/stripe_checkout_example_web/live/page_live.html.heex
<h1>LiveView-based Checkout trigger</h1>

<%= for item <- @items do %>
  <button phx-click="checkout" phx-value-id={item}>Trigger checkout <%= item %></button>
<% end %>

<h2>Checkouts</h2>
<ul>
<%= for checkout <- @checkouts do %>
  <li><strong>Name:</strong> <%= checkout.name %> · <strong>Amount:</strong> <%= checkout.amount %> · <strong>Payment ID:</strong> <%= checkout.payment_intent_id %></li>
<% end %>
</ul>
```

### Create a checkout event handler and update LiveView assigns

_Note: In the [GitHub commit for this step](https://github.com/mstibbard/stripe_checkout_example/commit/478e74fdc7d704ed98035558e5bf47bde5f16de5) I converted the default controller-based `page` to a LiveView, but you can put this on any LiveView._

- Update our `mount/3` to retrieve all existing Checkouts and add it to our assigns.
- Set up `handle_event/3` to capture `checkout` events and the associated ID
- In `handle_info/2` we prepare the data and redirect the user to Stripe Checkout

```elixir
# lib/stripe_checkout_example_web/live/page_live.ex
defmodule StripeCheckoutExampleWeb.PageLive do
  use StripeCheckoutExampleWeb, :live_view

  alias StripeCheckoutExample.Checkouts

  @impl true
  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign(checkouts: Checkouts.list_checkouts())

    {:ok, socket}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Stripe Checkout example")
    |> assign(:items, ["Alpha", "Bravo", "Charlie"])
  end

  @impl true
  def handle_event("checkout", %{"id" => id}, socket) do
    send(self(), {:create_payment_intent, id: id})

    {:noreply, socket}
  end

  @impl true
  def handle_info({:create_payment_intent, id: id}, socket) do
    price_id = "price_HARD_CODED_PRICE_HERE" # replace with your price ID
    tax_id = "txr_HARD_CODED_TAX_HERE" # replace with your tax rate ID
    url = StripeCheckoutExampleWeb.Endpoint.url()

    create_params = %{
      cancel_url: url,
      success_url: url,
      payment_method_types: ["card"],
      mode: "payment",
      metadata: [name: id],
      line_items: [
        %{
          price: price_id,
          quantity: 1,
          tax_rates: [tax_id]
        }
      ]
    }

    case Stripe.Session.create(create_params) do
      {:ok, session} ->
        {:noreply, redirect(socket, external: session.url)}

      {:error, error} ->
        IO.inspect(error)
        {:noreply, socket}
    end
  end
end
```

### Update the StripeHandler module

```elixir
# lib/stripe_checkout_example_web/stripe_handler.ex
defmodule StripeCheckoutExampleWeb.StripeHandler do
  @behaviour Stripe.WebhookHandler

  alias StripeCheckoutExample.Checkouts

  @impl true
  def handle_event(%Stripe.Event{type: "checkout.session.completed"} = event) do
    # The logic you want to execute on a successful payment goes here
    # For testing purposes, we will just output the result
    IO.inspect(event, label: "STRIPE EVENT")
    %{amount_total: amount, payment_intent: payment_intent} = event.data.object
    %{"name" => name} = event.data.object.metadata

    Checkouts.create_checkout(%{
      amount: amount,
      payment_intent_id: payment_intent,
      name: name
    })

    {:ok, "success"}
  end

  # Return HTTP 200 for unhandled events
  @impl true
  def handle_event(_event), do: :ok
end
```

### Check it works

We will be triggering a test Checkout directly with Stripe now. Our webhook is not currently available on the internet, which means we won't be able to receive the webhook from Stripe.

To remedy this, we use [ngrok](https://ngrok.com/) to create a temporary URL that tunnels to our `localhost:4000` app.

#### ngrok tunnelling

Download and run ngrok. Once it's open, execute `ngrok http 4000`. You will be presented something that looks like

```
Region            United States (us)
Web Interface     http://127.0.0.1:4040
Forwarding        http://8ba7-202-80-145-87.ngrok.io -> http://localhost:4000
Forwarding        https://8ba7-202-80-145-87.ngrok.io -> http://localhost:4000
```

Assuming your app is still running locally, if you visit the url (in above example: `https://8ba7-202-80-145-87.ngrok.io`) you will see your app running.

#### Create a test Stripe webhook endpoint

Navigate to the Stripe Dashboard > Developers > Webhooks > Add endpoint.

- Our endpoint URL will be the temporary ngrok URL + our apps webhook path. E.g., with the above example URL it would be `https://8ba7-202-80-145-87.ngrok.io/webhook/stripe`
- Make sure you select the event: `checkout.session.completed`

**Now that we've created a new webhook, we need to grab our new webhook secret.** There will be a `Signing secret` towards the top of the page, click "Reveal secret" and copy it, paste it in `.env` replacing the old webhook secret.

Re-run `source .env` and then restart our Phoenix app.

#### Try it out

Navigate to either `localhost:4000` or the ngrok URL. Click one of the 3 buttons and it will redirect you to your Stripe Checkout.

- **Email**: Enter whatever you like
- **Card number**: 4242 4242 4242 4242 (this is a [dummy card number](https://stripe.com/docs/testing))
- **Expiry**: Any numbers
- **CVC**: Any numbers
- **Name**: Enter whatever you like

Click Pay.

You will be redirected back to your site and your checkout should appear in the list!

## 3. Managing prices from Stripe

TBC

## Common issues

### Secrets not being read by the application

This is evident by an error like:

```
* 1st argument: not an iodata term

  :erlang.iolist_to_binary(nil)
  (crypto 5.0.4) crypto.erl:604: :crypto.mac/4
  ...
```

**To resolve:** Ensure you have configured `:stripity_stripe` correctly in your _config/\*.exs_ files.

### Incorrect webhook secret set

This is evident by your test webhook events getting `400` responses from your app like:

```
[info] POST /webhook/stripe
[info] Sent 400 in 102┬╡s
```

If you triggered the event via the Stripe dashboard, you may also see an error like `No signatures found matching the expected signature for payload`

**To resolve:** Ensure you are copying the webhook secret from the terminal and/or Stripe Dashboard. It should look like `whsec_x1FDrewr4543sdf346y`
