module.exports = {
	"env": {
		"browser": true,
		"jest": true,
		"node": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended"
	],
	"overrides": [
	],
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"react"
	],
	"rules": {
		"indent": [
			"error",
			"tab",
			{"SwitchCase": 1}
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"no-unused-vars": ["warn"],
		"semi": [
			"error",
			"always"
		],
		"react/react-in-jsx-scope": "off",
		"react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
		"react/prop-types": "off",
	},
	"settings": {
		"react": {
			"version": "detect"
		}
	}
};
