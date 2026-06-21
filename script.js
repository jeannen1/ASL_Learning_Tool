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
    const startX = 80;
    const y = canvas.height/2;
    const maxWidth = canvas.width - 160;
    const spacing = Math.min(100, maxWidth / letters.length);
    letters.forEach((char, index) => {
        ctx.save();
        ctx.translate(startX + index * spacing, y);
        ctx.scale(0.3, 0.3);
        if(/[a-zA-Z]/.test(char)){
            drawASLLetter(char.toUpperCase());
        } else if(/[0-9]/.test(char)){
            drawASLNumber(parseInt(char));
        }
        ctx.restore();
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(char, startX + index * spacing, y + 100);
    });
}

function drawSkinGradient(x, y, width, height) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, Math.max(width, height));
    gradient.addColorStop(0, '#f4d4b8');
    gradient.addColorStop(0.4, '#e8c4a0');
    gradient.addColorStop(0.7, '#d4a574');
    gradient.addColorStop(1, '#c9956c');
    return gradient;
}

function drawFinger(x, y, len, width, angle, bent = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    if(bent) {
        ctx.fillStyle = drawSkinGradient(0, len/2, width, len);
        ctx.beginPath();
        ctx.ellipse(0, len * 0.4, width * 0.6, len * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#a67c52';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#ffe0e6';
        ctx.beginPath();
        ctx.ellipse(width * 0.2, len * 0.3, width * 0.25, width * 0.18, 0.3, 0, Math.PI * 2);
        ctx.fill();
    } else {
        const seg = len / 3;
        for(let i = 0; i < 3; i++) {
            const w = width * (1 - i * 0.12);
            const yPos = i * seg;
            ctx.fillStyle = drawSkinGradient(0, yPos + seg/2, w, seg);
            ctx.beginPath();
            ctx.moveTo(-w/2, yPos);
            ctx.bezierCurveTo(-w/2, yPos + seg/4, -w/2, yPos + seg*3/4, -w*0.45/2, yPos + seg);
            ctx.lineTo(w*0.45/2, yPos + seg);
            ctx.bezierCurveTo(w/2, yPos + seg*3/4, w/2, yPos + seg/4, w/2, yPos);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#a67c52';
            ctx.lineWidth = 2;
            ctx.stroke();
            if(i > 0) {
                ctx.strokeStyle = '#8b6f47';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(-w/3, yPos);
                ctx.lineTo(w/3, yPos);
                ctx.stroke();
            }
        }
        ctx.fillStyle = '#ffe0e6';
        ctx.strokeStyle = '#d4a090';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, len - width * 0.3, width * 0.35, width * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
    ctx.restore();
}

function drawThumb(x, y, len, width, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    const seg1 = len * 0.58;
    const seg2 = len * 0.42;
    ctx.fillStyle = drawSkinGradient(0, seg1/2, width, seg1);
    ctx.beginPath();
    ctx.moveTo(-width/2, 0);
    ctx.bezierCurveTo(-width/2, seg1/3, -width/2, seg1*2/3, -width*0.47/2, seg1);
    ctx.lineTo(width*0.47/2, seg1);
    ctx.bezierCurveTo(width/2, seg1*2/3, width/2, seg1/3, width/2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#a67c52';
    ctx.lineWidth = 2;
    ctx.stroke();
    const w2 = width * 0.88;
    ctx.fillStyle = drawSkinGradient(0, seg1 + seg2/2, w2, seg2);
    ctx.beginPath();
    ctx.moveTo(-w2/2, seg1);
    ctx.bezierCurveTo(-w2/2, seg1 + seg2/3, -w2/2, seg1 + seg2*2/3, -w2*0.85/2, len);
    ctx.lineTo(w2*0.85/2, len);
    ctx.bezierCurveTo(w2/2, seg1 + seg2*2/3, w2/2, seg1 + seg2/3, w2/2, seg1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffe0e6';
    ctx.strokeStyle = '#d4a090';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, len - width * 0.28, width * 0.38, width * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function drawPalm(x, y, w, h) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = drawSkinGradient(0, 0, w, h);
    ctx.beginPath();
    ctx.ellipse(0, 0, w/2, h/2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#a67c52';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(139, 111, 71, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-w/3, -h/5);
    ctx.quadraticCurveTo(0, -h/7, w/4, -h/6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-w/3, h/12);
    ctx.quadraticCurveTo(0, h/6, w/3, h/5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-w/5, h/5, w/3.5, -Math.PI * 0.55, Math.PI * 0.25);
    ctx.stroke();
    ctx.restore();
}

function drawTouch(x, y) {
    ctx.save();
    const grad = ctx.createRadialGradient(x, y, 0, x, y, 18);
    grad.addColorStop(0, 'rgba(255, 60, 60, 0.9)');
    grad.addColorStop(0.6, 'rgba(255, 100, 100, 0.5)');
    grad.addColorStop(1, 'rgba(255, 150, 150, 0.1)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - 4, y - 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
function drawASLLetter(letter){
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(letter, 0, -180);
    
    switch(letter){
        case 'A':
            drawPalm(0, 30, 120, 140);
            for(let i = 0; i < 4; i++){
                drawFinger(-35 + i * 23, -15, 30, 20, 0, true);
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
            drawFinger(15, 10, 28, 20, 0, true);
            drawFinger(35, 15, 26, 18, 0.2, true);
            drawFinger(52, 20, 24, 16, 0.3, true);
            drawTouch(-20, 5);
            break;
        case 'E':
            drawPalm(0, 35, 120, 140);
            for(let i = 0; i < 4; i++){
                drawFinger(-35 + i * 23, -20, 28, 20, 0, true);
            }
            ctx.save();
            ctx.translate(-55, -5);
            ctx.rotate(-0.3);
            ctx.fillStyle = drawSkinGradient(0, 0, 22, 32);
            ctx.beginPath();
            ctx.ellipse(0, 0, 22, 32, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#a67c52';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
            break;
        case 'F':
            drawPalm(0, 40, 110, 140);
            drawFinger(-12, -85, 100, 20, 0);
            drawFinger(12, -85, 98, 19, 0);
            drawFinger(35, -80, 90, 18, 0);
            drawThumb(-50, -30, 60, 24, 0.6);
            ctx.save();
            ctx.fillStyle = drawSkinGradient(-38, -52, 18, 18);
            ctx.beginPath();
            ctx.arc(-38, -52, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#a67c52';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
            drawTouch(-38, -50);
            break;
        case 'G':
            drawPalm(0, 30, 110, 140);
            drawFinger(-30, -20, 80, 18, 1.57);
            drawThumb(-55, -25, 60, 24, 0);
            for(let i = 1; i < 4; i++){
                drawFinger(-10 + i * 20, 15, 26, 18, 0, true);
            }
            break;
        case 'H':
            drawPalm(0, 40, 110, 140);
            drawFinger(-15, -20, 80, 18, 1.57);
            drawFinger(10, -20, 80, 18, 1.57);
            drawThumb(-60, -10, 55, 22, 0);
            drawFinger(40, 15, 24, 16, 0, true);
            drawFinger(58, 20, 22, 15, 0.2, true);
            break;
        case 'I':
            drawPalm(0, 35, 120, 140);
            drawFinger(45, -80, 85, 17, 0);
            for(let i = 0; i < 3; i++){
                drawFinger(-30 + i * 22, -10, 28, 20, 0, true);
            }
            drawThumb(-65, 15, 50, 22, -0.3);
            break;
        case 'J':
            drawPalm(0, 35, 120, 140);
            drawFinger(45, -80, 85, 17, 0);
            for(let i = 0; i < 3; i++){
                drawFinger(-30 + i * 22, -10, 28, 20, 0, true);
            }
            drawThumb(-65, 15, 50, 22, -0.3);
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(60, -40, 25, 0, Math.PI * 0.8);
            ctx.stroke();
            break;
        case 'K':
            drawPalm(0, 40, 110, 140);
            drawFinger(-10, -90, 105, 20, 0);
            drawFinger(15, -85, 100, 19, 0.2);
            drawThumb(-45, -30, 60, 24, 0.5);
            drawFinger(40, 15, 26, 18, 0, true);
            drawFinger(58, 20, 24, 16, 0.2, true);
            break;
        case 'L':
            drawPalm(0, 35, 120, 140);
            drawFinger(-25, -90, 100, 20, 0);
            drawThumb(-25, -90, 90, 22, 1.57);
            for(let i = 1; i < 4; i++){
                drawFinger(-5 + i * 22, 10, 28, 20, 0, true);
            }
            break;
        case 'M':
            drawPalm(0, 40, 120, 150);
            for(let i = 0; i < 3; i++){
                drawFinger(-30 + i * 25, -10, 30, 22, 0, true);
            }
            drawFinger(50, 5, 26, 20, 0.2, true);
            drawThumb(-60, 15, 50, 22, -0.3);
            break;
        case 'N':
            drawPalm(0, 40, 120, 150);
            for(let i = 0; i < 2; i++){
                drawFinger(-25 + i * 25, -10, 30, 22, 0, true);
            }
            drawFinger(30, 5, 26, 20, 0.2, true);
            drawFinger(50, 10, 26, 19, 0.3, true);
            drawThumb(-60, 15, 50, 22, -0.3);
            break;
        case 'O':
            drawPalm(0, 20, 100, 130);
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, -25, 50, 0, Math.PI * 2);
            ctx.lineWidth = 22;
            ctx.strokeStyle = drawSkinGradient(0, -25, 50, 50);
            ctx.stroke();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#a67c52';
            ctx.stroke();
            ctx.restore();
            drawTouch(-35, -25);
            drawTouch(35, -25);
            break;
        case 'P':
            drawPalm(0, 40, 110, 140);
            drawFinger(-10, -20, 80, 18, 1.3);
            drawThumb(-45, -30, 60, 24, 0.5);
            for(let i = 1; i < 4; i++){
                drawFinger(10 + i * 20, 15, 26, 18, 0, true);
            }
            break;
        case 'Q':
            drawPalm(0, 30, 110, 140);
            drawFinger(-30, 10, 80, 18, 1.8);
            drawThumb(-55, 5, 60, 24, 1.8);
            for(let i = 1; i < 4; i++){
                drawFinger(-10 + i * 20, 15, 26, 18, 0, true);
            }
            break;
        case 'R':
            drawPalm(0, 40, 110, 140);
            drawFinger(-15, -90, 100, 20, 0);
            drawFinger(10, -88, 98, 19, 0);
            ctx.save();
            ctx.strokeStyle = '#8b6f47';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-15, -30);
            ctx.lineTo(10, -40);
            ctx.stroke();
            ctx.restore();
            for(let i = 2; i < 4; i++){
                drawFinger(15 + i * 20, 15, 26, 18, 0, true);
            }
            drawThumb(-60, 20, 50, 22, -0.2);
            break;
        case 'S':
            drawPalm(0, 30, 120, 140);
            for(let i = 0; i < 4; i++){
                drawFinger(-35 + i * 23, -15, 28, 20, 0, true);
            }
            ctx.save();
            ctx.translate(-40, -15);
            ctx.rotate(-0.5);
            ctx.fillStyle = drawSkinGradient(0, 0, 22, 28);
            ctx.beginPath();
            ctx.ellipse(0, 0, 22, 28, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#a67c52';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
            break;
        case 'T':
            drawPalm(0, 40, 120, 150);
            drawFinger(-25, -10, 28, 22, 0, true);
            for(let i = 1; i < 4; i++){
                drawFinger(0 + i * 22, 5, 28, 20, 0, true);
            }
            ctx.save();
            ctx.translate(-45, -10);
            ctx.rotate(-0.5);
            ctx.fillStyle = drawSkinGradient(0, 0, 18, 30);
            ctx.beginPath();
            ctx.ellipse(0, 0, 18, 30, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#a67c52';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
            break;
        case 'U':
            drawPalm(0, 40, 110, 140);
            drawFinger(-15, -90, 100, 20, 0);
            drawFinger(10, -88, 98, 19, 0);
            for(let i = 2; i < 4; i++){
                drawFinger(15 + i * 20, 15, 26, 18, 0, true);
            }
            drawThumb(-60, 20, 50, 22, -0.2);
            break;
        case 'V':
            drawPalm(0, 40, 110, 140);
            drawFinger(-18, -90, 100, 20, -0.3);
            drawFinger(8, -90, 100, 20, 0.3);
            for(let i = 2; i < 4; i++){
                drawFinger(15 + i * 20, 15, 26, 18, 0, true);
            }
            drawThumb(-60, 20, 50, 22, -0.2);
            break;
        case 'W':
            drawPalm(0, 40, 110, 140);
            drawFinger(-25, -90, 95, 19, -0.3);
            drawFinger(-5, -92, 100, 20, 0);
            drawFinger(18, -90, 98, 19, 0.3);
            drawFinger(40, 15, 26, 18, 0.2, true);
            drawThumb(-60, 20, 50, 22, -0.2);
            break;
        case 'X':
            drawPalm(0, 35, 120, 140);
            ctx.save();
            ctx.translate(0, -50);
            ctx.fillStyle = drawSkinGradient(0, 20, 16, 48);
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.lineTo(-8, 40);
            ctx.bezierCurveTo(-8, 45, -5, 48, 0, 48);
            ctx.bezierCurveTo(5, 48, 8, 45, 8, 40);
            ctx.lineTo(8, 0);
            ctx.bezierCurveTo(8, -5, 5, -8, 0, -8);
            ctx.bezierCurveTo(-5, -8, -8, -5, -8, 0);
            ctx.fill();
            ctx.strokeStyle = '#a67c52';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
            for(let i = 0; i < 3; i++){
                drawFinger(-25 + i * 22, 0, 28, 20, 0, true);
            }
            drawFinger(40, 10, 26, 18, 0.2, true);
            drawThumb(-65, 15, 50, 22, -0.3);
            break;
        case 'Y':
            drawPalm(0, 35, 120, 140);
            drawFinger(45, -80, 85, 17, 0);
            for(let i = 0; i < 3; i++){
                drawFinger(-30 + i * 22, -10, 28, 20, 0, true);
            }
            drawThumb(-70, -20, 70, 24, 1.57);
            break;
        case 'Z':
            drawPalm(0, 35, 120, 140);
            drawFinger(0, -90, 105, 20, 0);
            for(let i = 1; i < 4; i++){
                drawFinger(-5 + i * 22, 10, 28, 20, 0, true);
            }
            drawThumb(-65, 15, 50, 22, -0.3);
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(-20, -90);
            ctx.lineTo(20, -90);
            ctx.lineTo(-20, -50);
            ctx.lineTo(20, -50);
            ctx.stroke();
            break;
        default:
            ctx.font = '80px Arial';
            ctx.fillText('✋', 0, 20);
    }
    ctx.restore();
}

function drawASLNumber(num){
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(num.toString(), 0, -180);
    
    switch(num){
        case 0:
            drawPalm(0, 20, 100, 130);
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, -25, 50, 0, Math.PI * 2);
            ctx.lineWidth = 22;
            ctx.strokeStyle = drawSkinGradient(0, -25, 50, 50);
            ctx.stroke();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#a67c52';
            ctx.stroke();
            ctx.restore();
            break;
        case 1:
            drawPalm(0, 35, 120, 140);
            drawFinger(0, -90, 105, 20, 0);
            for(let i = 1; i < 4; i++){
                drawFinger(-5 + i * 22, 10, 28, 20, 0, true);
            }
            drawThumb(-65, 15, 50, 22, -0.3);
            break;
        case 2:
            drawPalm(0, 40, 110, 140);
            drawFinger(-18, -90, 100, 20, -0.3);
            drawFinger(8, -90, 100, 20, 0.3);
            for(let i = 2; i < 4; i++){
                drawFinger(15 + i * 20, 15, 26, 18, 0, true);
            }
            drawThumb(-60, 20, 50, 22, -0.2);
            break;
        case 3:
            drawPalm(0, 40, 110, 140);
            drawFinger(-25, -90, 95, 19, -0.3);
            drawFinger(-5, -92, 100, 20, 0);
            drawFinger(18, -90, 98, 19, 0.3);
            drawFinger(40, 15, 26, 18, 0.2, true);
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
            drawFinger(35, 10, 28, 18, 0, true);
            drawThumb(-70, -20, 70, 24, 1.57);
            break;
        case 7:
            drawPalm(0, 40, 110, 150);
            drawFinger(-38, -80, 95, 20, 0);
            drawFinger(-13, -85, 100, 20, 0);
            drawFinger(12, 10, 28, 18, 0, true);
            drawFinger(35, 10, 28, 18, 0, true);
            drawThumb(-70, -20, 70, 24, 1.57);
            break;
        case 8:
            drawPalm(0, 40, 110, 150);
            drawFinger(-38, -80, 95, 20, 0);
            drawFinger(-13, 10, 28, 18, 0, true);
            drawFinger(12, 10, 28, 18, 0, true);
            drawFinger(35, 10, 28, 18, 0, true);
            drawThumb(-70, -20, 70, 24, 1.57);
            break;
        case 9:
            drawPalm(0, 40, 110, 150);
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, -20, 45, 0, Math.PI * 2);
            ctx.lineWidth = 20;
            ctx.strokeStyle = drawSkinGradient(0, -20, 45, 45);
            ctx.stroke();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#a67c52';
            ctx.stroke();
            ctx.restore();
            drawThumb(-70, -20, 70, 24, 1.57);
            break;
        default:
            ctx.font = '80px Arial';
            ctx.fillText('✋', 0, 20);
    }
    ctx.restore();
}

clearCanvas();