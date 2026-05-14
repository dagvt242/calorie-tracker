# 🥗 CalorieTracker

Застосунок для підрахунку калорій і відстеження харчування з зручним UI та збереженням даних у `localStorage`.

---

## Функціональність

| Функція | Опис |
|---|---|
| 📒 Щоденник | Додавання страв по прийомах їжі (сніданок/обід/вечеря/перекус) |
| 📊 Макронутрієнти | Підрахунок калорій, білків, жирів, вуглеводів з прогрес-барами |
| 📅 Навігація по датах | Перегляд і редагування записів за будь-який день |
| 📈 Тижневий графік | Візуалізація споживання калорій за останні 7 днів |
| 🥦 База продуктів | 35+ вбудованих продуктів, можливість додавати власні |
| ⚙️ Налаштування | Персональні денні норми (ккал / Б / Ж / В) |
| 💾 Збереження | Всі дані зберігаються у `localStorage` браузера |

## Запуск локально

```bash
# Клонуйте репозиторій
git clone https://github.com/YOUR_USERNAME/calorie-tracker.git
cd calorie-tracker

# Запустіть будь-який статичний сервер, наприклад:
npx serve .
# або
python3 -m http.server 8080

# Відкрийте http://localhost:8080
```

> **Важливо:** проєкт використовує ES Modules (`type="module"`), тому потрібен HTTP-сервер — відкриття `index.html` напряму через `file://` не працює.

---

## Структура файлів

```
calorie-tracker/
├── index.html
├── assets/
│   └── css/
│       └── style.css
└── src/
    ├── app.js                        # Composition Root (точка входу)
    ├── data/
    │   └── defaultFoods.js           # База продуктів за замовчуванням
    ├── models/
    │   ├── Food.js                   # Модель продукту
    │   ├── DiaryEntry.js             # Модель запису щоденника
    │   └── UserSettings.js           # Модель налаштувань
    ├── repositories/
    │   ├── BaseRepository.js         # Базовий клас (localStorage)
    │   ├── FoodRepository.js
    │   ├── DiaryRepository.js
    │   └── SettingsRepository.js
    ├── services/
    │   ├── NutritionCalculator.js    # Стратегія обчислення
    │   ├── DiaryService.js
    │   ├── FoodService.js
    │   └── SettingsService.js
    ├── controllers/
    │   ├── DiaryController.js
    │   ├── FoodController.js
    │   └── SettingsController.js
    ├── views/
    │   ├── DiaryView.js
    │   ├── FoodDatabaseView.js
    │   ├── SettingsView.js
    │   └── Router.js
    ├── patterns/
    │   └── EventEmitter.js           # Observer pattern
    └── utils/
        ├── DateUtils.js
        ├── DOM.js
        └── Validator.js
```

---

## Programming Principles

### 1. SRP — Single Responsibility Principle
Кожен клас відповідає рівно за одну річ:
- [`Food.js`](src/models/Food.js) — лише модель продукту і розрахунок нутрієнтів за вагою
- [`FoodRepository.js`](src/repositories/FoodRepository.js) — лише CRUD у localStorage
- [`FoodService.js`](src/services/FoodService.js) — лише бізнес-логіка над продуктами
- [`FoodDatabaseView.js`](src/views/FoodDatabaseView.js) — лише рендеринг UI

### 2. OCP — Open/Closed Principle
[`NutritionCalculator`](src/services/NutritionCalculator.js) відкритий для розширення (нові стратегії розрахунку) і закритий для модифікації. Додати нову стратегію = написати новий клас, не чіпаючи існуючий код.

### 3. DIP — Dependency Inversion Principle
Всі залежності передаються через конструктор (dependency injection). [`app.js`](src/app.js) — єдине місце, де відбувається «зшивання» об'єктів (Composition Root). Жоден клас не створює залежності всередині себе через `new`.

### 4. DRY — Don't Repeat Yourself
- [`BaseRepository`](src/repositories/BaseRepository.js) містить спільну логіку localStorage для всіх репозиторіїв
- [`DOM`](src/utils/DOM.js) та [`DateUtils`](src/utils/DateUtils.js) — утиліти без дублювання коду в представленнях
- [`Validator`](src/utils/Validator.js) — централізована валідація форм

