const express = require("express")
const mongoose = require("mongoose")
require("dotenv/config")
const app = express()
app.use(express.json())
const candidateRoute = require("./routes/candidateRoute")

app.use("/api/candidate", candidateRoute)

app.use(express.static(__dirname + "/css"))
app.use(express.static(__dirname + "/js"))
app.use(express.static(__dirname + "/images"))
app.set("view engine", "ejs")

app.get("/", (req, res) => {
	res.render("homepage")
})
mongoose.connect(process.env.DB_CONNECTION, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
})
app.listen(3000 || process.env.PORT)
