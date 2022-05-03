import { Account, Entry, categoryEnum } from "./Account.js";
var account;
var initalAcoount = getAccountFromStorage();
if (initalAcoount) {
    account = new Account(initalAcoount);
}
else {
    account = crarCompteInical();
    updateBalanceAccount(account);
}
function crarCompteInical() {
    var setupAccount = new Account();
    var expenseEx = new Entry("Ex gasto", 10, categoryEnum.expense);
    var incomeEx = new Entry("Ex ingresos", 10, categoryEnum.income);
    setupAccount.addEntry(expenseEx);
    setupAccount.addEntry(incomeEx);
    return setupAccount;
}
function getAccountFromStorage() {
    var accountFromStorage = localStorage.getItem('compte');
    return accountFromStorage ? JSON.parse(accountFromStorage) : false;
}
function setAccountToStorage(account) {
    localStorage.setItem("compte", JSON.stringify(account));
}
function updateBalanceAccount(account) {
    var balanceAmountHtmlElement = document.querySelector("#balanceAmount");
    var balanceAccount = account.getBalance();
    balanceAmountHtmlElement.textContent = "".concat(balanceAccount, "\u20AC");
}
var entryTemplate = document.querySelector("#entryTemplate");
var fragment = document.createDocumentFragment();
var recordsContainer = document.querySelector("#recordsContainer");
recordsContainer.onclick = function (event) {
    if (event.target instanceof SVGElement && event.target.dataset.id) {
        var elementId = event.target.dataset.id;
        var entryElement = document.querySelector("[data-id=\"".concat(elementId, "\"]"));
        deleteElement(elementId, entryElement);
    }
};
var entries = account.getEntries();
entries.forEach(function (entry) {
    printEntry(entry);
});
function printEntry(entry) {
    var concept = entry.concept, amount = entry.amount, category = entry.category, id = entry.id;
    var entryConeptTemplate = entryTemplate.content.querySelector('.entryConcept');
    var entryAmountTemplate = entryTemplate.content.querySelector('.entryAmount');
    var entryContainerTemplate = entryTemplate.content.querySelector('div');
    var iconSVG = entryTemplate.content.querySelector('svg');
    var svgPath = entryTemplate.content.querySelector('path');
    if (!entryAmountTemplate || !entryConeptTemplate || !entryContainerTemplate || !iconSVG || !svgPath) {
        return;
    }
    entryConeptTemplate.textContent = concept;
    entryContainerTemplate.setAttribute('data-id', String(id));
    iconSVG.setAttribute('data-id', String(id));
    svgPath.setAttribute('data-id', String(id));
    if (category === categoryEnum.expense) {
        entryAmountTemplate.classList.add('text-indigo-500');
        entryAmountTemplate.classList.remove('text-blue-500');
        entryAmountTemplate.textContent = "-".concat(amount, " \u20AC");
    }
    else {
        entryAmountTemplate.classList.add('text-blue-500');
        entryAmountTemplate.classList.remove('text-indigo-500');
        entryAmountTemplate.textContent = "".concat(amount, " \u20AC");
    }
    var clone = entryTemplate.content.cloneNode(true);
    fragment.appendChild(clone);
    recordsContainer.appendChild(fragment);
}
function deleteElement(id, entryElement) {
    var _a, _b;
    var entryConcept = (_a = entryElement.querySelector('.entryConcept')) === null || _a === void 0 ? void 0 : _a.textContent;
    var entryAmount = (_b = entryElement.querySelector('.entryAmount')) === null || _b === void 0 ? void 0 : _b.textContent;
    Swal.fire({
        title: "Vols eliminar aquesta entrada?",
        text: "Concepte: ".concat(entryConcept, " \n               \nQuantitat: ").concat(entryAmount),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#63b5f7",
        cancelButtonColor: "#7240ff",
        confirmButtonText: "Si, eliminar entrada. "
    }).then(function (resultat) {
        if (resultat.isConfirmed) {
            account.deleteEntryById(Number(id));
            setAccountToStorage(account);
            entryElement.remove();
            updateBalanceAccount(account);
            Swal.fire('Eliminat!!', "L'entrada ha sigut eliminada", 'success');
        }
    });
}
var entryConceptInput = document.querySelector("#entryName");
var entryAmountInput = document.querySelector("#entryAmount");
var addIcomeButton = document.querySelector("#addIncomeButton");
var addExpenseButton = document.querySelector("#addExpenseButton");
addIcomeButton.addEventListener('click', addEnteryTemplate.bind(this, categoryEnum.income));
addExpenseButton.addEventListener('click', addEnteryTemplate.bind(this, categoryEnum.expense));
function addEnteryTemplate(category) {
    var conceptValue = entryConceptInput.value;
    var amountValue = entryAmountInput.value;
    if (conceptValue && amountValue) {
        var entryFromValues = new Entry(conceptValue, Number(amountValue), category);
        account.addEntry(entryFromValues);
        setAccountToStorage(account);
        printEntry(entryFromValues);
        updateBalanceAccount(account);
    }
}
