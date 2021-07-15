const express = require("express")
const router = express.Router()
const candidateModel = require("../models/candidate")
router.use(express.json())
router.get("/", async (req, res) => {
	const validQueries = ["name", "roll", "email", "domain", "year"]
	var queries = {}
	for (item in req.query) {
		if (validQueries.includes(item)) {
			queries[item] = req.query[item]
		}
	}
	if (queries.domain !== undefined) {
		queries.domain = {
			$regex: new RegExp(`${queries.domain}`, "i"),
		}
	}
	if (queries.name !== undefined) {
		queries.name = {
			$regex: new RegExp(`${queries.name}`, "i"),
		}
	}
	try {
		const getAll = await candidateModel.find(queries)
		res.json({ status: true, data: getAll })
	} catch (err) {
		res.json({ status: false, code: 102 })
	}
})
router.patch("/update/all", async (req, res) => {
	try {
		var getAll = await candidateModel.find({})
	} catch (err) {
		res.json({ status: false, code: 102 })
	}
	try {
		getAll.map(async (eachCandidate) => {
			var domains = eachCandidate.domain.split(",")
			for (var i = 0; i < domains.length; i++) {
				domains[i] = {
					domain: domains[i],
					shortlisted: false,
					final: false,
					rating: 0,
				}
			}
			const updateCandidate = await candidateModel.updateOne(
				{
					_id: eachCandidate._id,
				},
				{ $push: { status: { $each: domains } } }
			)
		})
	} catch (err) {
		return res.json({ status: false, code: 102 })
	}
	res.json({ status: "updated" })
})

router.patch("/shortlist/:cid/:did", async (req, res) => {
	var data = req.body.shortlisted
	console.log(String(data))
	const validData = ["true", "false"]
	if (!validData.includes(String(data))) {
		return res.json({ status: false, error: "Shortlisted value invalid" })
	}
	try {
		const updateCandidate = await candidateModel.updateOne(
			{
				_id: req.params.cid,
				"status._id": req.params.did,
			},
			{
				"status.$.shortlisted": data,
			}
		)
		if (updateCandidate.nModified < 1) {
			return res.json({ status: false })
		}
		res.json({ status: true })
	} catch (err) {
		res.json({ status: false, code: 102 })
	}
})
router.patch("/final/:cid/:did", async (req, res) => {
	var data = req.body.final
	const validData = ["true", "false"]
	if (!validData.includes(String(data))) {
		return res.json({ status: false, error: "Final value invalid" })
	}
	try {
		const updateCandidate = await candidateModel.updateOne(
			{
				_id: req.params.cid,
				"status._id": req.params.did,
			},
			{
				"status.$.final": data,
			}
		)
		if (updateCandidate.nModified < 1) {
			return res.json({ status: false, code: 104 })
		}
		res.json({ status: true })
	} catch (err) {
		res.json({ status: false, code: 102 })
	}
})
router.patch("/rating/:cid/:did", async (req, res) => {
	var data = req.body.rating
	console.log(data)
	if (data < 0 || data > 10) {
		return res.json({
			status: false,
			error: "Rating value not in range (0,10)",
		})
	}
	try {
		const updateCandidate = await candidateModel.updateOne(
			{
				_id: req.params.cid,
				"status._id": req.params.did,
			},
			{
				"status.$.rating": data,
			}
		)
		if (updateCandidate.nModified < 1) {
			return res.json({ status: false, code: 104 })
		}
		res.json({ status: true })
	} catch (err) {
		res.json({ status: false, code: 102 })
	}
})

module.exports = router
