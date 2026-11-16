/*
 * ============================================================
 * Тема 1: Функции – основи
 * Задача 2 (СРЕДНА): Минимум, максимум и средна стойност
 * ============================================================
 *
 * Условие:
 *   Една функция може да върне само ЕДНА стойност. Ако искаме да върнем
 *   няколко резултата, ги „опаковаме“ в масив или обект.
 *
 *   1) Напишете функция getMinMax(numbers), която връща масив [min, max].
 *   2) Напишете функция getStats(numbers, decimals = 2), която връща обект
 *      { min, max, average, count }. Средната стойност да е закръглена до
 *      decimals знака след запетаята (по подразбиране 2).
 *   3) При празен масив и двете функции да връщат null.
 *
 *   Не използвайте Math.min / Math.max – обходете масива с цикъл.
 *
 * Примерен вход → очакван изход:
 *   getMinMax([4, 9, 1, 7])     → [1, 9]
 *   getStats([4, 9, 1, 7])      → { min: 1, max: 9, average: 5.25, count: 4 }
 *   getStats([1, 2, 2], 1)      → { min: 1, max: 2, average: 1.7, count: 3 }
 *   getStats([])                → null
 */

// Помощна функция за тестове: сравнява очакван и реален резултат
function check(label, expected, actual) {
  const ok = JSON.stringify(expected) === JSON.stringify(actual);
  console.log(`${ok ? '✅' : '❌'} ${label}`);
  console.log('   Очаквано:', expected, '| Получено:', actual);
}

// ---------------- РЕШЕНИЕ ----------------

// Връща ДВЕ стойности, опаковани в масив [min, max]
function getMinMax(numbers) {
  if (numbers.length === 0) {
    return null; // ранен return – функцията спира тук при празен масив
  }

  let min = numbers[0]; // започваме от първия елемент
  let max = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] < min) min = numbers[i];
    if (numbers[i] > max) max = numbers[i];
  }

  return [min, max]; // масивът позволява да върнем няколко стойности
}

// Закръгляне до определен брой знаци; decimals има стойност по подразбиране
function roundTo(value, decimals = 2) {
  const factor = 10 ** decimals; // напр. 10^2 = 100
  return Math.round(value * factor) / factor;
}

// Връща НЯКОЛКО стойности, опаковани в обект с именувани свойства
function getStats(numbers, decimals = 2) {
  const minMax = getMinMax(numbers); // извикваме друга наша функция
  if (minMax === null) {
    return null;
  }

  // Деструктуриране: вадим елементите на масива в отделни променливи
  const [min, max] = minMax;

  let sum = 0;
  for (const n of numbers) {
    sum += n;
  }

  // Съкратен запис { min } е същото като { min: min }
  return {
    min,
    max,
    average: roundTo(sum / numbers.length, decimals),
    count: numbers.length,
  };
}

// ---------------- ТЕСТОВЕ ----------------

console.log('--- getMinMax (връща масив) ---');
check('getMinMax([4, 9, 1, 7])', [1, 9], getMinMax([4, 9, 1, 7]));
check('getMinMax([-3, -8, -1])', [-8, -1], getMinMax([-3, -8, -1]));
check('getMinMax([]) – празен масив', null, getMinMax([]));

console.log('\n--- getStats (връща обект) ---');
check('getStats([4, 9, 1, 7])', { min: 1, max: 9, average: 5.25, count: 4 }, getStats([4, 9, 1, 7]));
check('getStats([1, 2, 2], 1) – 1 знак', { min: 1, max: 2, average: 1.7, count: 3 }, getStats([1, 2, 2], 1));
check('getStats([])', null, getStats([]));

console.log('\n--- Използване на резултатите ---');
// Деструктуриране на масива, върнат от функцията
const [lowest, highest] = getMinMax([15, 3, 22]);
check('const [lowest, highest] = getMinMax([15, 3, 22]) → highest - lowest', 19, highest - lowest);

// Достъп до свойства на върнатия обект
const stats = getStats([10, 20, 30]);
check('stats.average', 20, stats.average);
check("stats['count'] (достъп със скоби)", 3, stats['count']);
