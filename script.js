const canvas = document.getElementById('signCanvas');
const ctx = canvas.getContext('2d');
const alphabetGrid = document.getElementById('alphabetGrid');
const wordInput = document.getElementById('wordInput');
const errorMessage = document.getElementById('errorMessage');
const currentWord = document.getElementById('currentWord');

const profanityList = ['damn','hell','shit','fuck','bitch','ass','bastard','crap','piss','dick','cock','pussy','slut','whore','cunt','fag','nigger','nigga'];

for(let i = 65; i <= 90; i++){
    const letter = String.fromCharCode(i);
    const btn = document.createElement('button');
    btn.className = 'letter-btn';
    btn.textContent = letter;
    btn.onclick = () => showLetterSign(letter);
    alphabetGrid.appendChild(btn);
}

for(let i = 0; i <= 9; i++){
    const btn = document.createElement('button');
    btn.className = 'letter-btn';
    btn.textContent = i;
    btn.onclick = () => showNumberSign(i);
    alphabetGrid.appendChild(btn);
}

wordInput.addEventListener('keypress', function(e){
    if(e.key === 'Enter') searchWord();
});

function clearCanvas(){
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function showLetterSign(letter){
    clearCanvas();
    currentWord.textContent = `Letter: ${letter}`;
    errorMessage.textContent = '';
    document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.textContent === letter) btn.classList.add('active');
    });
    drawASLLetter(letter);
}

function showNumberSign(number){
    clearCanvas();
    currentWord.textContent = `Number: ${number}`;
    errorMessage.textContent = '';
    document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.textContent == number) btn.classList.add('active');
    });
    drawASLNumber(number);
}

function validateInput(input){
    const lowerInput = input.toLowerCase();
    for(let word of profanityList){
        if(lowerInput.includes(word)){
            return {valid: false, error: 'Inappropriate language is not allowed.'};
        }
    }
    const datePattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
    const phonePattern = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    const numberPattern = /^\d+$/;
    if(datePattern.test(input) || phonePattern.test(input) || numberPattern.test(input)){
        return {valid: true};
    }
    if(input.trim().includes(' ')){
        return {valid: false, error: 'Phrases are not allowed. Single words only.'};
    }
    if(/^[a-zA-Z]+$/.test(input)){
        return {valid: true};
    }
    return {valid: true};
}

function searchWord(){
    const input = wordInput.value.trim();
    if(!input){
        errorMessage.textContent = 'Please enter a word, date, or phone number.';
        return;
    }
    const validation = validateInput(input);
    if(!validation.valid){
        errorMessage.textContent = validation.error;
        clearCanvas();
        currentWord.textContent = '❌ Invalid Input';
        return;
    }
    errorMessage.textContent = '';
    currentWord.textContent = `Word: ${input.toUpperCase()}`;
    document.querySelectorAll('.letter-btn').forEach(btn => btn.classList.remove('active'));
    drawWordSign(input);
}

function drawWordSign(word){
    clearCanvas();
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('This word will be fingerspelled:', canvas.width/2, 50);
    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
    const letters = cleanWord.split('');
    const startX = 100;
    const y = canvas.height/2;
    const spacing = Math.min(80, (canvas.width - 200) / letters.length);
    letters.forEach((char, index) => {
        ctx.save();
        ctx.translate(startX + index * spacing, y);
        ctx.scale(0.35, 0.35);
        if(/[a-zA-Z]/.test(char)){
            drawASLLetter(char.toUpperCase());
        } else if(/[0-9]/.test(char)){
            drawASLNumber(parseInt(char));
        }
        ctx.restore();
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.fillText(char, startX + index * spacing, y + 140);
    });
}

function drawFinger(x, y, length, width, angle){
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    const segments = 3;
    const segmentLength = length / segments;
    for(let i = 0; i < segments; i++){
        const segWidth = width - (i * width / (segments * 2));
        ctx.beginPath();
        ctx.rect(-segWidth/2, i * segmentLength, segWidth, segmentLength + 2);
        ctx.fill();
        ctx.stroke();
    }
    ctx.restore();
}

