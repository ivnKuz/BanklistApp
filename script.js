'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  //emptying the container before filling it
  containerMovements.innerHTML = '';
  //slice to copy, not modify og array, if true then it will sort movements in the descending order
  const movs = sort ? movements.slice().sort((curr,next) => curr-next) : movements;
  movs.forEach(function (mov, i) {
    //if its more than 0 then add deposit class, if not then its a withdrawal
    const type = mov > 0 ? 'deposit' : 'withdrawal'
    //creating html to create a row for withdrawal or deposit in movements
    const html = `
    <div class="movements__row">
    <div class="movements__type 
    movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}</div>
    </div>
  `
    //afterbegin places the HTML in this way: <div> 'afterbegin' foo 'beforeend' </div> like that. See MDN docs for more details
    containerMovements.insertAdjacentHTML('afterbegin', html)
  });
}
// displayMovements(account1.movements)

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner //creating a new property in account object named username
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join(''); // map() returns new array, then we join it into one string
  })
}

const calcDisplayBalance = function (account) {
  //creating a new property for an object - balance and displaying it right away
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance} €`;

}
// calcDisplayBalance(account1.movements)

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} €`

  const outs = account.movements.filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outs)} €`

  const interest = account.movements.filter(mov => mov > 0)
    .map(deposit => deposit * account.interestRate / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} €`

}

const updateUI = function (acc) {
  //display movements
  displayMovements(acc.movements);
  //display balance
  calcDisplayBalance(acc)
  //display summary
  calcDisplaySummary(acc)
  //empty input fields
}

let currentAccount;
//event handler login button
btnLogin.addEventListener('click', function (e) {
  e.preventDefault()
  // .find can find a whole daym object
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) { //input.value is always a string
    //Display UI and a welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur()

    updateUI(currentAccount)

    console.log('LOgged in');
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault()
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    //delete account
    accounts.splice(index, 1)

    //hide ui
    containerApp.style.opacity = 0

  }
  inputCloseUsername.value = inputClosePin.value = '';

})

let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})


btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

// loan can only be granted if there's a deposit of 10% or more of the loan
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    //add movement
    currentAccount.movements.push(amount);

    //update ui
    updateUI(currentAccount)
  }
  inputLoanAmount.value = '';
})

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  console.log(amount, recieverAcc);

  inputTransferAmount.value = inputTransferTo.value = ''
  if (amount > 0 &&
    recieverAcc && currentAccount.balance >= amount
    && recieverAcc?.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    updateUI(currentAccount)
  }
})

// calcDisplaySummary(account1.movements);

createUsernames(accounts); //turn to stw, first letters
console.log(accounts)

/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const deposit = movements.filter(function (mov) {
  return mov > 0;
});

const withdrawals = movements.filter(mov => mov < 0);

//accumulator --> snowball
const balance = movements.reduce(function (accum, curr, i, arr) {
  console.log(`iteration ${i}: ${accum}`)
  return accum + curr
}, 0)

console.log(movements);
console.log(deposit)
console.log(withdrawals)
console.log(balance)

//maximum value

const max = movements.reduce((accumulator, current) => accumulator > current ? accumulator : current, movements[0])


console.log(max)

const eurToUSD = 1.1;
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUSD)
  .reduce((acc, mov) => acc + mov, 0);



console.log(totalDepositsUSD)
//check by condition, returns true or false
// SOME condition
// console.log(movements.some(mov =>  mov === -130));

// const anyDEposits = movements.some(mov => mov > 0)
// console.log(anyDEposits);

// //every only returns true if every element in the array satisfy the condition
// console.log(account4.movements.every(mov => mov > 0));

// //separate callback
// const depostt = mov => mov > 0;
// console.log(movements.some(depostt));
// console.log(movements.every(depostt));
// console.log(movements.filter(depostt));

//flat & flatMap
// const arr = [[1,2,3],[4,5,6], 7,8]
// //makes that array not nested ^
// console.log(arr.flat());

// const arrDeep = [[[1,2],3],[4,[5,6]], 7,8]
// //can pass an argument of how many levels deep we want to go, so 2 will be the same as calling flat two times
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements)
// console.log(accountMovements);
// const allMovements = accountMovements.flat()
// console.log(allMovements);

// const overallBalance = allMovements.reduce((acc,mov)=> acc + mov, 0);
// console.log(overallBalance);

//chained
// const overallBalance = accounts.map(acc => acc.movements)
// .flat()
// .reduce((acc,mov)=> acc + mov, 0);
// console.log(overallBalance);

// //flatMap
// //flatMap can only go 1 level deep, if you need go in more levels use flat()
// const overallBalance2 = accounts
// .flatMap(acc => acc.movements)
// .reduce((acc,mov)=> acc + mov, 0);
// console.log(overallBalance2);

// //string
// const owners = ['Jonas','Zack','Adam', 'Martha']
// console.log(owners.sort());
// //array is now mutated, not copied
// console.log(owners);

// //numbers
// //sort() only works with strings, so if we pass numbers it converts it to strings and sorts it that way, so its not really sorting
// //them correctly
// console.log(movements);
// console.log(movements.sort());
// //a is the current value, b is the next value in the array
// //return < 0, A before B
// //return > 0 B before A
// movements.sort((a,b)=>{
// if(a > b)  return 1; 
// if(b > a)  return -1;
// })
// //same but improved
// movements.sort((a,b)=> a - b)
// console.log(movements);


