module.exports = (collection) => {
	const data = {};

	collection.forEach((col) => {
		Object.keys(col).forEach((key) => {
			// Group unique values
			if (data[key] !== undefined && data[key] !== col[key]) {
				if (!Array.isArray(data[key])) {
					data[key] = [data[key], col[key]];
				} else {
					data[key].push(col[key]);
				}
			}

			// Otherwise add value to object
			else data[key] = col[key];
		});
	});

	return data;
};
