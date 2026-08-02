const detectIndent = require("detect-indent");
const detectNewline = require("detect-newline");
const stringifyPackage = require("stringify-package");

module.exports.readVersion = function (contents) {
	return JSON.parse(contents).rules[0].value;
};

module.exports.writeVersion = function (contents, version) {
	const json = JSON.parse(contents);
	const indent = detectIndent(contents).indent;
	const newline = detectNewline(contents);
	json.rules[0].value = version;
	return stringifyPackage(json, indent, newline);
};
