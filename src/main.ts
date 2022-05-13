import { Account, Entry, categoryEnum } from "./Account.js";
declare var Swal: any;

let account: Account;
const initalAcoount = getAccountFromStorage();

if (initalAcoount){
    account = new Account(initalAcoount as Account);
    updateBalanceAccount(account);
    
}else{
    account = crarCompteInical();
    updateBalanceAccount(account);
}

function crarCompteInical(): Account{
    const setupAccount = new Account();
    
    const expenseEx = new Entry("Ex gasto", 10, categoryEnum.expense);
    const incomeEx = new Entry("Ex ingresos", 10, categoryEnum.income);
    

    setupAccount.addEntry(expenseEx);
    setupAccount.addEntry(incomeEx);

    return setupAccount;
}

function getAccountFromStorage(): Account | boolean{
    const accountFromStorage = localStorage.getItem('compte');
    return accountFromStorage ? JSON.parse(accountFromStorage) : false;
}

function setAccountToStorage(account: Account): void{
    localStorage.setItem("compte",JSON.stringify(account));
}

function updateBalanceAccount(account: Account){
    const balanceAmountHtmlElement = document.querySelector("#balanceAmount") as HTMLElement;
    const balanceAccount = account.getBalance();
    balanceAmountHtmlElement.textContent = `${balanceAccount}€`;
}


const entryTemplate = document.querySelector("#entryTemplate") as HTMLTemplateElement;
const fragment = document.createDocumentFragment();
const recordsContainer = document.querySelector("#recordsContainer") as HTMLElement;

recordsContainer.onclick = function (event){
    if(event.target instanceof SVGElement && event.target.dataset.id){
        const elementId = event.target.dataset.id;
        const entryElement = document.querySelector(`[data-id="${elementId}"]`);
        deleteElement(elementId as string, entryElement as HTMLElement);
    }
};


const entries = account.getEntries();
entries.forEach((entry) => {
    printEntry(entry);
});

function printEntry(entry: Entry){
    const {concept, amount, category, id} = entry;
    const entryConeptTemplate = entryTemplate.content.querySelector('.entryConcept');
    const entryAmountTemplate = entryTemplate.content.querySelector('.entryAmount');
    const entryContainerTemplate = entryTemplate.content.querySelector('div');
 
    const iconSVG = entryTemplate.content.querySelector('svg');
    const svgPath = entryTemplate.content.querySelector('path');

    if (!entryAmountTemplate || !entryConeptTemplate || !entryContainerTemplate || !iconSVG || !svgPath){
        return;
    }

    entryConeptTemplate.textContent = concept;
    entryContainerTemplate.setAttribute('data-id', String(id));
    iconSVG.setAttribute('data-id', String(id));
    svgPath.setAttribute('data-id', String(id));

    if (category === categoryEnum.expense){
        entryAmountTemplate.classList.add('text-indigo-500');
        entryAmountTemplate.classList.remove('text-blue-500');
        entryAmountTemplate.textContent = `-${amount} €`;
    }else{
        entryAmountTemplate.classList.add('text-blue-500');
        entryAmountTemplate.classList.remove('text-indigo-500');
        entryAmountTemplate.textContent = `${amount} €`;
    }

    const clone = entryTemplate.content.cloneNode(true);
    fragment.appendChild(clone);
    recordsContainer.appendChild(fragment);

}

function deleteElement(id: string, entryElement: HTMLElement){
    const entryConcept = entryElement.querySelector('.entryConcept')?.textContent;
    const entryAmount = entryElement.querySelector('.entryAmount')?.textContent;

    Swal.fire({
        title: "Vols eliminar aquesta entrada?",
        text: `Concepte: ${entryConcept} 
               \nQuantitat: ${entryAmount}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#63b5f7",
        cancelButtonColor: "#7240ff",
        confirmButtonText: "Si, eliminar entrada. "
    }).then((resultat:any) => {
        if(resultat.isConfirmed){
            account.deleteEntryById(Number(id));
            updateBalanceAccount(account);
            setAccountToStorage(account);
            entryElement.remove();
            
           
            Swal.fire('Eliminat!!',"L'entrada ha sigut eliminada", 'success');
        }
    });
}

const entryConceptInput = document.querySelector("#entryName") as HTMLInputElement;
const entryAmountInput = document.querySelector("#entryAmount") as HTMLInputElement;

const addIcomeButton = document.querySelector("#addIncomeButton") as HTMLButtonElement;
const addExpenseButton = document.querySelector("#addExpenseButton") as HTMLButtonElement;


addIcomeButton.addEventListener('click', addEnteryTemplate.bind(this, categoryEnum.income));
addExpenseButton.addEventListener('click', addEnteryTemplate.bind(this, categoryEnum.expense));


function addEnteryTemplate(category: categoryEnum){
     const conceptValue = entryConceptInput.value;
     const amountValue = entryAmountInput.value;

     if (conceptValue && amountValue){
         const entryFromValues = new Entry(conceptValue, Number(amountValue), category);
         account.addEntry(entryFromValues);
         setAccountToStorage(account);
         printEntry(entryFromValues);
         updateBalanceAccount(account);
     }
}

