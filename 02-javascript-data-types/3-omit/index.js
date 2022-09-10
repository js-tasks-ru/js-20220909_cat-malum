/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
	let arr = Object.entries(obj).filter(item => {
		if (!fields.includes(item[0])) return item;
	});

	for (let i = 0; i < arr.length; i++) {
		if (arr.includes(undefined)) arr.splice(i, 1);
	}

	return Object.fromEntries(arr);
};
