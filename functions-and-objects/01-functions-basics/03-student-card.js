/*
 * ============================================================
 * Тема 1: Функции – основи
 * Задача 3 (ТРУДНА): Ученическа карта (функция, която връща обект)
 * ============================================================
 *
 * Условие:
 *   Напишете функция createStudent(name, age, grades = []), която създава
 *   и ВРЪЩА обект „ученик“ със:
 *     Свойства:
 *       - name   – име
 *       - age    – възраст
 *       - grades – масив с оценки (по подразбиране празен)
 *     Методи:
 *       - addGrade(grade)  – добавя оценка, само ако е между 2 и 6.
 *                            Връща true при успех и false при невалидна оценка.
 *       - getAverage()     – връща средния успех, закръглен до 2 знака
 *                            (0, ако няма оценки).
 *       - isExcellent()    – връща true, ако средният успех е >= 5.50.
 *       - getInfo()        – връща текст: "Мария (15 г.) – среден успех: 5.67"
 *
 *   В методите използвайте this, за да достъпите свойствата на обекта.
 *
 * Примерен вход → очакван изход:
 *   const s = createStudent('Мария', 15, [6, 5, 6]);
 *   s.name            → 'Мария'
 *   s.getAverage()    → 5.67
 *   s.isExcellent()   → true
 *   s.addGrade(7)     → false  (невалидна оценка)
 *   s.addGrade(4)     → true   (оценките стават [6, 5, 6, 4])
 *   s.getInfo()       → 'Мария (15 г.) – среден успех: 5.25'
 */

// Помощна функция за тестове: сравнява очакван и реален резултат
function check(label, expected, actual) {
  const ok = JSON.stringify(expected) === JSON.stringify(actual);
  console.log(`${ok ? '✅' : '❌'} ${label}`);
  console.log('   Очаквано:', expected, '| Получено:', actual);
}

// ---------------- РЕШЕНИЕ ----------------

// „Фабрична“ функция – всяко извикване създава и връща НОВ обект
function createStudent(name, age, grades = []) {
  return {
    // Свойства на обекта
    name: name,
    age: age,
    grades: [...grades], // копие на масива, за да не променяме подадения отвън

    // Метод = функция, записана като свойство на обекта
    addGrade(grade) {
      if (grade < 2 || grade > 6) {
        return false; // невалидна оценка – не я добавяме
      }
      this.grades.push(grade); // this сочи към обекта, на който е извикан методът
      return true;
    },

    getAverage() {
      if (this.grades.length === 0) {
        return 0;
      }
      let sum = 0;
      for (const g of this.grades) {
        sum += g;
      }
      return Math.round((sum / this.grades.length) * 100) / 100;
    },

    isExcellent() {
      // Методите могат да извикват други методи чрез this
      return this.getAverage() >= 5.5;
    },

    getInfo() {
      // toFixed(2) винаги показва 2 знака, напр. 5.00
      return `${this.name} (${this.age} г.) – среден успех: ${this.getAverage().toFixed(2)}`;
    },
  };
}

// ---------------- ТЕСТОВЕ ----------------

const maria = createStudent('Мария', 15, [6, 5, 6]);

console.log('--- Достъп до свойства ---');
check('maria.name (с точка)', 'Мария', maria.name);
check("maria['age'] (със скоби)", 15, maria['age']);
check('maria.grades', [6, 5, 6], maria.grades);

console.log('\n--- Извикване на методи ---');
check('maria.getAverage()', 5.67, maria.getAverage());
check('maria.isExcellent()', true, maria.isExcellent());
check('maria.addGrade(7) – невалидна', false, maria.addGrade(7));
check('maria.addGrade(4) – валидна', true, maria.addGrade(4));
check('maria.grades след добавяне', [6, 5, 6, 4], maria.grades);
check('maria.isExcellent() след 4-ката', false, maria.isExcellent());
check('maria.getInfo()', 'Мария (15 г.) – среден успех: 5.25', maria.getInfo());

console.log('\n--- Нов ученик без оценки (grades по подразбиране) ---');
const ivan = createStudent('Иван', 14);
check('ivan.grades', [], ivan.grades);
check('ivan.getAverage()', 0, ivan.getAverage());
check('ivan.getInfo()', 'Иван (14 г.) – среден успех: 0.00', ivan.getInfo());

console.log('\n--- Обектите са независими ---');
ivan.addGrade(5);
check('ivan.grades след addGrade(5)', [5], ivan.grades);
check('maria.grades не са засегнати', [6, 5, 6, 4], maria.grades);

// Промяна и добавяне на свойство след създаването
ivan.age = 15;
ivan.school = 'СУ „Христо Ботев“';
check('ivan.age след промяна', 15, ivan.age);
check('ivan.school (ново свойство)', 'СУ „Христо Ботев“', ivan.school);
