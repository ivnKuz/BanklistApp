const currencies = new Map([
    ['USD', 'United states dollarino'],
    ['EUR', 'Euro'],
    ['GBP', 'Great Britain Pound']
])

//MAP
currencies.forEach(function(value, key, map){
    console.log(`${key}: ${value}`);
})

//Set
const uniqueCurrencies = new Set(['USD','USD','GBP','EUR','EUR']);

uniqueCurrencies.forEach(function(value, key, set){
    console.log(`${key}: ${value}`);
})