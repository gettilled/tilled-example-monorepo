const productCodeDropdown = document.getElementById("product-code_dropdown");
const createAccountForm = document.getElementById("create-account-form");
const onboardingForm = document.getElementById("onboarding-form");
const createAccountBtn = document.getElementById(
	"create-account_submit-button"
);
const onboardingtBtn = document.getElementById("onboarding_submit-button");
const sectionTabs = document.querySelectorAll(".section-tab");
const dropdownCarets = document.querySelectorAll(".dropdown-caret_btn");
const principalsContainer = document.getElementById("principals-container");
const addPrincipalBtn = document.getElementById("add-principal_btn");
const removePrincipalBtn = document.getElementById("remove-principal_btn");
const principal1Element = document.getElementById("principal1-container");

let newAccountId;
let principalCount = 1;

const mapInputsToObj = (inputNodeList) => {
	let inputMap = new Map();

	// Map name and values
	inputNodeList.forEach((input) => {
		// remove count from from radio inputs
		if (input.name.slice(-1).match(/[D]/)) input.name = input.name.slice(0, -1);

		inputMap.set(input.name, input.value);
	});

	// Convert map to JSON
	const inputObj = Object.fromEntries(inputMap);

	return inputObj;
};

async function insertProductCodes() {
	const response = await fetch("/product-codes", {
		headers: { "Content-Type": "application/json" },
		method: "GET",
	});
	let data = await response.json();

	data.items.forEach((item) => {
		const element = document.createElement("option");
		element.value = item.id;
		element.innerText = item.description;

		productCodeDropdown.appendChild(element);
	});
}
insertProductCodes();

async function createAccount() {
	const inputs = document.querySelectorAll("#create-account-form input");

	let response = await fetch("/accounts/connected", {
		headers: { "Content-Type": "application/json" },
		method: "POST",
		body: JSON.stringify(mapInputsToObj(inputs)),
	});
	let data = await response.json();

	// asign newly created account id to global variable and display respose data in the console
	newAccountId = data.id;
	console.log(data);

	// Display new account ID
	window.alert("New connected account ID: " + newAccountId);

	// update UI
	createAccountForm.classList.add("hidden");
	onboardingForm.classList.remove("hidden");
}

function toggleCollapse(e) {
	const collapsableSections = document.querySelectorAll(".collapsable-section");
	const thisSection = e.target.parentNode.parentNode.querySelector(
		".collapsable-section"
	);

	// Update
	dropdownCarets.forEach((button) => {
		button.classList.remove("fa-angle-down");
		button.classList.add("fa-angle-left");
	});
	e.target.classList.remove("fa-angle-left");
	e.target.classList.add("fa-angle-down");
	collapsableSections.forEach((section) => section.classList.add("hidden"));
	thisSection.classList.remove("hidden");
}

// Refactor with event delegation
// function toggleCollapse(e) {
// 	const collapsableSections = document.querySelectorAll(".collapsable-section");
// 	const thisSection = e.target.nextSibling;
// 	console.log(e.target, thisSection);
// 	collapsableSections.forEach((section) => {
// 		section.classList.add("hidden");
// 	});

// 	thisSection.querySelector("dropdown-caret_btn").classList.toggle("fa-angle-left");
// 	thisSection.querySelector("dropdown-caret_btn").classList.toggle("fa-angle-down");
// 	// collapsableSections.forEach((section) => section.classList.add("hidden"));
// 	thisSection.classList.toggle("hidden");
// }

// sectionTabs.forEach((tab) => {
// 	tab.addEventListener("click", (e) => {
// 		toggleCollapse(e);
// 	});
// });

