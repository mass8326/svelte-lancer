import type { PageLoad } from "./$types";
import { sleep } from "$lib/util";

export const load: PageLoad = async () => {
	await sleep(1000);
};
