/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
	let arr = [];

	for (let i = 0; i < Object.entries(obj).length; i++) {
		Object.entries(obj).filter(item => {
			if (item[0] === fields[i]) {
				arr.push(item);
			}
		});
	}

	for (let i = 0; i < arr.length; i++) {
		if (arr[i].length === 0) arr.splice(i, 1);
	}

	return Object.fromEntries(arr);
};
