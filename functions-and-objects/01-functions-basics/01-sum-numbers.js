/*
 * ============================================================
 * Тема 1: Функции – основи
 * Задача 1 (ЛЕСНА): Сбор на числа
 * ============================================================
 *
 * Условие:
 *   Напишете функция sumNumbers(a, b, c), която връща сбора на до три числа.
 *   Параметрите b и c са незадължителни – ако не са подадени, да се
 *   използва стойност по подразбиране 0.
 *
 *   Бонус: Сравнете с функция, която само отпечатва резултата (console.log),
 *   но НЕ го връща с return – какво получаваме, ако запишем резултата
 *   в променлива?
 *
 * Примерен вход → очакван изход:
 *   sumNumbers(2, 3)       → 5
 *   sumNumbers(5)          → 5
 *   sumNumbers(1, 2, 3)    → 6
 *   sumNumbers(-4, 10, -6) → 0
 */

// Помощна функция за тестове: сравнява очакван и реален резултат
function check(label, expected, actual) {
  const ok = JSON.stringify(expected) === JSON.stringify(actual);
  console.log(`${ok ? '✅' : '❌'} ${label}`);
  console.log('   Очаквано:', expected, '| Получено:', actual);
}

// ---------------- РЕШЕНИЕ ----------------

// b = 0 и c = 0 са параметри по подразбиране:
// ако при извикването не подадем стойност, се използва 0 вместо undefined
function sumNumbers(a, b = 0, c = 0) {
  const result = a + b + c; // изчисляваме сбора в локална променлива
  return result;            // return връща стойността към мястото на извикване
}

// Функция БЕЗ return – само печата, но не връща нищо
function sumAndPrintOnly(a, b = 0) {
  console.log('   (sumAndPrintOnly печата):', a + b);
  // няма return → функцията автоматично връща undefined
}

// ---------------- ТЕСТОВЕ ----------------

console.log('--- sumNumbers ---');
check('sumNumbers(2, 3)', 5, sumNumbers(2, 3));
check('sumNumbers(5) – b и c са по подразбиране 0', 5, sumNumbers(5));
check('sumNumbers(1, 2, 3)', 6, sumNumbers(1, 2, 3));
check('sumNumbers(-4, 10, -6)', 0, sumNumbers(-4, 10, -6));

// Върнатата стойност може да се използва директно в друг израз
check('sumNumbers(1, 1) * 10', 20, sumNumbers(1, 1) * 10);

console.log('\n--- Функция без return ---');
const saved = sumAndPrintOnly(2, 3); // числото се печата, но НЕ се запазва
check('Резултат от функция без return', undefined, saved);
