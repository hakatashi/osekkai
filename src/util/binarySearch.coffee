# binary search: determine the maximum integer that passes test.
module.exports = (size, test) ->
	min = 0 # max passed + 1
	max = size # min failed

	while min isnt max
		mid = Math.floor (min - 1 + max) / 2
		result = test mid
		if result
			# if passed
			min = mid + 1
		else
			# if failed
			max = mid

	return min
