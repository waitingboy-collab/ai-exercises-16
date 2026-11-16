/*
 * ============================================================
 * Тема 3: Анонимни функции и callback функции
 * Задача 2 (СРЕДНА): Callback функции и setTimeout
 * ============================================================
 *
 * Условие:
 *   Симулираме бавна „база данни“ с потребители, като използваме setTimeout.
 *
 *   1) runAfter(ms, callback) – извиква callback след ms милисекунди.
 *      Връща id-то на таймера (резултатът от setTimeout).
 *   2) loadUser(id, callback) – след 300 ms „намира“ потребител по id и
 *      извиква callback по конвенцията „error-first“:
 *        - callback(null, user)              – при успех
 *        - callback('Няма потребител с id X') – при грешка
 *   3) countdown(from, onTick, onDone) – брои надолу от from до 1,
 *      като на всеки 200 ms извиква onTick(число). Накрая извиква onDone().
 *
 *   Важно: при асинхронен код резултатът НЕ може да се върне с return,
 *   защото още не е готов. Затова го „доставяме“ чрез callback.
 *
 * Примерен вход → очакван изход (в callback-а):
 *   loadUser(1, (err, user) => ...)  → err = null, user.name = 'Ани'
 *   loadUser(99, (err, user) => ...) → err = 'Няма потребител с id 99'
 *   countdown(3, onTick, onDone)     → onTick: 3, 2, 1; после onDone
 *
 * Изпълнение: обърнете внимание на РЕДА, в който се появяват съобщенията!
 */

// Помощна функция за тестове: сравнява очакван и реален резултат
function check(label, expected, actual) {
  const ok = JSON.stringify(expected) === JSON.stringify(actual);
  console.log(`${ok ? '✅' : '❌'} ${label}`);
  console.log('   Очаквано:', expected, '| Получено:', actual);
}

// ---------------- РЕШЕНИЕ ----------------

// „База данни“ – обект, в който ключовете са id-та, а стойностите – обекти
const usersDb = {
  1: { id: 1, name: 'Ани', role: 'ученик' },
  2: { id: 2, name: 'Георги', role: 'учител' },
};

// 1) callback е функция, която ще бъде извикана ПО-КЪСНО
function runAfter(ms, callback) {
  const timerId = setTimeout(callback, ms); // setTimeout сам ще извика callback
  return timerId;
}

// 2) Error-first callback: първият аргумент е грешката (или null)
function loadUser(id, callback) {
  // Анонимна arrow функция, която setTimeout ще изпълни след 300 ms
  setTimeout(() => {
    const user = usersDb[id]; // достъп до свойство чрез скоби
    if (user === undefined) {
      callback(`Няма потребител с id ${id}`); // грешка → user не се подава
      return;
    }
    callback(null, user); // успех → грешката е null
  }, 300);
}

// 3) Два callback-а: един за всяка стъпка и един за края
function countdown(from, onTick, onDone) {
  let current = from;

  // Именувана функция, която планира сама себе си отново
  function tick() {
    if (current === 0) {
      onDone();
      return;
    }
    onTick(current);
    current--;
    setTimeout(tick, 200);
  }

  setTimeout(tick, 200);
}

// ---------------- ТЕСТОВЕ ----------------

console.log('1) Начало на програмата (синхронно)');

// runAfter с анонимна функция като callback
const timerId = runAfter(100, function () {
  console.log('\n3) runAfter: изпълнено след 100 ms');
});
check('runAfter връща id на таймер (обект в Node.js)', 'object', typeof timerId);

// loadUser – успешен случай; проверката е ВЪТРЕ в callback-а
loadUser(1, (error, user) => {
  console.log('\n4) loadUser(1) отговори:');
  check('error', null, error);
  check('user.name', 'Ани', user.name);
  check('user.role', 'ученик', user.role);
});

// loadUser – грешка
loadUser(99, (error, user) => {
  console.log('\n5) loadUser(99) отговори:');
  check('error', 'Няма потребител с id 99', error);
  check('user', undefined, user);
});

// countdown – събираме числата в масив и проверяваме в края
const ticks = [];
countdown(
  3,
  (n) => ticks.push(n),             // onTick – анонимна arrow функция
  () => {                           // onDone – също анонимна
    console.log('\n6) countdown приключи:');
    check('получени стъпки', [3, 2, 1], ticks);
  }
);

console.log('2) Край на синхронния код – callback-ите още не са изпълнени!');
