<script lang="ts" context="module">
	import type { ActionData } from "./$types";
	import { enhance } from "$app/forms";
	import Button from "$lib/button.svelte";
	import { SvelteLancer } from "$lib/lancer";
</script>

<script lang="ts">
	export let form: ActionData;

	let codes: string[] = [];
	const lancer = new SvelteLancer<ActionData>()
		.on("success", ({ result, update }) => {
			// Type hinting is available but not perfect
			codes = [result.data!.code!, ...codes.slice(0, 2)];
			return update();
		})
		.on("error", ({ result }) => {
			// Prevent SvelteKit from rendering nearest error page!
			// Simply do not call update()
			console.log(result.type, result.error);
		})
		.on("fallback", ({ result, update }) => {
			// Fallback is called for result types that haven't been given a handler
			console.log(result.type);
			return update();
		});
	$: disabled = $lancer.loading || $lancer.count.redirect > 0;
</script>

<div class="flex flex-col m-4 gap-4">
	<h1 class="text-5xl">svelte-lancer</h1>
	<form
		class="flex flex-col gap-4"
		method="POST"
		action="?/empty"
		use:enhance={lancer.submit}
	>
		<input
			class="px-2 py-1 border border-gray-300 rounded"
			name="empty"
			placeholder="Please leave me empty..."
			{disabled}
		/>
		<Button {disabled}>
			{#if !disabled}
				Promise Input Is Empty
			{:else}
				{$lancer.action?.searchParams.has("/empty") ? "Loading" : "Waiting"}
			{/if}
		</Button>
		<Button {disabled} formaction="?/problem">
			{#if !disabled}
				Cause Problems
			{:else}
				{$lancer.action?.searchParams.has("/problem") ? "Loading" : "Waiting"}
			{/if}
		</Button>
		<Button {disabled} formaction="?/redirect">
			{#if !disabled}
				Redirect To Slow Page
			{:else}
				{$lancer.action?.searchParams.has("/redirect") ? "Loading" : "Waiting"}
			{/if}
		</Button>
		<Button disabled={$lancer.loading} formaction="?/redirect">
			{#if !$lancer.loading}
				Redirect Without Count Check
			{:else}
				{$lancer.action?.searchParams.has("/redirect") ? "Loading" : "Waiting"}
			{/if}
		</Button>
	</form>
	<div class="flex">
		<pre class="w-full overflow-scroll">{JSON.stringify($lancer, null, 2)}</pre>
		<div class="w-full">
			<div>Feel free to open your console!</div>
			{#if form?.msg}
				<div>{form.msg}</div>
			{:else if form}
				{#if $lancer.count.success > 3}
					<div>Too much success! ({$lancer.count.success} to be exact.)</div>
				{/if}
				{#each codes as code}
					<div>{code}</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
