const openGithub = (index) => {
	console.log(document.querySelector(`.githubLink.l${index}`).innerHTML)
	window.open(`${document.querySelector(`.githubLink.l${index}`).innerHTML}`)
}
const openResume = (index) => {
	console.log(document.querySelector(`.resumeLink.l${index}`).innerHTML)
	window.open(`${document.querySelector(`.resumeLink.l${index}`).innerHTML}`)
}
const openLinkedin = (index) => {
	console.log(document.querySelector(`.linkedinLink.l${index}`).innerHTML)
	window.open(`${document.querySelector(`.linkedinLink.l${index}`).innerHTML}`)
}
const sliderChange = (sliderValue, candidateIndex, domainIndex) => {
	document.querySelector(
		`.slider-value.c${candidateIndex}.d${domainIndex}`
	).innerHTML = sliderValue
}
const changeShortlist = (candidateIndex, domainIndex) => {
	if (
		!confirm("Do you want to change the shortlisted state of the candidate?")
	) {
		return
	}
	const cID = document.querySelector(
		`.candidate-id.c${candidateIndex}`
	).innerHTML
	const dID = document.querySelector(
		`.domain-id.c${candidateIndex}.d${domainIndex}`
	).innerHTML
	var state = document.querySelector(
		`.content-domain.c${candidateIndex}.cd${domainIndex}`
	).innerHTML
	console.log(cID, dID, state)
	const data = {}
	if (state === "true") {
		data.shortlisted = false
	} else {
		data.shortlisted = true
	}
	const url = `${window.location.origin}/api/candidate/shortlist/${cID}/${dID}`
	fetch(url, {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
	})
		.then((resp) => resp.json())
		.then((back) => {
			if (back.status) {
				document.querySelector(
					`.content-domain.c${candidateIndex}.cd${domainIndex}`
				).innerHTML = String(data.shortlisted)
			} else {
				if (back.code === 102) {
					alert("Error...Try Again!!")
				}
			}
		})
}
const changeFinal = (candidateIndex, domainIndex) => {
	var shortlistedState = document.querySelector(
		`.content-domain.c${candidateIndex}.cd${domainIndex}`
	).innerHTML
	console.log(shortlistedState)
	if (shortlistedState === "false") {
		alert("The candidate is not shortlisted yet")
		return
	}
	if (!confirm("Do you want to change the final state of the candidate?")) {
		return
	}
	const cID = document.querySelector(
		`.candidate-id.c${candidateIndex}`
	).innerHTML
	const dID = document.querySelector(
		`.domain-id.c${candidateIndex}.d${domainIndex}`
	).innerHTML
	var state = document.querySelector(
		`.content-domain.c${candidateIndex}.cdf${domainIndex}`
	).innerHTML
	console.log(cID, dID, state)
	const data = {}
	if (state === "true") {
		data.final = false
	} else {
		data.final = true
	}
	const url = `${window.location.origin}/api/candidate/final/${cID}/${dID}`
	fetch(url, {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
	})
		.then((resp) => resp.json())
		.then((back) => {
			if (back.status) {
				document.querySelector(
					`.content-domain.c${candidateIndex}.cdf${domainIndex}`
				).innerHTML = String(data.final)
			} else {
				if (back.code === 102) {
					alert("Error...Try Again!!")
				}
			}
		})
}
const changeRating = (candidateIndex, domainIndex) => {
	const cID = document.querySelector(
		`.candidate-id.c${candidateIndex}`
	).innerHTML
	const dID = document.querySelector(
		`.domain-id.c${candidateIndex}.d${domainIndex}`
	).innerHTML
	const data = {
		rating: document.querySelector(
			`.slider-domain.c${candidateIndex}.d${domainIndex}`
		).value,
	}
	const url = `${window.location.origin}/api/candidate/rating/${cID}/${dID}`
	fetch(url, {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
	})
		.then((resp) => resp.json())
		.then((back) => {
			if (back.status) {
				document.querySelector(
					`.slider-domain.c${candidateIndex}.d${domainIndex}`
				).disabled = true
				alert(`You have rated the candidate ${data.rating}`)
			} else {
				if (back.code === 102) {
					alert("Error...Try Again!!")
				}
			}
		})
}
const search = () => {
	const data = {
		name: document.querySelector(".input.name").value.trim(),
		roll: document.querySelector(".input.roll").value.trim(),
		domain: document.querySelector(".input.domain").value.trim(),
		year: document.querySelector(".input.year").value.trim(),
	}
	var url = `${window.location.origin}/api/candidate?`
	for (item in data) {
		if (data[item] !== "") {
			url += `${item}=${data[item]}&`
		}
	}
	fetch(url)
		.then((resp) => resp.json())
		.then((back) => {
			if (back.status) {
				document.querySelector(".candidates").innerHTML = ""
				if (back.data.length === 0) {
					document.querySelector(".candidates").innerHTML =
						"No candidates found"
				}
				back.data.map((candidate, index) => {
					if (candidate.github === undefined) {
						candidate.github = "No Profile Attached"
					}
					if (candidate.linkedin === undefined) {
						candidate.linkedin = "No Profile Attached"
					}
					document.querySelector(".candidates").insertAdjacentHTML(
						"beforeend",
						`<div class="candidate c${index}">
							<span hidden class="candidate-id c${index}">${candidate._id}</span>
							<div class="details cexp">
								<div class="field name-field">
									<div class="title">Name</div>
									<div class="content">${candidate.name}</div>
								</div>
								<div class="field roll-field">
									<div class="title">Roll</div>
									<div class="content">${candidate.roll}</div>
								</div>
								<div class="field year-field">
									<div class="title">Year</div>
									<div class="content">${candidate.year}</div>
								</div>
							</div>
							<div class="field resume-field">
								<div class="title">Resume</div>
								<div class="content link" onclick="openResume(${index})">
									${candidate.resume}
								</div>
								<span class="resumeLink l${index}" hidden>${candidate.resume}</span>
							</div>
							<div class="field github-field">
								<div class="title">Github</div>
								<div class="content link"  onclick="openGithub(${index})">
									${candidate.github}
								</div>
								<span class="githubLink l${index}" hidden>${candidate.github}</span>
							</div>
							<div class="field linkedin-field">
								<div class="title">LinkedIn</div>
								<div class="content link"  onclick="openLinkedin(${index})">
									${candidate.linkedin}
								</div>
								<span class="linkedinLink l${index}" hidden>${candidate.linkedin}</span>
							</div>
							<div class="field domain-field">
								<div class="title">Domain</div>
								<div class="content">${candidate.domain}</div>
							</div>
							<div class="field exp ques1-field">
								<div class="title">
									What makes you a good candidate for this role ?
								</div>
								<div class="content">
									${candidate.good_candidate}
								</div>
							</div>
							<div class="field exp ques2-field">
								<div class="title">Why do you want to join E Labs ?</div>
								<div class="contentt">
									${candidate.join_elabs}
								</div>
							</div>
							<div class="field exp status-field">
								<div class="title">STATUS</div>
								<div class="content c${index}"></div>
							</div>
							</div>`
					)
					candidate.status.map((eachDomain, domainIndex) => {
						document.querySelector(`.content.c${index}`).insertAdjacentHTML(
							"beforeend",
							`<div class="eachDomain c${index} d${domainIndex}">
								<span class="domain-id c${index} d${domainIndex}" hidden>${
								eachDomain._id
							}</span>
								<div class="title-domain heading">${domainIndex + 1}. ${eachDomain.domain}</div>
								<div class="field-domain dexp">
									<div class="title-domain">Rating</div>
									<div class="content-domain c${index} s${domainIndex}">
										<input type="range" min="0" max="10" value="${
											eachDomain.rating
										}" class="slider-domain c${index} d${domainIndex}" oninput="sliderChange(this.value, ${index},${domainIndex})">
										<span class="slider-value c${index} d${domainIndex}">${eachDomain.rating}</span>
									</div>
									<div class="button-wrapper-domain">
										<div class="button-domain" onclick="changeRating(${index}, ${domainIndex})">Rate the candidate</div>
									</div>
								</div>
								<div class="field-domain">
									<div class="title-domain">Shortlisted</div>
									<div class="content-domain c${index} cd${domainIndex}">${
								eachDomain.shortlisted
							}</div>
									<div class="button-wrapper-domain">
										<div class="button-domain" onclick="changeShortlist(${index}, ${domainIndex})">Change</div>
									</div>
								</div>
								<div class="field-domain">
									<div class="title-domain">Final</div>
									<div class="content-domain c${index} cdf${domainIndex}">${
								eachDomain.final
							}</div>
									<div class="button-wrapper-domain">
										<div class="button-domain" onclick="changeFinal(${index}, ${domainIndex})">Change</div>
									</div>
								</div>
							</div>`
						)
					})
				})
			}
		})
}
