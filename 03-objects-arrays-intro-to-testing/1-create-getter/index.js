/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
	const srcArr = path.split('.');
	let result;

	return function get(obj) {
		if (!obj) return;

		for (const [key, value] of Object.entries(obj)) {
			if (key === srcArr.at(-1) && Object.prototype.toString.call(value) !== '[object Object]') {
				return result = value;
			} else if (Object.prototype.toString.call(value) === '[object Object]') {
				get(value);
			}
		};

		return result;
	};
}