function drawThumb(x, y, length, width, angle){
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.rect(-width/2, 0, width, length * 0.6);
    ctx.fill();
    ctx.stroke();
    const upperWidth = width * 0.8;
    ctx.beginPath();
    ctx.rect(-upperWidth/2, length * 0.6 - 2, upperWidth, length * 0.4 + 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function drawPalm(x, y, width, height){
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.ellipse(0, 0, width/2, height/2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function drawTouchPoint(x, y, size = 12){
    ctx.save();
    ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(x - 3, y - 3, size/3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
function drawASLLetter(letter){
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(letter, 0, -180);
    ctx.fillStyle = '#ffd7b5';
    ctx.strokeStyle = '#8b6f47';
    ctx.lineWidth = 3;
    
    switch(letter){
        case 'A':
            drawPalm(0, 30, 120, 140);
            for(let i = 0; i < 4; i++){
                ctx.beginPath();
                ctx.ellipse(-35 + i * 23, -15, 18, 22, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            drawThumb(-70, 10, 55, 24, -0.2);
            break;
        case 'B':
            drawPalm(0, 40, 110, 150);
            drawFinger(-38, -80, 95, 20, 0);
            drawFinger(-13, -85, 100, 20, 0);
            drawFinger(12, -85, 98, 19, 0);
            drawFinger(35, -80, 90, 18, 0);
            drawThumb(-65, 25, 50, 22, 0);
            break;
        case 'C':
            drawPalm(0, 20, 100, 130);
            drawFinger(-35, -60, 85, 18, 0.3);
            drawFinger(-12, -70, 95, 19, 0.15);
            drawFinger(12, -70, 95, 19, -0.15);
            drawFinger(35, -60, 85, 18, -0.3);
            drawThumb(-55, -30, 60, 24, 0.5);
            break;
        case 'D':
            drawPalm(0, 40, 110, 140);
            drawFinger(0, -90, 105, 20, 0);
            drawThumb(-50, -10, 55, 22, 0.8);
            ctx.beginPath();
            ctx.ellipse(15, 10, 20, 24, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(35, 15, 18, 22, 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            drawTouchPoint(-20, 5);
            break;
        case 'E':
            drawPalm(0, 35, 120, 140);
            for(let i = 0; i < 4; i++){
                ctx.beginPath();
                ctx.ellipse(-35 + i * 23, -20, 18, 20, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.ellipse(-55, -5, 22, 32, -0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
        case 'F':
            drawPalm(0, 40, 110, 140);
            drawFinger(-12, -85, 100, 20, 0);
            drawFinger(12, -85, 98, 19, 0);
            drawFinger(35, -80, 90, 18, 0);
            drawThumb(-50, -30, 60, 24, 0.6);
            drawTouchPoint(-38, -50);
            break;
        case 'G':
            drawPalm(0, 30, 110, 140);
            drawFinger(-30, -20, 80, 18, 1.57);
            drawThumb(-55, -25, 60, 24, 0);
            for(let i = 1; i < 4; i++){
                ctx.beginPath();
                ctx.ellipse(-10 + i * 20, 15, 16, 20, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            break;
        case 'H':
            drawPalm(0, 40, 110, 140);
            drawFinger(-15, -20, 80, 18, 1.57);
            drawFinger(10, -20, 80, 18, 1.57);
            drawThumb(-60, -10, 55, 22, 0);
            for(let i = 2; i < 4; i++){
                ctx.beginPath();
                ctx.ellipse(10 + i * 18, 15, 16, 20, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            break;
        case 'I':
            drawPalm(0, 35, 120, 140);
            drawFinger(45, -80, 85, 17, 0);
            for(let i = 0; i < 3; i++){
                ctx.beginPath();
                ctx.ellipse(-30 + i * 22, -10, 18, 22, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            drawThumb(-65, 15, 50, 22, -0.3);
            break;
        case 'J':
            drawPalm(0, 35, 120, 140);
            drawFinger(45, -80, 85, 17, 0);
            for(let i = 0; i < 3; i++){
                ctx.beginPath();
                ctx.ellipse(-30 + i * 22, -10, 18, 22, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            drawThumb(-65, 15, 50, 22, -0.3);
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(60, -40, 25, 0, Math.PI);
            ctx.stroke();
            ctx.strokeStyle = '#8b6f47';
            ctx.lineWidth = 3;
            break;
        case 'K':
            drawPalm(0, 40, 110, 140);
            drawFinger(-10, -90, 105, 20, 0);
            drawFinger(15, -85, 100, 19, 0);
            drawThumb(-45, -30, 60, 24, 0.5);
            for(let i = 2; i < 4; i++){
                ctx.beginPath();
                ctx.ellipse(15 + i * 20, 15, 16, 20, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            break;
        case 'L':
            drawPalm(0, 35, 120, 140);
            drawFinger(-25, -90, 100, 20, 0);
            drawThumb(-25, -90, 90, 22, 1.57);
            for(let i = 1; i < 4; i++){
                ctx.beginPath();
                ctx.ellipse(-5 + i * 22, 10, 18, 22, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            break;
        case 'M':
            drawPalm(0, 40, 120, 150);
            for(let i = 0; i < 3; i++){
                ctx.beginPath();
                ctx.ellipse(-30 + i * 25, -10, 20, 24, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.ellipse(50, 5, 18, 22, 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            drawThumb(-60, 15, 50, 22, -0.3);
            break;
        case 'N':
            drawPalm(0, 40, 120, 150);
            for(let i = 0; i < 2; i++){
                ctx.beginPath();
                ctx.ellipse(-25 + i * 25, -10, 20, 24, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.ellipse(30, 5, 18, 22, 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(50, 10, 18, 22, 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            drawThumb(-60, 15, 50, 22, -0.3);
            break;
        case 'O':
            drawPalm(0, 20, 100, 130);
            ctx.beginPath();
            ctx.arc(0, -20, 45, 0, Math.PI * 2);
            ctx.lineWidth = 20;
            ctx.stroke();
            ctx.lineWidth = 3;
            break;
        case 'P':
            drawPalm(0, 40, 110, 140);
            drawFinger(-10, -20, 80, 18, 1.3);
            drawThumb(-45, -30, 60, 24, 0.5);
            for(let i = 1; i < 4; i++){
                ctx.beginPath();
                ctx.ellipse(10 + i * 20, 15, 16, 20, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            break;
        case 'Q':
            drawPalm(0, 30, 110, 140);
            drawFinger(-30, 10, 80, 18, 1.8);
            drawThumb(-55, 5, 60, 24, 1.8);
            for(let i = 1; i < 4; i++){
                ctx.beginPath();
                ctx.ellipse(-10 + i * 20, 15, 16, 20, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            break;
case 'R':
            drawPalm(0, 40, 110, 140);
            drawFinger(-15, -90, 100, 20, 0);
            drawFinger(10, -88, 98, 19, 0);
            ctx.beginPath();
            ctx.moveTo(-15, -40);
            ctx.lineTo(10, -50);
            ctx.lineWidth = 5;
            ctx.stroke();
            ctx.lineWidth = 3;
            for(let i = 2; i < 4; i++){
                ctx.beginPath();
                ctx.ellipse(15 + i * 20, 15, 16, 20, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            drawThumb(-60, 20, 50, 22, -0.2);
            break;
        case 'S':
            drawPalm(0, 30, 120, 140);
            for(let i = 0; i < 4; i++){
                ctx.beginPath();
                ctx.ellipse(-35 + i * 23, -15, 18, 22, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.ellipse(-40, -15, 22, 28, -0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
        case 'T':
            drawPalm(0, 40, 120, 150);
            ctx.beginPath();
            ctx.ellipse(-25, -10, 20, 24, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            for(let i = 1; i < 4; i++){
                ctx.beginPath();
                ctx.ellipse(0 + i * 22, 5, 18, 22, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.ellipse(-45, -10, 18, 30, -0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
        case 'U':
            drawPalm(0, 40, 110, 140);
            drawFinger(-15, -90, 100, 20, 0);
            drawFinger(10, -88, 98, 19, 0);
            for(let i = 2; i < 4; i++){
                ctx.beginPath();
                ctx.ellipse(15 + i * 20, 15, 16, 20, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            drawThumb(-60, 20, 50, 22, -0.2);
            break;
        case 'V':
            drawPalm(0, 40, 110, 140);
            drawFinger(-18, -90, 100, 20, -0.3);
            drawFinger(8, -90, 100, 20, 0.3);
            for(let i = 2; i < 4; i++){
                ctx.beginPath();
                ctx.ellipse(15 + i * 20, 15, 16, 20, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            drawThumb(-60, 20, 50, 22, -0.2);
            break;
        case 'W':
            drawPalm(0, 40, 110, 140);
            drawFinger(-25, -90, 95, 19, -0.3);
            drawFinger(-5, -92, 100, 20, 0);
            drawFinger(18, -90, 98, 19, 0.3);
            ctx.beginPath();
            ctx.ellipse(40, 15, 18, 22, 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            drawThumb(-60, 20, 50, 22, -0.2);
            break;
        case 'X':
            drawPalm(0, 35, 120, 140);
            ctx.beginPath();
            ctx.rect(-8, -50, 16, 40);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(-8, -50, 8, Math.PI, 0);
            ctx.fill();
            ctx.stroke();
            for(let i = 0; i < 3; i++){
                ctx.beginPath();
                ctx.ellipse(-25 + i * 22, 0, 18, 22, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.ellipse(40, 10, 16, 20, 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            drawThumb(-65, 15, 50, 22, -0.3);
            break;
        case 'Y':
            drawPalm(0, 35, 120, 140);
            drawFinger(45, -80, 85, 17, 0);
            for(let i = 0; i < 3; i++){
                ctx.beginPath();
                ctx.ellipse(-30 + i * 22, -10, 18, 22, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            drawThumb(-70, -20, 70, 24, 1.57);
            break;
        case 'Z':
            drawPalm(0, 35, 120, 140);
            drawFinger(0, -90, 105, 20, 0);
            for(let i = 1; i < 4; i++){
                ctx.beginPath();
                ctx.ellipse(-5 + i * 22, 10, 18, 22, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            drawThumb(-65, 15, 50, 22, -0.3);
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-20, -90);
            ctx.lineTo(20, -90);
            ctx.lineTo(-20, -50);
            ctx.lineTo(20, -50);
            ctx.stroke();
            ctx.strokeStyle = '#8b6f47';
            ctx.lineWidth = 3;
            break;
        default:
            ctx.font = '80px Arial';
            ctx.fillText('✋', 0, 20);
    }
    ctx.restore();
}

function drawASLNumber(num){
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(num.toString(), 0, -180);
    ctx.fillStyle = '#ffd7b5';
    ctx.strokeStyle = '#8b6f47';
    ctx.lineWidth = 3;
    
    switch(num){
        case 0:
            drawPalm(0, 20, 100, 130);
            ctx.beginPath();
            ctx.arc(0, -20, 45, 0, Math.PI * 2);
            ctx.lineWidth = 20;
            ctx.stroke();
            ctx.lineWidth = 3;
            break;
        case 1:
            drawPalm(0, 35, 120, 140);
            drawFinger(0, -90, 105, 20, 0);
            for(let i = 1; i < 4; i++){
                ctx.beginPath();
                ctx.ellipse(-5 + i * 22, 10, 18, 22, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            drawThumb(-65, 15, 50, 22, -0.3);
            break;
        case 2:
            drawPalm(0, 40, 110, 140);
            drawFinger(-18, -90, 100, 20, -0.3);
            drawFinger(8, -90, 100, 20, 0.3);
            for(let i = 2; i < 4; i++){
                ctx.beginPath();
                ctx.ellipse(15 + i * 20, 15, 16, 20, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            drawThumb(-60, 20, 50, 22, -0.2);
            break;
        case 3:
            drawPalm(0, 40, 110, 140);
            drawFinger(-25, -90, 95, 19, -0.3);
            drawFinger(-5, -92, 100, 20, 0);
            drawFinger(18, -90, 98, 19, 0.3);
            ctx.beginPath();
            ctx.ellipse(40, 15, 18, 22, 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            drawThumb(-60, 20, 50, 22, -0.2);
            break;
        case 4:
            drawPalm(0, 40, 110, 150);
            drawFinger(-38, -80, 95, 20, 0);
            drawFinger(-13, -85, 100, 20, 0);
            drawFinger(12, -85, 98, 19, 0);
            drawFinger(35, -80, 90, 18, 0);
            drawThumb(-65, 25, 50, 22, 0);
            break;
        case 5:
            drawPalm(0, 40, 110, 150);
            drawFinger(-38, -80, 95, 20, 0);
            drawFinger(-13, -85, 100, 20, 0);
            drawFinger(12, -85, 98, 19, 0);
            drawFinger(35, -80, 90, 18, 0);
            drawThumb(-70, -20, 70, 24, 1.57);
            break;
        case 6:
            drawPalm(0, 40, 110, 150);
            drawFinger(-38, -80, 95, 20, 0);
            drawFinger(-13, -85, 100, 20, 0);
            drawFinger(12, -85, 98, 19, 0);
            ctx.beginPath();
            ctx.ellipse(35, 10, 18, 22, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            drawThumb(-70, -20, 70, 24, 1.57);
            break;
        case 7:
            drawPalm(0, 40, 110, 150);
            drawFinger(-38, -80, 95, 20, 0);
            drawFinger(-13, -85, 100, 20, 0);
            ctx.beginPath();
            ctx.ellipse(12, 10, 18, 22, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(35, 10, 18, 22, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            drawThumb(-70, -20, 70, 24, 1.57);
            break;
        case 8:
            drawPalm(0, 40, 110, 150);
            drawFinger(-38, -80, 95, 20, 0);
            ctx.beginPath();
            ctx.ellipse(-13, 10, 18, 22, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(12, 10, 18, 22, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(35, 10, 18, 22, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            drawThumb(-70, -20, 70, 24, 1.57);
            break;
        case 9:
            drawPalm(0, 40, 110, 150);
            ctx.beginPath();
            ctx.arc(0, -20, 45, 0, Math.PI * 2);
            ctx.lineWidth = 20;
            ctx.stroke();
            ctx.lineWidth = 3;
            drawThumb(-70, -20, 70, 24, 1.57);
            break;
        default:
            ctx.font = '80px Arial';
            ctx.fillText('✋', 0, 20);
    }
    ctx.restore();
}

clearCanvas();