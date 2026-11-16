/*
 * ============================================================
 * Тема 2: Функции като параметри
 * Задача 3 (ТРУДНА): Фабрика за валидатори (функция, която връща функция)
 * ============================================================
 *
 * Условие:
 *   Изградете малка система за проверка на данни от регистрационна форма.
 *
 *   Валидатор = функция, която получава стойност и връща:
 *     - null, ако стойността е валидна
 *     - текст с грешка, ако не е
 *
 *   1) isRequired(value) – обикновен именуван валидатор:
 *      грешка 'полето е задължително' при undefined или празен текст.
 *   2) createMinLength(min) – ВРЪЩА нов валидатор, който проверява дали
 *      текстът е поне min символа. Грешка: 'трябва да е поне {min} символа'
 *   3) createRange(min, max) – ВРЪЩА нов валидатор за число в интервала
 *      [min, max]. Грешка: 'трябва да е между {min} и {max}'
 *   4) validate(data, rules) – получава обект с данни и обект с правила:
 *        rules = { username: [isRequired, createMinLength(3)], ... }
 *      За всяко поле прилага всички негови валидатори и връща обект:
 *        { isValid: true/false, errors: ['username: ...', ...] }
 *
 * Примерен вход → очакван изход:
 *   const atLeast3 = createMinLength(3);
 *   atLeast3('Ана')        → null
 *   atLeast3('Ал')         → 'трябва да е поне 3 символа'
 *   createRange(14, 18)(20) → 'трябва да е между 14 и 18'
 *   validate({ username: 'Ал', age: 16 }, rules)
 *     → { isValid: false, errors: ['username: трябва да е поне 3 символа'] }
 */

// Помощна функция за тестове: сравнява очакван и реален резултат
function check(label, expected, actual) {
  const ok = JSON.stringify(expected) === JSON.stringify(actual);
  console.log(`${ok ? '✅' : '❌'} ${label}`);
  console.log('   Очаквано:', expected, '| Получено:', actual);
}

// ---------------- РЕШЕНИЕ ----------------

// 1) Обикновен валидатор – именувана функция
function isRequired(value) {
  if (value === undefined || value === null || value === '') {
    return 'полето е задължително';
  }
  return null; // null означава „няма грешка“
}

// 2) Функция, която ВРЪЩА функция
function createMinLength(min) {
  // Вътрешната функция „помни“ min дори след като createMinLength е приключила
  // (това се нарича closure / затваряне)
  return function checkMinLength(value) {
    if (typeof value !== 'string' || value.length < min) {
      return `трябва да е поне ${min} символа`;
    }
    return null;
  };
}

// 3) Още една фабрика – всяко извикване дава валидатор със свои граници
function createRange(min, max) {
  return function checkRange(value) {
    if (typeof value !== 'number' || value < min || value > max) {
      return `трябва да е между ${min} и ${max}`;
    }
    return null;
  };
}

// 4) Функция от по-висок ред: получава обект с масиви от функции
function validate(data, rules) {
  const errors = [];

  // for...in обхожда имената на свойствата (ключовете) на обекта rules
  for (const field in rules) {
    const validators = rules[field]; // масив от функции за това поле
    const value = data[field];       // достъп до свойство чрез променлива → скоби

    for (const validator of validators) {
      const error = validator(value); // извикваме всеки валидатор
      if (error !== null) {
        errors.push(`${field}: ${error}`);
        break; // при първата грешка за полето спираме с проверките му
      }
    }
  }

  // Връщаме обект с две свойства
  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

// ---------------- ТЕСТОВЕ ----------------

console.log('--- Фабрики за валидатори ---');
const atLeast3 = createMinLength(3); // atLeast3 е НОВА функция
check('typeof atLeast3', 'function', typeof atLeast3);
check("atLeast3('Ана')", null, atLeast3('Ана'));
check("atLeast3('Ал')", 'трябва да е поне 3 символа', atLeast3('Ал'));

const teenAge = createRange(14, 18);
check('teenAge(16)', null, teenAge(16));
check('createRange(14, 18)(20) – извикване веднага', 'трябва да е между 14 и 18', createRange(14, 18)(20));

console.log('\n--- validate с обект от правила ---');
// Обект, чиито стойности са масиви от функции
const rules = {
  username: [isRequired, createMinLength(3)],
  password: [isRequired, createMinLength(8)],
  age: [isRequired, createRange(14, 18)],
};

const goodUser = { username: 'radi', password: 'superSecret1', age: 16 };
check('валиден потребител', { isValid: true, errors: [] }, validate(goodUser, rules));

const badUser = { username: 'Ал', password: '123', age: 16 };
check(
  'кратко име и парола',
  {
    isValid: false,
    errors: ['username: трябва да е поне 3 символа', 'password: трябва да е поне 8 символа'],
  },
  validate(badUser, rules)
);

const emptyUser = { age: 25 };
check(
  'липсващи полета и възраст извън интервала',
  {
    isValid: false,
    errors: [
      'username: полето е задължително',
      'password: полето е задължително',
      'age: трябва да е между 14 и 18',
    ],
  },
  validate(emptyUser, rules)
);
