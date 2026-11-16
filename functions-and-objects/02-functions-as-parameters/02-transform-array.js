/*
 * ============================================================
 * Тема 2: Функции като параметри
 * Задача 2 (СРЕДНА): Собствени map и filter
 * ============================================================
 *
 * Условие:
 *   Без да използвате вградените map и filter, напишете:
 *
 *   1) applyToEach(items, transform) – връща НОВ масив, в който всеки елемент
 *      е резултатът от transform(елемент).
 *   2) keepOnly(items, predicate) – връща НОВ масив само с елементите,
 *      за които predicate(елемент) връща true.
 *
 *   Създайте именувани функции и ги подайте като аргументи:
 *     double(n), square(n), isEven(n), isPositive(n)
 *
 *   Работа с обекти: имаме масив от ученици { name, score }.
 *   Използвайте СЪЩИТЕ две функции с нови именувани функции:
 *     hasPassed(student) – true, ако score >= 50
 *     getName(student)   – връща името
 *
 *   Оригиналният масив НЕ трябва да се променя.
 *
 * Примерен вход → очакван изход:
 *   applyToEach([1, 2, 3], double)        → [2, 4, 6]
 *   keepOnly([1, 2, 3, 4], isEven)        → [2, 4]
 *   applyToEach(keepOnly(students, hasPassed), getName) → ['Ани', 'Петър']
 */

// Помощна функция за тестове: сравнява очакван и реален резултат
function check(label, expected, actual) {
  const ok = JSON.stringify(expected) === JSON.stringify(actual);
  console.log(`${ok ? '✅' : '❌'} ${label}`);
  console.log('   Очаквано:', expected, '| Получено:', actual);
}

// ---------------- РЕШЕНИЕ ----------------

// Собствен „map“: трансформира всеки елемент чрез подадената функция
function applyToEach(items, transform) {
  const result = []; // нов масив – оригиналът остава непроменен
  for (const item of items) {
    result.push(transform(item)); // извикваме подадената функция за всеки елемент
  }
  return result;
}

// Собствен „filter“: запазва само елементите, за които predicate връща true
function keepOnly(items, predicate) {
  const result = [];
  for (const item of items) {
    if (predicate(item)) { // predicate е функция, която „отговаря“ с true/false
      result.push(item);
    }
  }
  return result;
}

// Именувани функции за числа
function double(n) {
  return n * 2;
}

function square(n) {
  return n * n;
}

function isEven(n) {
  return n % 2 === 0;
}

function isPositive(n) {
  return n > 0;
}

// Именувани функции за обекти „ученик“
function hasPassed(student) {
  return student.score >= 50; // достъп до свойство на обекта
}

function getName(student) {
  return student.name;
}

// ---------------- ТЕСТОВЕ ----------------

const numbers = [-2, 1, 2, 3, 4];

console.log('--- applyToEach ---');
check('applyToEach([1, 2, 3], double)', [2, 4, 6], applyToEach([1, 2, 3], double));
check('applyToEach(numbers, square)', [4, 1, 4, 9, 16], applyToEach(numbers, square));

console.log('\n--- keepOnly ---');
check('keepOnly([1, 2, 3, 4], isEven)', [2, 4], keepOnly([1, 2, 3, 4], isEven));
check('keepOnly(numbers, isPositive)', [1, 2, 3, 4], keepOnly(numbers, isPositive));

console.log('\n--- Комбиниране: първо филтрираме, после трансформираме ---');
// Резултатът от една функция става вход за друга
const evenSquares = applyToEach(keepOnly(numbers, isEven), square);
check('квадратите на четните числа', [4, 4, 16], evenSquares);
check('оригиналният масив е непроменен', [-2, 1, 2, 3, 4], numbers);

console.log('\n--- Работа с масив от обекти ---');
const students = [
  { name: 'Ани', score: 87 },
  { name: 'Борис', score: 42 },
  { name: 'Петър', score: 50 },
  { name: 'Деси', score: 30 },
];

check('keepOnly(students, hasPassed).length', 2, keepOnly(students, hasPassed).length);
check(
  'имената на преминалите',
  ['Ани', 'Петър'],
  applyToEach(keepOnly(students, hasPassed), getName)
);
check(
  'всички имена',
  ['Ани', 'Борис', 'Петър', 'Деси'],
  applyToEach(students, getName)
);
