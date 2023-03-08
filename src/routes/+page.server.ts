import type { Actions } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { nanoid } from "nanoid";
import { sleep } from "$lib/util";

export const actions: Actions = {
	async empty({ request }) {
		await sleep(500);
		const data = await request.formData();
		if (data.get("empty"))
			return fail(400, { msg: "Why didn't you leave me empty?" });
		return { code: nanoid(12) };
	},
	async problem() {
		await sleep(500);
		const message = "Problem was caused!";
		throw error(500, { message });
	},
	async redirect() {
		await sleep(500);
		throw redirect(302, "/slow");
	},
};
