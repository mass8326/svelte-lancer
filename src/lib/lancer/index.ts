import type { ActionResult, SubmitFunction } from "@sveltejs/kit";
import { type Readable, writable } from "svelte/store";

export interface SvelteLancerData {
	loading: boolean;
	action?: URL;
	count: Record<ActionResult["type"], number>;
}
export class SvelteLancer<T extends Record<string, unknown> | null>
	implements Readable<SvelteLancerData>
{
	// Make this class implement readable store
	public store = writable<SvelteLancerData>({
		loading: false,
		count: { success: 0, failure: 0, error: 0, redirect: 0 },
	});
	public subscribe = this.store.subscribe;

	// Chainable handlers
	private handlers: Handlers<T> = {
		fallback: ({ update }) => update(),
	};
	public on(
		result: ActionResult["type"] | "fallback",
		handler: SvelteLancerHandler<T>
	): this {
		this.handlers[result] = handler;
		return this;
	}

	// Submit function
	public submit: SubmitFunction = ({ action }) => {
		this.store.update((data) => ({ ...data, action, loading: true }));
		return async (options) => {
			const key = options.result.type;
			const handler = this.handlers[key] ?? this.handlers.fallback;
			await handler(options as any);
			this.store.update((data) => ({
				...data,
				loading: false,
				count: {
					success: data.count.success + Number(key === "success"),
					failure: data.count.failure + Number(key === "failure"),
					redirect: data.count.redirect + Number(key === "redirect"),
					error: data.count.error + Number(key === "error"),
				},
			}));
		};
	};
}

/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
type MaybePromise<T> = T | Promise<T>;
type ExtractFunction<T> = T extends Function ? T : never;
type SubmitFunctionReturn = ExtractFunction<ReturnType<SubmitFunction>>;
type SubmitFunctionReturnOptions = Parameters<SubmitFunctionReturn>[0];

type SubmitLancerActionResult<T extends Record<string, unknown> | null = null> =
	{
		result: {
			type: ActionResult["type"];
			status: number;
			data?: T;
			location?: string;
			error?: any;
		};
	};
type SvelteLancerHandlerOptions<T extends Record<string, unknown> | null> =
	SubmitFunctionReturnOptions & SubmitLancerActionResult<T>;

export type SvelteLancerHandler<T extends Record<string, unknown> | null> = (
	opts: SvelteLancerHandlerOptions<T>
) => MaybePromise<void>;

type Handlers<T extends Record<string, unknown> | null> = Partial<
	Record<ActionResult["type"], SvelteLancerHandler<T>>
> & {
	fallback: SvelteLancerHandler<T>;
};
