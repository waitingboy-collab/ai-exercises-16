/*
 * ============================================================
 * Тема 3: Анонимни функции и callback функции
 * Задача 3 (ТРУДНА): Обработка на продукти с map / filter / reduce / forEach
 * ============================================================
 *
 * Условие:
 *   Дадени са продукти в магазин – масив от обекти { name, price, category, quantity }
 *   (price е в евро, quantity – наличност в склада).
 *   Използвайте вградените методи на масивите с АНОНИМНИ (arrow) функции:
 *
 *   1) getInStock(products)               – filter: само продуктите с quantity > 0
 *   2) getLabels(products)                – map: масив от текстове 'Лаптоп – 1200.00 €'
 *   3) getTotalValue(products)            – reduce: обща стойност на склада
 *                                           (сума от price * quantity)
 *   4) applyDiscount(products, percent)   – map: НОВИ обекти с намалена цена
 *                                           (оригиналите не се променят!)
 *   5) groupByCategory(products)          – reduce: обект { категория: [имена] }
 *   6) getReport(products)                – forEach: масив от редове
 *                                           '1. Лаптоп (електроника) – 3 бр.'
 *   7) Верига: обща стойност на НАЛИЧНАТА електроника след 10% отстъпка
 *      (filter → filter → map → reduce)
 *
 * Примерен вход → очакван изход (за масива products по-долу):
 *   getInStock(products).length   → 5
 *   getLabels(products)[0]        → 'Лаптоп – 1200.00 €'
 *   getTotalValue(products)       → 4131
 *   groupByCategory(products)     → { електроника: ['Лаптоп', 'Мишка'], ... }
 *   верига (т. 7)                 → 3465
 */

// Помощна функция за тестове: сравнява очакван и реален резултат
function check(label, expected, actual) {
  const ok = JSON.stringify(expected) === JSON.stringify(actual);
  console.log(`${ok ? '✅' : '❌'} ${label}`);
  console.log('   Очаквано:', expected, '| Получено:', actual);
}

// Закръгляне до 2 знака – цените с десетични числа често дават 0.1 + 0.2 = 0.30000000000000004
const round2 = (value) => Math.round(value * 100) / 100;

// ---------------- ДАННИ ----------------

const products = [
  { name: 'Лаптоп', price: 1200, category: 'електроника', quantity: 3 },
  { name: 'Мишка', price: 25, category: 'електроника', quantity: 10 },
  { name: 'Тетрадка', price: 2.5, category: 'канцеларски', quantity: 50 },
  { name: 'Химикалка', price: 1.2, category: 'канцеларски', quantity: 100 },
  { name: 'Ябълки', price: 3, category: 'храни', quantity: 0 },
  { name: 'Хляб', price: 1.8, category: 'храни', quantity: 20 },
];

// ---------------- РЕШЕНИЕ ----------------

// 1) filter извиква callback-а за всеки продукт и пази тези, за които връща true
const getInStock = (items) => items.filter((product) => product.quantity > 0);

// 2) map създава нов масив със същия брой елементи, но трансформирани
const getLabels = (items) =>
  items.map((product) => `${product.name} – ${product.price.toFixed(2)} €`);

// 3) reduce „натрупва“ една стойност: sum е натрупаното, product – текущият елемент
const getTotalValue = (items) =>
  round2(items.reduce((sum, product) => sum + product.price * product.quantity, 0));
//                                                                               ↑ начална стойност

// 4) Spread операторът { ...product } копира всички свойства в НОВ обект
const applyDiscount = (items, percent) =>
  items.map((product) => ({
    ...product,
    price: round2(product.price * (1 - percent / 100)), // презаписваме само цената
  }));

// 5) reduce с начална стойност празен обект {} – „групираме“ по категория
const groupByCategory = (items) =>
  items.reduce((groups, product) => {
    // Ако категорията още я няма като ключ, създаваме празен масив
    if (!groups[product.category]) {
      groups[product.category] = [];
    }
    groups[product.category].push(product.name);
    return groups; // reduce изисква да върнем натрупаното за следващата стъпка
  }, {});

// 6) forEach НЕ връща резултат (винаги undefined), затова пълним външен масив
const getReport = (items) => {
  const lines = [];
  items.forEach((product, index) => {
    // forEach подава и индекса като втори аргумент на callback-а
    lines.push(`${index + 1}. ${product.name} (${product.category}) – ${product.quantity} бр.`);
  });
  return lines;
};

// 7) Верига от методи – резултатът на всеки е вход за следващия
const getDiscountedElectronicsValue = (items, percent) =>
  getTotalValue(
    applyDiscount(
      items
        .filter((p) => p.quantity > 0)
        .filter((p) => p.category === 'електроника'),
      percent
    )
  );

// ---------------- ТЕСТОВЕ ----------------

console.log('--- 1) filter ---');
const inStock = getInStock(products);
check('getInStock(products).length', 5, inStock.length);
check('Ябълките (0 бр.) липсват', false, inStock.some((p) => p.name === 'Ябълки'));

console.log('\n--- 2) map ---');
const labels = getLabels(products);
check('getLabels(products)[0]', 'Лаптоп – 1200.00 €', labels[0]);
check('getLabels(products)[3]', 'Химикалка – 1.20 €', labels[3]);

console.log('\n--- 3) reduce (сума) ---');
check('getTotalValue(products)', 4131, getTotalValue(products));
check('getTotalValue([]) – празен масив', 0, getTotalValue([]));

console.log('\n--- 4) map с нови обекти ---');
const discounted = applyDiscount(products, 10);
check('цена на Лаптоп след 10%', 1080, discounted[0].price);
check('цена на Мишка след 10%', 22.5, discounted[1].price);
check('оригиналната цена е непроменена', 1200, products[0].price);
check('другите свойства са копирани', 'електроника', discounted[0].category);

console.log('\n--- 5) reduce (групиране в обект) ---');
check(
  'groupByCategory(products)',
  {
    електроника: ['Лаптоп', 'Мишка'],
    канцеларски: ['Тетрадка', 'Химикалка'],
    храни: ['Ябълки', 'Хляб'],
  },
  groupByCategory(products)
);
check('брой категории (Object.keys)', 3, Object.keys(groupByCategory(products)).length);

console.log('\n--- 6) forEach ---');
const report = getReport(products);
check('report[0]', '1. Лаптоп (електроника) – 3 бр.', report[0]);
check('report.length', 6, report.length);
check('forEach връща undefined', undefined, products.forEach(() => {}));

console.log('\n--- 7) Верига filter → filter → map → reduce ---');
// (1080 * 3) + (22.5 * 10) = 3240 + 225 = 3465
check('стойност на наличната електроника след 10%', 3465, getDiscountedElectronicsValue(products, 10));

console.log('\n--- Отпечатване на отчета ---');
report.forEach((line) => console.log('   ' + line));
