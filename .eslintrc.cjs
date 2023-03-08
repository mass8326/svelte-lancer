/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,
	env: { browser: true, node: true, es2022: true },
	extends: ["@mgnsfr/eslint-config/svelte"],
	overrides: [
		{
			files: ["*.d.ts"],
			rules: { "@typescript-eslint/consistent-type-imports": "off" },
		},
		{
			files: ["*.svelte"],
			rules: { "no-self-assign": "off" },
		},
	],
	rules: {
		"import/default": "off",
		"import/no-named-as-default": "off",
		"import/no-named-as-default-member": "off",
		"unicorn/template-indent": ["warn", { indent: "\t" }],
	},
};
