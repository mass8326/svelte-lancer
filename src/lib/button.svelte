<script lang="ts">
	export let disabled: boolean | undefined = undefined;
	export let formaction: string | undefined = undefined;
</script>

<button
	class="h-12 border border-gray-300 rounded"
	type="submit"
	{disabled}
	{formaction}
>
	<slot />
</button>
