/*
 * ============================================================
 * Тема 2: Функции като параметри
 * Задача 1 (ЛЕСНА): Калкулатор с функция-операция
 * ============================================================
 *
 * Условие:
 *   1) Напишете четири именувани функции: add, subtract, multiply, divide.
 *      Всяка приема (a, b) и връща резултата. divide връща null при деление на 0.
 *   2) Напишете функция от по-висок ред calculate(a, b, operation), която
 *      получава ДРУГА функция като трети параметър и я извиква с a и b.
 *      Ако operation не е функция, calculate да връща null.
 *
 *   Важно: подаваме функцията БЕЗ скоби – calculate(2, 3, add),
 *   а не calculate(2, 3, add()). Със скоби бихме я извикали веднага!
 *
 * Примерен вход → очакван изход:
 *   calculate(10, 5, add)       → 15
 *   calculate(10, 5, subtract)  → 5
 *   calculate(10, 5, multiply)  → 50
 *   calculate(10, 0, divide)    → null
 *   calculate(10, 5, 'add')     → null   (подаден е текст, а не функция)
 */

// Помощна функция за тестове: сравнява очакван и реален резултат
function check(label, expected, actual) {
  const ok = JSON.stringify(expected) === JSON.stringify(actual);
  console.log(`${ok ? '✅' : '❌'} ${label}`);
  console.log('   Очаквано:', expected, '| Получено:', actual);
}

// ---------------- РЕШЕНИЕ ----------------

// Обикновени именувани функции – ще ги подаваме като аргументи
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return null; // делението на 0 не е позволено
  }
  return a / b;
}

// Функция от по-висок ред: получава функция (operation) като параметър
function calculate(a, b, operation) {
  // typeof на функция е 'function' – проверяваме, преди да я извикаме
  if (typeof operation !== 'function') {
    return null;
  }
  return operation(a, b); // тук извикваме подадената функция
}

// ---------------- ТЕСТОВЕ ----------------

check('calculate(10, 5, add)', 15, calculate(10, 5, add));
check('calculate(10, 5, subtract)', 5, calculate(10, 5, subtract));
check('calculate(10, 5, multiply)', 50, calculate(10, 5, multiply));
check('calculate(10, 4, divide)', 2.5, calculate(10, 4, divide));
check('calculate(10, 0, divide) – деление на 0', null, calculate(10, 0, divide));
check("calculate(10, 5, 'add') – не е функция", null, calculate(10, 5, 'add'));

console.log('\n--- Функцията е стойност: може да се запише в променлива ---');
const myOperation = multiply; // НЕ извикваме, а само „сочим“ към функцията
check('calculate(3, 7, myOperation)', 21, calculate(3, 7, myOperation));
check('myOperation.name – името на функцията', 'multiply', myOperation.name);

console.log('\n--- Нова операция без промяна на calculate ---');
// Предимство: добавяме поведение, без да пипаме calculate
function power(a, b) {
  return a ** b;
}
check('calculate(2, 10, power)', 1024, calculate(2, 10, power));
