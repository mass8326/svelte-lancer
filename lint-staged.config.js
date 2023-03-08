export default {
	"*.{ts,js,cjs,mjs,svelte}": "eslint --fix",
	"*.{html,css,json}": "prettier --ignore-path .eslintignore --write",
};
