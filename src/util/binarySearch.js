// binary search: determine the maximum integer that passes test.
module.exports = function(size, test) {
	let min = 0; // max passed + 1
	let max = size; // min failed

	while (min !== max) {
		const mid = Math.floor((min - 1 + max) / 2);
		const result = test(mid);
		if (result) {
			// if passed
			min = mid + 1;
		} else {
			// if failed
			max = mid;
		}
	}

	return min - 1;
};
