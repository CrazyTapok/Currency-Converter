let cache = {}
let currency_1 =  document.querySelector('#currFirstName')
let currency_2 =  document.querySelector('#currSecondName')
let firstValue = document.querySelector('#currFirstValue')
let date = document.querySelector('#date')
let answer = document.querySelector('#currSecondValue')

setDate()

const currencies = [
    {
        currency: 'byn',
        label: 'Белорусский рубль'
    },
    {
        currency: 'usd',
        label: 'Доллар США'
    },
    {
        currency: 'eur',
        label: 'Евро'
    },
    {
        currency: '',
        label: 'Евро'
    },
    {
        currency: 'pln',
        label: 'Польский злотый'
    },
    {
        currency: 'rub',
        label: 'Российский рубль'
    },
    {
        currency: 'kzt',
        label: 'Казахстанский Тенге'
    }
]


function getListCurrency() {
    let result = []

    currencies.forEach(element => {
        if (element.currency.length === 3 && (/^[a-z]*$/i.test(element.currency))) {
            if (element.label.trim() !== "" && (/^[а-я\s]*$/i.test(element.label))) {
                let option = document.createElement('option')
                option.value = element.currency
                option.innerHTML = element.label
                       
                result.push(option)

            }
        }
    });

    return result
}
currency_1.append(...getListCurrency())
currency_2.append(...getListCurrency())


function setDate() {
    var getCurrentDay = new Date();
    var year = getCurrentDay.getFullYear();
    var month = getCurrentDay.getMonth() + 1;
    var day = getCurrentDay.getDate();
    var value1 = year + "-" + checkMonthDay(month) + "-" + checkMonthDay(day);
        
    date.value = value1;
    date.max = value1;
}

function checkMonthDay(item) {
    return item >= 10 ? item : "0" + item
}
    

document.querySelector('.btn').addEventListener('click', event => {
    try {
        if (currency_1.value !== currency_2.value && Number.isInteger(parseInt(firstValue.value))) {
              
            request(currency_1.value, currency_2.value, date.value)

        }else{
            throw new Error('The date was not correct. Make sure you entered the date correctly and try again.')
        }
    } catch (error) {
        alert(`Whoops! Error: ${error.message}`)
    }
})


function request(cur1, cur2, date) {

    if (cache[date] === undefined) {
        cache[date] = {}
                            
        if (cur1 !== currencies[0].currency && cur2 !== currencies[0].currency) {
            cache[date][cur1] = {}
            cache[date][cur2] = {}
            doubleRequest(cur1, cur2, date)

        } else if (cur1 !== currencies[0].currency) {
            cache[date][cur1] = {}
            singleRequest(cur1, date, cur2)

        } else {
            cache[date][cur2] = {}
            singleRequest(cur2, date, cur1, true)

        }
    } else {

        if (cache[date][cur1] === undefined && cache[date][cur2] === undefined && (cur1 !== currencies[0].currency && cur2 !== currencies[0].currency)) {
            cache[date][cur1] = {}
            cache[date][cur2] = {}
            doubleRequest(cur1, cur2, date)

        }
        else if (cache[date][cur1] === undefined && cur1 !== currencies[0].currency) {
            cache[date][cur1] = {}
            singleRequest(cur1, date, cur2)

        } else if (cache[date][cur2] === undefined && cur2 !== currencies[0].currency) {
            cache[date][cur2] = {}
            singleRequest(cur2, date, cur1, true)
            
        } else{
            calculate(cur1, cur2, date)
    
        }
    }
}


function doubleRequest(item1, item2, date) {
    fetch(`https://www.nbrb.by/api/exrates/rates/${item1}?parammode=2&ondate=${date}`)
    .then(response => response.json())
    .then(result =>{
        cache[date][item1][item1] = result.Cur_OfficialRate
        cache[date][item1]['scale'] = result.Cur_Scale
    })
    .then(() => 
        fetch(`https://www.nbrb.by/api/exrates/rates/${item2}?parammode=2&ondate=${date}`)
        .then(result => result.json())
        .then(result =>{
            cache[date][item2][item2] = result.Cur_OfficialRate
            cache[date][item2]['scale'] = result.Cur_Scale
        })
    ).then(() =>{
        calculate(item1, item2, date)
    })
    .catch(error => alert(`Program crash: ${error.message}`))
}


function singleRequest(item1, date, item2, revers) {
    fetch(`https://www.nbrb.by/api/exrates/rates/${item1}?parammode=2&ondate=${date}`)
    .then(response => response.json())
    .then(result =>{
        cache[date][item1][item1] = result.Cur_OfficialRate
        cache[date][item1]['scale'] = result.Cur_Scale
    }).then(() => {
        if (revers) {
            calculate(item2, item1, date)
        } else {
            calculate(item1, item2, date)
        }
    })
    .catch(error => alert(`Program crash: ${error.message}`))
}


function calculate(cur1, cur2, date) {
    if (cur1 !== currencies[0].currency && cur2 !== currencies[0].currency) {

        answer.value = ((firstValue.value * cache[date][cur1][cur1]) / cache[date][cur2][cur2] * (cache[date][cur2]['scale'] / cache[date][cur1]['scale'])).toFixed(4)
        
    } else if (cur1 !== currencies[0].currency) {

        answer.value = (firstValue.value * cache[date][cur1][cur1] / cache[date][cur1]['scale']).toFixed(4)
       
    } else{

        answer.value = (firstValue.value / cache[date][cur2][cur2] * cache[date][cur2]['scale']).toFixed(4)
    }
}