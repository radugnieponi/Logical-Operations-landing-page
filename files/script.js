// Обработка теста
document.getElementById('submit-test').addEventListener('click', function() {
    const correctAnswers = {
    q1: ['b'],
    q2: ['a'],
    q3: ['a', 'c'],
    q4: ['a', 'b'],
    q5: ['b'],
    q6: ['a'],
    q7: ['a'],
    q8: ['a'],
    q9: ['a'],
    q10: ['b'],
    q11: ['a', 'c'],
    q12: ['a'],
    q13: ['a'],
    q14: ['a'],
    q15: ['c']
    };
    
    let score = 0;
    let resultsHtml = '<h3>Результаты теста:</h3><ul>';
    
    for (let i = 1; i <= 15; i++) {
        const questionName = 'q' + i;
        const selectedOptions = Array.from(document.querySelectorAll(`input[name="${questionName}"]:checked`)).map(el => el.value);
        
        if (selectedOptions.length > 0) {
            const isCorrect = arraysEqual(selectedOptions.sort(), correctAnswers[questionName].sort());
            
            if (isCorrect) {
                score++;
                resultsHtml += `<li>Вопрос ${i}: <span style="color: green;">Правильно!</span></li>`;
            } else {
                resultsHtml += `<li>Вопрос ${i}: <span style="color: red;">Неправильно.</span> Правильные ответы: ${getCorrectAnswersText(questionName, correctAnswers)}</li>`;
            }
        } else {
            resultsHtml += `<li>Вопрос ${i}: <span style="color: orange;">Не отвечен.</span> Правильные ответы: ${getCorrectAnswersText(questionName, correctAnswers)}</li>`;
        }
    }
    
    resultsHtml += `</ul><p>Ваш результат: ${score} из 15 (${Math.round(score/15*100)}%)</p>`;
    const resultsDiv = document.getElementById('test-results');
    resultsDiv.innerHTML = resultsHtml;
    resultsDiv.classList.remove('hidden');
});

// Вспомогательные функции
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function getCorrectAnswersText(questionName, correctAnswers) {
    const answers = correctAnswers[questionName];
    if (!answers) return '';
    
    return answers.map(ans => {
        const input = document.querySelector(`input[name="${questionName}"][value="${ans}"]`);
        return input ? input.nextElementSibling.textContent : '';
    }).filter(Boolean).join(', ');
}

// Обработка демонстрации
function performOperation(operation) {
    const input1 = document.getElementById('input1').value.trim();
    const input2 = document.getElementById('input2').value.trim();
    
    if (!input1 || !input2) {
        alert('Пожалуйста, заполните оба поля!');
        return;
    }
    
    const arr1 = input1.split(',').map(item => parseInt(item.trim()));
    const arr2 = input2.split(',').map(item => parseInt(item.trim()));
    
    if (arr1.some(isNaN) || arr2.some(isNaN)) {
        alert('Пожалуйста, вводите только числа, разделенные запятыми!');
        return;
    }
    
    if (arr1.some(num => num < 0) || arr2.some(num => num < 0)) {
        alert('Пожалуйста, вводите только натуральные числа (0 и больше)!');
        return;
    }
    
    const stepsDiv = document.getElementById('calculation-steps');
    const resultDiv = document.getElementById('final-result');
    stepsDiv.innerHTML = '';
    
    const result = [];
    const maxLength = Math.max(arr1.length, arr2.length);
    
    for (let i = 0; i < maxLength; i++) {
        const val1 = i < arr1.length ? arr1[i] : 0;
        const val2 = i < arr2.length ? arr2[i] : 0;
        
        let operationSymbol, operationName, res;
        if (operation === 'conjunction') {
            operationSymbol = '∧';
            operationName = 'Конъюнкция';
            res = Math.min(val1, val2);
        } else {
            operationSymbol = '∨';
            operationName = 'Дизъюнкция';
            res = Math.max(val1, val2);
        }
        
        result.push(res);
        
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        stepDiv.innerHTML = `
            <strong>Шаг ${i+1}:</strong> ${val1} ${operationSymbol} ${val2} = ${res}
            <br><small>${operationName}: ${val1} и ${val2} → берем ${operation === 'conjunction' ? 'минимальное' : 'максимальное'} значение</small>
        `;
        stepsDiv.appendChild(stepDiv);
    }
    
    resultDiv.innerHTML = `
        <div class="final-result">
            Итоговый результат: [${result.join(', ')}]
        </div>
    `;
    
    // Прокрутка к результатам
    document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('conjunction-btn').addEventListener('click', () => performOperation('conjunction'));
document.getElementById('disjunction-btn').addEventListener('click', () => performOperation('disjunction'));

// Плавная прокрутка для навигации
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 180, // Учитываем высоту фиксированного меню
            behavior: 'smooth'
        });
    });
});