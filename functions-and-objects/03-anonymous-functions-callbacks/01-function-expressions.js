/*
 * ============================================================
 * Тема 3: Анонимни функции и callback функции
 * Задача 1 (ЛЕСНА): Три начина да запишем функция
 * ============================================================
 *
 * Условие:
 *   Напишете функцията „градуси по Целзий → Фаренхайт“ (F = C * 9/5 + 32)
 *   по три начина и проверете, че дават еднакъв резултат:
 *     a) function declaration    – toFahrenheitDecl
 *     b) function expression     – toFahrenheitExpr (анонимна функция в const)
 *     c) arrow функция           – toFahrenheitArrow
 *
 *   След това напишете като arrow функции:
 *     - isEven(n)                  → true/false (кратък запис без { } и return)
 *     - greet(name = 'приятел')    → 'Здравей, {name}!'
 *     - createPoint(x, y)          → обект { x, y }
 *       (внимание: обект се връща в кръгли скоби!)
 *     - обект calculator с методи add и multiply (използвайте анонимни функции)
 *
 * Примерен вход → очакван изход:
 *   toFahrenheitArrow(100)  → 212
 *   isEven(7)               → false
 *   greet()                 → 'Здравей, приятел!'
 *   createPoint(3, 4)       → { x: 3, y: 4 }
 *   calculator.add(2, 3)    → 5
 */

// Помощна функция за тестове: сравнява очакван и реален резултат
function check(label, expected, actual) {
  const ok = JSON.stringify(expected) === JSON.stringify(actual);
  console.log(`${ok ? '✅' : '❌'} ${label}`);
  console.log('   Очаквано:', expected, '| Получено:', actual);
}

// ---------------- РЕШЕНИЕ ----------------

// a) Function declaration – има име, може да се извика и ПРЕДИ реда, на който е дефинирана
function toFahrenheitDecl(celsius) {
  return celsius * 9 / 5 + 32;
}

// b) Function expression – анонимна функция, записана в променлива
const toFahrenheitExpr = function (celsius) {
  return celsius * 9 / 5 + 32;
};

// c) Arrow функция – кратък запис; при един израз return е „скрит“
const toFahrenheitArrow = (celsius) => celsius * 9 / 5 + 32;

// Arrow функция с един параметър – скобите около него не са задължителни
const isEven = n => n % 2 === 0;

// Arrow функция с параметър по подразбиране
const greet = (name = 'приятел') => `Здравей, ${name}!`;

// Връщане на обект: { } се обгражда с ( ), иначе JS ги приема за тяло на функцията
const createPoint = (x, y) => ({ x, y });

// Arrow функция с повече редове – тогава трябват { } и явен return
const describeTemperature = (celsius) => {
  const f = toFahrenheitArrow(celsius);
  return `${celsius}°C = ${f}°F`;
};

// Обект, чиито методи са анонимни функции
const calculator = {
  name: 'Мини калкулатор',
  add: function (a, b) {   // анонимен function expression като стойност на свойство
    return a + b;
  },
  multiply: (a, b) => a * b, // arrow функция като стойност на свойство
};

// ---------------- ТЕСТОВЕ ----------------

console.log('--- Трите начина дават еднакъв резултат ---');
check('toFahrenheitDecl(100)', 212, toFahrenheitDecl(100));
check('toFahrenheitExpr(0)', 32, toFahrenheitExpr(0));
check('toFahrenheitArrow(-40)', -40, toFahrenheitArrow(-40));
check('и трите за 25°C', [77, 77, 77], [toFahrenheitDecl(25), toFahrenheitExpr(25), toFahrenheitArrow(25)]);

console.log('\n--- Кратки arrow функции ---');
check('isEven(7)', false, isEven(7));
check('isEven(10)', true, isEven(10));
check("greet('Мила')", 'Здравей, Мила!', greet('Мила'));
check('greet() – по подразбиране', 'Здравей, приятел!', greet());
check('createPoint(3, 4)', { x: 3, y: 4 }, createPoint(3, 4));
check('createPoint(3, 4).y – достъп до свойство', 4, createPoint(3, 4).y);
check('describeTemperature(30)', '30°C = 86°F', describeTemperature(30));

console.log('\n--- Обект с анонимни функции като методи ---');
check('calculator.name', 'Мини калкулатор', calculator.name);
check('calculator.add(2, 3)', 5, calculator.add(2, 3));
check('calculator.multiply(4, 5)', 20, calculator.multiply(4, 5));

console.log('\n--- Анонимна функция, подадена директно като аргумент ---');
// Функцията няма име – създаваме я точно на мястото, където е нужна
const doubled = [1, 2, 3].map(n => n * 2);
check('[1, 2, 3].map(n => n * 2)', [2, 4, 6], doubled);
