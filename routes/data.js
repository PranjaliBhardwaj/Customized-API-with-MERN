const router = require("express").Router();
const Movie = require("../models/Data");
const movies = require("../config/data.json");

router.get("/data", async (req, res) => {
	try {
		const page = parseInt(req.query.page) - 1 || 0;
		const limit = parseInt(req.query.limit) || 5;
		const search = req.query.search || "";
		let sort = req.query.sort || "rating";
		let status = req.query.status || "All";

		const statusOptions = [
			"pending",
      "done",
			"clear",
		];

		status === "All"
			? (status = [...statusOptions])
			: (status = req.query.status.split(","));
		req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

		let sortBy = {};
		if (sort[1]) {
			sortBy[sort[0]] = sort[1];
		} else {
			sortBy[sort[0]] = "asc";
		}

		const movies = await Movie.find({ name: { $regex: search, $options: "i" } })
			.where("status")
			.in([...status])
			.sort(sortBy)
			.skip(page * limit)
			.limit(limit);

		const total = await Data.countDocuments({
			genre: { $in: [...status] },
			name: { $regex: search, $options: "i" },
		});

		const response = {
			error: false,
			total,
			page: page + 1,
			limit,
			status: statusOptions,
			data,
		};

		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

module.exports = router;
