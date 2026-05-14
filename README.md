# CalorieTracker

Застосунок для відстеження харчування та підрахунку калорій. Написаний на чистому JavaScript без залежностей, дані зберігаються у `localStorage`.

## Можливості

- Щоденник харчування з розбивкою по прийомах їжі
- Підрахунок калорій, білків, жирів і вуглеводів
- Прогрес-бари відносно денних норм
- Тижневий графік калорій
- База з 70+ продуктів, можливість додавати власні
- Статистика і середні показники за тиждень
- Експорт щоденника в CSV
- Сповіщення при досягненні денної норми

## Запуск

```bash
git clone https://github.com/YOUR_USERNAME/calorie-tracker.git
cd calorie-tracker
npx serve .
```

Відкрити `http://localhost:3000`.

> Проєкт використовує ES Modules, тому потрібен HTTP-сервер. Відкриття `index.html` через `file://` не працює.

## Структура проєкту

```
calorie-tracker/
├── index.html
├── assets/css/style.css
└── src/
    ├── app.js                   # Точка входу, збірка залежностей
    ├── data/defaultFoods.js     # База продуктів
    ├── models/                  # Food, DiaryEntry, UserSettings
    ├── repositories/            # Робота з localStorage
    ├── services/                # Бізнес-логіка
    ├── controllers/             # Зв'язок між сервісами і UI
    ├── views/                   # Рендеринг і взаємодія з DOM
    ├── patterns/                # EventEmitter
    └── utils/                   # DOM, DateUtils, Validator, FormatUtils
```

---

## Programming Principles

**SRP — Single Responsibility**
Кожен клас відповідає за одну річ. `FoodRepository` — тільки CRUD у localStorage. `FoodService` — тільки бізнес-логіка над продуктами. `FoodDatabaseView` — тільки рендеринг UI.

**OCP — Open/Closed**
`NutritionCalculator` приймає стратегію як параметр. Нову логіку обчислення можна додати окремим класом, не змінюючи існуючий код.

**DIP — Dependency Inversion**
Всі залежності передаються через конструктор. `app.js` — єдине місце де створюються об'єкти. Жоден клас не створює залежності через `new` всередині себе.

**DRY — Don't Repeat Yourself**
`BaseRepository` містить спільну логіку localStorage для всіх репозиторіїв. `Validator` централізує валідацію форм. `DOM` і `DateUtils` — загальні утиліти без дублювання в представленнях.

**KISS**
Без фреймворків і зайвих абстракцій. Чисті ES Modules, кожна функція робить одну річ.

**YAGNI**
Реалізовано тільки необхідний функціонал, без заготовок «про запас».

**Law of Demeter**
View-класи звертаються тільки до свого контролера, не до репозиторіїв чи сервісів напряму.

---

## Design Patterns

**Observer** — [`src/patterns/EventEmitter.js`](src/patterns/EventEmitter.js)

Дозволяє компонентам реагувати на зміни даних без прямих посилань один на одного. Коли `DiaryService` додає запис, він емітить подію `DIARY_UPDATED` — всі підписники реагують незалежно.

```js
appEvents.emit(EVENTS.DIARY_UPDATED, { date });
appEvents.on(EVENTS.DIARY_UPDATED, ({ date }) => diaryView.render());
```

**Repository** — [`src/repositories/`](src/repositories/)

Приховує деталі збереження за єдиним інтерфейсом. Замінити localStorage на IndexedDB або REST API можна змінивши лише репозиторій, не торкаючись сервісів і контролерів.

**Strategy** — [`src/services/NutritionCalculator.js`](src/services/NutritionCalculator.js)

Дозволяє підмінювати алгоритм обчислення нутрієнтів. Для денного підсумку використовується `SumStrategy`, для тижневої статистики — `AverageStrategy`.

```js
const calc = new NutritionCalculator(new AverageStrategy());
calc.setStrategy(new SumStrategy());
```

---

## Refactoring Techniques

**Extract Method** — великі функції розбиті на дрібні. `DiaryView.render()` делегує роботу `_renderMacroCards()`, `_renderWeeklyChart()`, `_renderMeals()`.

**Extract Class** — логіка обчислень винесена в `NutritionCalculator`, робота з DOM — в `DOM`, валідація — в `Validator`, форматування — в `FormatUtils`.

**Replace Magic Number with Named Constant** — замість рядкових літералів у `localStorage.setItem(...)` використовуються константи `STORAGE_KEY` у кожному репозиторії.

**Introduce Parameter Object** — замість `addEntry(foodId, grams, date, mealType)` метод приймає один об'єкт `{ foodId, grams, date, mealType }`.

**Replace Conditional with Polymorphism** — замість `if/else` на тип стратегії — класи `SumStrategy` і `AverageStrategy` з однаковим інтерфейсом `calculate(entries)`.

**Encapsulate Field** — поля репозиторіїв і сервісів приватні (`_storageKey`, `_listeners`), доступ тільки через публічні методи.

**Command Query Separation** — методи або повертають дані (`getEntriesForDate`), або змінюють стан (`addEntry`), але не обидва одночасно.