async function updateOrSubmitMerchantApplication() {
	const businessEntityFields = document.querySelectorAll(
		".business-legal-entity_field"
	);
	const principalsArr = [];
	const principals = document.querySelectorAll(".principal-container");
	const termsCheckbox = document.getElementById("terms_checkbox");
	const reqBody = {
		business_legal_entity: mapInputsToObj(businessEntityFields),
		accept_terms_and_conditions: termsCheckbox.checked,
	};
	reqBody.business_legal_entity.address = mapInputsToObj(
		document.querySelectorAll(".address-field")
	);

	// remove special characters from phone
	reqBody.business_legal_entity.phone =
		reqBody.business_legal_entity.phone.replace(/\D/g, "");

	// convert input string to int
	reqBody.business_legal_entity.average_transaction_amount = parseInt(
		reqBody.business_legal_entity.average_transaction_amount
	);

	// convert principals to array if query only finds one principal
	if (principals.lenth === 1) principals = [principals];

	principals.forEach((principal) => {
		const principalObj = mapInputsToObj(
			document.querySelectorAll(`.principal1-field`)
		);
		principalObj.address = mapInputsToObj(
			document.querySelectorAll(`.principal1-address-field`)
		);
		principalObj.phone = principalObj.phone.replace(/\D/g, "");
		principalObj.percentage_shareholding = parseInt(
			principalObj.percentage_shareholding
		);
		
		principalObj.is_applicant =
			document.querySelector(`#principal${principalsArr.length + 1}_applicant_radio`).checked === true 
		principalObj.is_control_prong =
			document.querySelector(`#principal${principalsArr.length + 1}_control-prong_radio`).checked === true
		
		principalsArr.push(principalObj);
		reqBody.business_legal_entity.principals = principalsArr;
	});

	let response = await fetch(`/accounts`, {
		headers: { "Content-Type": "application/json" },
		method: "POST",
		body: JSON.stringify(reqBody),
	});
	let data = await response.json();
	if (data.validation_errors.length > 0) {
		window.alert(
			"Your application contains errors. Please check the console for a complete list of errors and make the appropriate changes before resubmission."
		);
		console.log(data.validation_errors);
		console.log(data);
	} else {
		window.alert("Merchant application submitted successfully!");
		console.log(data);
	}
}

// Event listeners

createAccountBtn.addEventListener("click", (e) => {
	e.preventDefault();
	createAccountBtn.disabled = true;

	createAccount();
});

dropdownCarets.forEach((button) => {
	button.addEventListener("click", (e) => {
		toggleCollapse(e);
	});
});

onboardingtBtn.addEventListener("click", async (e) => {
	e.preventDefault();
	createAccountBtn.disabled = true;

	updateOrSubmitMerchantApplication();
});

addPrincipalBtn.addEventListener("click", (e) => {
	e.preventDefault();
	principalCount++;

	const newPrincipal = principal1Element.cloneNode(true);

	newPrincipal.classList.add("principal-container");
	newPrincipal.id = `principal${principalCount}-container`;

	const fields = newPrincipal.querySelectorAll(`.principal1-field`);
	const addressFields = newPrincipal.querySelectorAll(
		`.principal1-address-field`
	);
	const radios = newPrincipal.querySelectorAll(`.principal1-radio`);

	fields.forEach((field) => {
		field.classList.remove(`principal1-field`);
		field.classList.add(`principal${principalCount}-field`);
		field.value = "";
	});

	addressFields.forEach((field) => {
		field.classList.remove(`principal1-address-field`);
		field.classList.add(`principal${principalCount}-address-field`);
		field.value = "";
	});

	radios.forEach((fieldElement) => {
		const applicant = fieldElement.querySelector("#principal1_applicant_radio");
		const prong = fieldElement.querySelector("#principal1_control-prong_radio");
		fieldElement.classList.remove(`principal${principalCount}-radio`);
		fieldElement.classList.add(`principal${principalCount}-radio`);

		if (applicant) applicant.id = `principal${principalCount}_applicant_radio`;
		if (prong) prong.id = `principal${principalCount}_control-prong_radio`;

		fieldElement.querySelectorAll("input").forEach((input) => {
			input.name === "is_applicant1"
				? (input.name = `is_applicant${principalCount}`)
				: (input.name = `is_control_prong${principalCount}`);
			input.removeAttribute("checked");
			if (input.value === "false") input.checked = true
		});
	});

	principalsContainer.appendChild(newPrincipal);
});

removePrincipalBtn.addEventListener("click", (e) => {
	e.preventDefault();

	// only delete last child if there are multiple principals
	if (principalsContainer.children.length > 1) {
		principalCount--;
		principalsContainer.removeChild(principalsContainer.lastChild);
	}
});
