/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
	if (string === '') {
		return '';
	}

	if (size === 0) {
		return '';
	}

	if (size === undefined) {
		return string;
	}

   let count = 0;
	const result = [];
	const arr = [];

	for (let symbol of string) {
		arr.push(symbol);
	}

	arr.forEach(symbol => {
		if (result.at(-1) === symbol && size !== count) {
			count++;
			result.push(symbol);
		} else if (result.at(-1) !== symbol) {
			count = 1;
			result.push(symbol);
		}
	});
	
   return result.join('');
}