### 5. KISS — Keep It Simple, Stupid
- Жодних зовнішніх бібліотек (без React, Vue, jQuery)
- Чисті ES Modules, мінімальна абстракція
- Кожна функція робить одну річ

### 6. YAGNI — You Aren't Gonna Need It
Реалізовано тільки потрібний функціонал — без «про запас» методів та конфігурацій.

### 7. Law of Demeter
View-класи звертаються тільки до свого контролера, а не до репозиторіїв чи сервісів напряму. Ланцюги викликів обмежені одним рівнем.

---

## Design Patterns

### 1. Observer [`src/patterns/EventEmitter.js`](src/patterns/EventEmitter.js)
**Навіщо:** дозволяє View підписуватись на зміни даних без прямих посилань на інші компоненти. Коли [`DiaryService`](src/services/DiaryService.js) додає запис — він емітить `DIARY_UPDATED`, і всі підписники (наприклад, Router) можуть відреагувати незалежно.

```js
appEvents.emit(EVENTS.DIARY_UPDATED, { date });
appEvents.on(EVENTS.DIARY_UPDATED, ({ date }) => diaryView.render());
```

### 2. Repository [`src/repositories/`](src/repositories/)
**Навіщо:** приховує деталі збереження даних (localStorage) за єдиним інтерфейсом. Замінити localStorage на IndexedDB або REST API — достатньо змінити лише репозиторій, не торкаючись сервісів і контролерів.

```js
// BaseRepository.js
_load() { return JSON.parse(localStorage.getItem(this._storageKey)); }
_save(data) { localStorage.setItem(this._storageKey, JSON.stringify(data)); }
```

### 3. Strategy [`src/services/NutritionCalculator.js`](src/services/NutritionCalculator.js)
**Навіщо:** дозволяє підміняти алгоритм обчислення нутрієнтів (сума vs середнє) без зміни коду споживача. Наприклад, для тижневого звіту використовується `AverageStrategy`, для денного — `SumStrategy`.

```js
const calculator = new NutritionCalculator(new AverageStrategy());
calculator.calculate(entries); // використовує AverageStrategy
calculator.setStrategy(new SumStrategy());
calculator.calculate(entries); // тепер SumStrategy
```

---

## Refactoring Techniques

### 1. Extract Method
Великі функції розбиті на дрібні: `render()` у [`DiaryView`](src/views/DiaryView.js) делегує роботу `_renderMacroCards()`, `_renderWeeklyChart()`, `_renderMeals()`.

### 2. Extract Class
Логіка обчислень винесена з сервісу в окремий [`NutritionCalculator`](src/services/NutritionCalculator.js). Логіка роботи з DOM — у [`DOM`](src/utils/DOM.js). Валідація — у [`Validator`](src/utils/Validator.js).

### 3. Replace Magic Number with Named Constant
Замість `localStorage.setItem('ct_foods', ...)` — константа `const STORAGE_KEY = 'ct_foods'` у кожному репозиторії. Замість числових порогів — іменовані поля в `UserSettings`.

### 4. Introduce Parameter Object
Замість `addEntry(foodId, grams, date, mealType)` — метод приймає об'єкт `{ foodId, grams, date, mealType }`, що спрощує розширення без зміни сигнатури.

### 5. Replace Conditional with Polymorphism
Замість `if (strategy === 'sum') { ... } else if (strategy === 'avg') { ... }` — класи `SumStrategy` і `AverageStrategy` з однаковим інтерфейсом `calculate(entries)`.

### 6. Encapsulate Field
Усі поля репозиторіїв — приватні (`_storageKey`, `_listeners`). Доступ — лише через публічні методи.

### 7. Separate Query from Modifier
Методи в сервісах або повертають дані (`getEntriesForDate`) або змінюють стан (`addEntry`), але не обидва одночасно — принцип CQS (Command Query Separation).
