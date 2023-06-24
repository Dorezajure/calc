// DATA
const budget = []; 

// DOM
const form = document.querySelector("#form");
const type = document.querySelector("#type");
const title = document.querySelector("#title");
const value = document.querySelector("#value");
const incomesList = document.querySelector("#incomes-list");
const expensesList = document.querySelector("#expenses-list");

const budgetEl = document.querySelector('#budget');
const totalIncomeEl = document.querySelector("#total-income");
const totalExpenseEl = document.querySelector("#total-expense");
const percentsWrapper = document.querySelector("#expense-percents-wrapper");

const monthEl = document.querySelector("#month");
const yearEl = document.querySelector("#year");

// Functions
    // Преобразование чисел в шапке веб-приложения
    const priceFormatter = new Intl.NumberFormat('ru-RU', {
        style: 'currency', 
        currency: 'RUB', 
        maximumFractionDigits: 0
    })

    function insertTestData () {
        const testData = [
            {type: 'inc', title: "Фриланс", value: 500},
            {type: 'inc', title: "Зарплата", value: 100000},
            {type: 'inc', title: "Бизнес", value: 200000},
            {type: 'inc', title: "Рента", value: 50000},
            {type: 'exp', title: "Продукты", value: 20000},
            {type: 'exp', title: "Кафе", value: 10000},
            {type: 'exp', title: "Транспорт", value: 4000},
            {type: 'exp', title: "Квартира", value: 100000},
        ];

        // Получаем рандомный индекс элемента массива от 0 до 7
        function getRandomInt (max) {
            return Math.floor(Math.random() * max);
        }
        const randomIndex = getRandomInt(testData.length);
        const randomData = testData[randomIndex];

        type.value = randomData.type;
        title.value = randomData.title;
        value.value = randomData.value;
    }

    function clearForm () {
        form.reset()
    }

    function calcBudget(records) {
        // Подсчет общий доход
        const totalIncome = budget.reduce(function(total, element) {
            if(element.type === 'inc') {
                return total + element.value;
            } else {
                return total;
            }
        }, 0)

        // Считаем общий расход 
        const totalExpense = budget.reduce(function(total, element) {
            if(element.type === 'exp') {
                return total + element.value;
            } else {
                return total;
            }
        }, 0);

        const totalBudget = totalIncome - totalExpense;
        let expensePercents = 0;
        // Проверка на то чтобы totalIncome не был равен 0 для подсчета процента
        if(totalIncome > 0) { 
            expensePercents = Math.round((totalExpense * 100) / totalIncome);
        }

        budgetEl.innerHTML = priceFormatter.format(totalBudget);
        totalIncomeEl.innerHTML = '+ ' + priceFormatter.format(totalIncome);
        totalExpenseEl.innerHTML = '- ' + priceFormatter.format(totalExpense);

        if(expensePercents > 0) {
            const html = `<div class="badge">${expensePercents}%</div>`;
            percentsWrapper.innerHTML = html;
        } else {
            percentsWrapper.innerHTML = '';
        }
    }

    function displayMounth() {
        const now = new Date();

        const year = now.getFullYear(); // 2023

        const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
            month: 'long'
        });
        const month = timeFormatter.format(now);

        monthEl.innerHTML = month;
        yearEl.innerHTML = year;
    }

    displayMounth();
    insertTestData();
    calcBudget();

// Добавление новой записи
form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Проверка полей на заполненность (МЕТОД TRIM() обрезает пустую строку)
    if(title.value.trim() === '') {
        title.classList.add("form__input--error");
    } else {
        title.classList.remove("form__input--error");
    }

    if(value.value.trim() === '' || +value.value <= 0) {
        value.classList.add("form__input--error");
        return;
    } else {
        value.classList.remove("form__input--error");
    }

    // Расчет id
    let id = 1;
    if (budget.length > 0) {
        // Последний элемент в массиве 
        const lastElement = budget[budget.length - 1];
        // ID последнего элемента
        const lastElID = lastElement.id;
        // Сформировать новый id = старый id + 1
        id = lastElID + 1;
    }

    // Формируем запись 
    const record = {
        id: id,
        type: type.value.trim(), 
        title: title.value, 
        value: +value.value,
    };

    // Добавление в пустой массив новых шаблонны объектов по тратам и прибыли
    budget.push(record);

    // Отображаем Доход на странице
    if(record.type === 'inc') {
        const html = `<li data-id="${record.id}" class="budget-list__item item">
                        <div class="item__title">${record.title}</div>
                        <div class="item__right">
                            <div class="item__amount">
                                +${priceFormatter.format(record.value)}
                            </div>
                            <button class="item__remove">
                                <img src="./img/circle-red.svg" alt="delete" />
                            </button>
                        </div>
                    </li>`
        // Дрбавление кусочка html кода на страницу, в виде готового шаблона
        incomesList.insertAdjacentHTML('afterbegin', html);
    }

    // Отображаем расход на странице 
    if(record.type === 'exp') {
        const html = `<li data-id="${record.id}" class="budget-list__item item item--expense">
                        <div class="item__title">${record.title}</div>
                        <div class="item__right">
                            <div class="item__amount">
                                -${priceFormatter.format(record.value)}
                            </div>
                            <button class="item__remove">
                                <img src="./img/circle-red.svg" alt="delete" />
                            </button>
                        </div>
                    </li>`
        // Дрбавление кусочка html кода на страницу, в виде готового шаблона
        expensesList.insertAdjacentHTML("afterbegin", html);
    }
    // Пересчитать бюджет
    calcBudget();
    // Очистить форму
    clearForm(); 
    insertTestData();
})

// Удаление по нажатию на кнопку 
document.body.addEventListener('click', function(e){
    // Поиск по наличию родителя с соответсвующими селектором
    if(e.target.closest('button.item__remove')) {
        const recordElement = e.target.closest("li.budget-list__item");
        // dataset возвращает значение data (забрали id)
        const id = recordElement.dataset.id;
        // Нашли id и записали в переменную 
        const index = budget.findIndex(function(element) {
            if(id === element.id) {
                return true;
            }
        })
        // Удаление по индексу из массива
        budget.splice(index, 1);
        // Удаление со страницы на основе родительского элемента
        recordElement.remove();
    }
})
