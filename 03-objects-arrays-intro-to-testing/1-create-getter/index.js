/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
	const srcArr = path.split('.');
	let result;

	return function get(obj) {
		for (let [key, value] of Object.entries(obj)) {
			if (key === srcArr.at(-1) && typeof value !== 'object') {
				return result = value;
			} else if (typeof value === 'object') {
				get(value);
			}
		};

		return result;
	};
}
