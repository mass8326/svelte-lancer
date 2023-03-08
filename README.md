# svelte-lancer

Lightweight utility class (<5kb) that makes using
[SvelteKit's enhance actions](https://kit.svelte.dev/docs/form-actions#progressive-enhancement)
easy and compact using the power of stores! Get rid of repetitive code that tracks if your form is still loading.

Available through the [npm registry](https://www.npmjs.com/), use your preferred package manager to install.

```sh
$ npm install -D svelte-lancer
```

## Quick Start

Using `SvelteLancer` is at its most basic looks like this:

```html
<script lang="ts">
	import { enhance } from "$app/forms";
	import { SvelteLancer } from "svelte-lancer";
	const lancer = new SvelteLancer();
</script>

<form method="POST" use:enhance={lancer.submit}>
	<button disabled={$lancer.loading}>Click Me!</button>
</form>
```

Compare to what would be needed by writing a `SubmitFunction`:

```html
<script lang="ts">
	import { type SubmitFunction, enhance } from "$app/forms";
	let loading = false;
	const submit: SubmitFunction = () => {
		loading = true;
		return async ({ result, update }) => {
			await update();
			loading = false;
		};
	};
</script>

<form method="POST" use:enhance={submit}>
	<button disabled={loading}>Click Me!</button>
</form>
```

## Prevent Disable Flicker After Redirect

With `SvelteLancer`:

```html
<script lang="ts">
	import { enhance } from "$app/forms";
	import { SvelteLancer } from "svelte-lancer";
	const lancer = new SvelteLancer();
	$: disabled = $lancer.loading || $lancer.count.redirect;
</script>

<form method="POST" use:enhance={lancer.submit}>
	<button {disabled}>Log In</button>
</form>
```

With `SubmitFunction`:

```html
<script lang="ts">
	import { type SubmitFunction, enhance } from "$app/forms";
	let loading = false;
	const submit: SubmitFunction = () => {
		loading = true;
		return async ({ result, update }) => {
			await update();
			if (result.type !== "redirect") loading = false;
		};
	};
</script>

<form method="POST" use:enhance={submit}>
	<button disabled={loading}>Log In</button>
</form>
```

## Prevent Rendering Error Page

With `SvelteLancer`:

```html
<script lang="ts">
	import { enhance } from "$app/forms";
	import { SvelteLancer } from "svelte-lancer";
	const lancer = new SvelteLancer().on("error", () => console.log("no-op"));
</script>

<form method="POST" use:enhance={lancer.submit}>
	<button disabled={$lancer.loading}>Might Error...</button>
</form>
```

With `SubmitFunction`:

```html
<script lang="ts">
	import { type SubmitFunction, enhance } from "$app/forms";
	let loading = false;
	const submit: SubmitFunction =
		() => {
			loading = true;
			return ({ result, update }) => {
				loading = false;
				if (result.type !== "error") await update();
				else console.log("no-op");
				loading = false;
			};
		}
</script>

<form method="POST" use:enhance={submit}>
	<button disabled={loading}>Might Error...</button>
</form>
```

## Demo Project

Check out `src/routes/+page.svelte` for more reference. It is deployed at https://svelte-lancer.vercel.app/
