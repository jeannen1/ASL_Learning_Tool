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

function drawRealisticFinger(x, y, length, width, angle, curled = false){
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    if(curled){
        ctx.beginPath();
        ctx.ellipse(0, length * 0.3, width * 0.7, length * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.ellipse(width * 0.3, length * 0.15, width * 0.4, width * 0.5, 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd0d0';
        ctx.fill();
        ctx.fillStyle = '#ffd7b5';
    } else {
        const segments = 3;
        const segmentLength = length / segments;
        
        for(let i = 0; i < segments; i++){
            const segWidth = width - (i * width / 5);
            const y1 = i * segmentLength;
            const y2 = (i + 1) * segmentLength;
            
            ctx.beginPath();
            ctx.moveTo(-segWidth/2, y1);
            ctx.bezierCurveTo(
                -segWidth/2, y1 + segmentLength/3,
                -segWidth/2, y1 + segmentLength * 2/3,
                -(segWidth - width/10)/2, y2
            );
            ctx.lineTo((segWidth - width/10)/2, y2);
            ctx.bezierCurveTo(
                segWidth/2, y1 + segmentLength * 2/3,
                segWidth/2, y1 + segmentLength/3,
                segWidth/2, y1
            );
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            if(i > 0 && i < segments){
                ctx.save();
                ctx.strokeStyle = '#c9a87c';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(0, y1, segWidth * 0.4, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
        }
        
        ctx.beginPath();
        ctx.ellipse(0, length - width * 0.35, width * 0.38, width * 0.28, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#ffccd5';
        ctx.fill();
        ctx.strokeStyle = '#e6b8a0';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.strokeStyle = '#8b6f47';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#ffd7b5';
    }
    
    ctx.restore();
}

function drawRealisticThumb(x, y, length, width, angle){
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    const seg1 = length * 0.55;
    const seg2 = length * 0.45;
    
    ctx.beginPath();
    ctx.moveTo(-width/2, 0);
    ctx.bezierCurveTo(-width/2, seg1/3, -width/2, seg1 * 2/3, -width * 0.45/2, seg1);
    ctx.lineTo(width * 0.45/2, seg1);
    ctx.bezierCurveTo(width/2, seg1 * 2/3, width/2, seg1/3, width/2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.save();
    ctx.strokeStyle = '#c9a87c';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, seg1, width * 0.35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    
    const upperWidth = width * 0.85;
    ctx.beginPath();
    ctx.moveTo(-upperWidth/2, seg1);
    ctx.bezierCurveTo(
        -upperWidth/2, seg1 + seg2/3,
        -upperWidth/2, seg1 + seg2 * 2/3,
        -upperWidth * 0.8/2, seg1 + seg2
    );
    ctx.lineTo(upperWidth * 0.8/2, seg1 + seg2);
    ctx.bezierCurveTo(
        upperWidth/2, seg1 + seg2 * 2/3,
        upperWidth/2, seg1 + seg2/3,
        upperWidth/2, seg1
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.ellipse(0, length - width * 0.3, width * 0.4, width * 0.3, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffccd5';
    ctx.fill();
    ctx.strokeStyle = '#e6b8a0';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.strokeStyle = '#8b6f47';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#ffd7b5';
    
    ctx.restore();
}

function drawRealisticPalm(x, y, width, height){
    ctx.save();
    ctx.translate(x, y);
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, height/2);
    gradient.addColorStop(0, '#ffe4c4');
    gradient.addColorStop(0.7, '#ffd7b5');
    gradient.addColorStop(1, '#e6c8a0');
    
    ctx.beginPath();
    ctx.ellipse(0, 0, width/2, height/2, 0, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = '#8b6f47';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.save();
    ctx.strokeStyle = '#d4a574';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.6;
    
    ctx.beginPath();
    ctx.moveTo(-width/3, -height/4);
    ctx.quadraticCurveTo(0, -height/6, width/4, -height/5);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-width/3, height/10);
    ctx.quadraticCurveTo(0, height/5, width/3, height/4);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(-width/5, height/6, width/4, -Math.PI * 0.6, Math.PI * 0.3);
    ctx.stroke();
    
    ctx.restore();
    ctx.fillStyle = '#ffd7b5';
    ctx.restore();
}

function drawContactPoint(x, y, size = 14){
    ctx.save();
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, 'rgba(255, 50, 50, 0.9)');
    gradient.addColorStop(0.6, 'rgba(255, 100, 100, 0.7)');
    gradient.addColorStop(1, 'rgba(255, 150, 150, 0.3)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(x - 4, y - 4, size/4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(200, 0, 0, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
    
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
            drawRealisticPalm(0, 30, 120, 140);
            for(let i = 0; i < 4; i++){
                drawRealisticFinger(-35 + i * 23, -15, 30, 20, 0, true);
            }
            drawRealisticThumb(-70, 10, 55, 24, -0.2);
            break;
            
        case 'B':
            drawRealisticPalm(0, 40, 110, 150);
            drawRealisticFinger(-38, -80, 95, 20, 0);
            drawRealisticFinger(-13, -85, 100, 20, 0);
            drawRealisticFinger(12, -85, 98, 19, 0);
            drawRealisticFinger(35, -80, 90, 18, 0);
            drawRealisticThumb(-65, 25, 50, 22, 0);
            break;
            
        case 'C':
            drawRealisticPalm(0, 20, 100, 130);
            drawRealisticFinger(-35, -60, 85, 18, 0.3);
            drawRealisticFinger(-12, -70, 95, 19, 0.15);
            drawRealisticFinger(12, -70, 95, 19, -0.15);
            drawRealisticFinger(35, -60, 85, 18, -0.3);
            drawRealisticThumb(-55, -30, 60, 24, 0.5);
            break;
            
        case 'D':
            drawRealisticPalm(0, 40, 110, 140);
            drawRealisticFinger(0, -90, 105, 20, 0);
            drawRealisticThumb(-50, -10, 55, 22, 0.8);
            drawRealisticFinger(15, 10, 28, 20, 0, true);
            drawRealisticFinger(35, 15, 26, 18, 0.2, true);
            drawRealisticFinger(52, 20, 24, 16, 0.3, true);
            drawContactPoint(-20, 5, 14);
            ctx.fillStyle = '#667eea';
            ctx.font = '16px Arial';
            ctx.fillText('← Thumb touches middle finger', 60, 10);
            ctx.fillStyle = '#ffd7b5';
            break;
            
        case 'E':
            drawRealisticPalm(0, 35, 120, 140);
            for(let i = 0; i < 4; i++){
                drawRealisticFinger(-35 + i * 23, -20, 28, 20, 0, true);
            }
            ctx.save();
            ctx.translate(-55, -5);
            ctx.rotate(-0.3);
            ctx.beginPath();
            ctx.ellipse(0, 0, 22, 32, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            break;
            
        case 'F':
            drawRealisticPalm(0, 40, 110, 140);
            drawRealisticFinger(-12, -85, 100, 20, 0);
            drawRealisticFinger(12, -85, 98, 19, 0);
            drawRealisticFinger(35, -80, 90, 18, 0);
            drawRealisticThumb(-50, -30, 60, 24, 0.6);
            ctx.save();
            ctx.beginPath();
            ctx.arc(-38, -52, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            drawContactPoint(-38, -50, 14);
            ctx.fillStyle = '#667eea';
            ctx.font = '16px Arial';
            ctx.fillText('← Index & thumb touch', 10, -50);
            ctx.fillStyle = '#ffd7b5';
            break;
            
        case 'G':
            drawRealisticPalm(0, 30, 110, 140);
            drawRealisticFinger(-30, -20, 80, 18, 1.57);
            drawRealisticThumb(-55, -25, 60, 24, 0);
            for(let i = 1; i < 4; i++){
                drawRealisticFinger(-10 + i * 20, 15, 26, 18, 0, true);
            }
            break;
            
        case 'H':
            drawRealisticPalm(0, 40, 110, 140);
            drawRealisticFinger(-15, -20, 80, 18, 1.57);
            drawRealisticFinger(10, -20, 80, 18, 1.57);
            drawRealisticThumb(-60, -10, 55, 22, 0);
            drawRealisticFinger(40, 15, 24, 16, 0, true);
            drawRealisticFinger(58, 20, 22, 15, 0.2, true);
            break;
            
        case 'I':
            drawRealisticPalm(0, 35, 120, 140);
            drawRealisticFinger(45, -80, 85, 17, 0);
            for(let i = 0; i < 3; i++){
                drawRealisticFinger(-30 + i * 22, -10, 28, 20, 0, true);
            }
            drawRealisticThumb(-65, 15, 50, 22, -0.3);
            break;
            
        case 'J':
            drawRealisticPalm(0, 35, 120, 140);
            drawRealisticFinger(45, -80, 85, 17, 0);
            for(let i = 0; i < 3; i++){
                drawRealisticFinger(-30 + i * 22, -10, 28, 20, 0, true);
            }
            drawRealisticThumb(-65, 15, 50, 22, -0.3);
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(60, -40, 25, 0, Math.PI * 0.8);
            ctx.stroke();
            ctx.strokeStyle = '#8b6f47';
            ctx.lineWidth = 3;
            break;
            
        case 'K':
            drawRealisticPalm(0, 40, 110, 140);
            drawRealisticFinger(-10, -90, 105, 20, 0);
            drawRealisticFinger(15, -85, 100, 19, 0.2);
            drawRealisticThumb(-45, -30, 60, 24, 0.5);
            drawRealisticFinger(40, 15, 26, 18, 0, true);
            drawRealisticFinger(58, 20, 24, 16, 0.2, true);
            break;
            
        case 'L':
            drawRealisticPalm(0, 35, 120, 140);
            drawRealisticFinger(-25, -90, 100, 20, 0);
            drawRealisticThumb(-25, -90, 90, 22, 1.57);
            for(let i = 1; i < 4; i++){
                drawRealisticFinger(-5 + i * 22, 10, 28, 20, 0, true);
            }
            break;
            
        case 'M':
            drawRealisticPalm(0, 40, 120, 150);
            for(let i = 0; i < 3; i++){
                drawRealisticFinger(-30 + i * 25, -10, 30, 22, 0, true);
            }
            drawRealisticFinger(50, 5, 26, 20, 0.2, true);
            drawRealisticThumb(-60, 15, 50, 22, -0.3);
            break;
            
        case 'N':
            drawRealisticPalm(0, 40, 120, 150);
            for(let i = 0; i < 2; i++){
                drawRealisticFinger(-25 + i * 25, -10, 30, 22, 0, true);
            }
            drawRealisticFinger(30, 5, 26, 20, 0.2, true);
            drawRealisticFinger(50, 10, 26, 19, 0.3, true);
            drawRealisticThumb(-60, 15, 50, 22, -0.3);
            break;
            
        case 'O':
            drawRealisticPalm(0, 20, 100, 130);
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, -25, 50, 0, Math.PI * 2);
            ctx.lineWidth = 22;
            const gradient = ctx.createLinearGradient(-50, -25, 50, -25);
            gradient.addColorStop(0, '#ffd7b5');
            gradient.addColorStop(0.5, '#ffe4c4');
            gradient.addColorStop(1, '#ffd7b5');
            ctx.strokeStyle = gradient;
            ctx.stroke();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#8b6f47';
            ctx.stroke();
            ctx.restore();
            drawContactPoint(-35, -25, 12);
            drawContactPoint(35, -25, 12);
            ctx.fillStyle = '#667eea';
            ctx.font = '16px Arial';
            ctx.fillText('All fingertips touch thumb', 0, 40);
            ctx.fillStyle = '#ffd7b5';
            break;
            
        case 'P':
            drawRealisticPalm(0, 40, 110, 140);
            drawRealisticFinger(-10, -20, 80, 18, 1.3);
            drawRealisticThumb(-45, -30, 60, 24, 0.5);
            for(let i = 1; i < 4; i++){
                drawRealisticFinger(10 + i * 20, 15, 26, 18, 0, true);
            }
            break;
            
        case 'Q':
            drawRealisticPalm(0, 30, 110, 140);
            drawRealisticFinger(-30, 10, 80, 18, 1.8);
            drawRealisticThumb(-55, 5, 60, 24, 1.8);
            for(let i = 1; i < 4; i++){
                drawRealisticFinger(-10 + i * 20, 15, 26, 18, 0, true);
            }
            break;
            
        case 'R':
            drawRealisticPalm(0, 40, 110, 140);
            drawRealisticFinger(-15, -90, 100, 20, 0);
            drawRealisticFinger(10, -88, 98, 19, 0);
            ctx.save();
            ctx.strokeStyle = '#8b6f47';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-15, -30);
            ctx.lineTo(10, -40);
            ctx.stroke();
            ctx.restore();
            for(let i = 2; i < 4; i++){
                drawRealisticFinger(15 + i * 20, 15, 26, 18, 0, true);
            }
            drawRealisticThumb(-60, 20, 50, 22, -0.2);
            break;
            
        case 'S':
            drawRealisticPalm(0, 30, 120, 140);
            for(let i = 0; i < 4; i++){
                drawRealisticFinger(-35 + i * 23, -15, 28, 20, 0, true);
            }
            ctx.save();
            ctx.translate(-40, -15);
            ctx.rotate(-0.5);
            ctx.beginPath();
            ctx.ellipse(0, 0, 22, 28, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(0, -5, 10, 8, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#ffccd5';
            ctx.fill();
            ctx.fillStyle = '#ffd7b5';
            ctx.restore();
            break;
            
        case 'T':
            drawRealisticPalm(0, 40, 120, 150);
            drawRealisticFinger(-25, -10, 28, 22, 0, true);
            for(let i = 1; i < 4; i++){
                drawRealisticFinger(0 + i * 22, 5, 28, 20, 0, true);
            }
            ctx.save();
            ctx.translate(-45, -10);
            ctx.rotate(-0.5);
            ctx.beginPath();
            ctx.ellipse(0, 0, 18, 30, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            break;
            
        case 'U':
            drawRealisticPalm(0, 40, 110, 140);
            drawRealisticFinger(-15, -90, 100, 20, 0);
            drawRealisticFinger(10, -88, 98, 19, 0);
            for(let i = 2; i < 4; i++){
                drawRealisticFinger(15 + i * 20, 15, 26, 18, 0, true);
            }
            drawRealisticThumb(-60, 20, 50, 22, -0.2);
            break;
            
        case 'V':
            drawRealisticPalm(0, 40, 110, 140);
            drawRealisticFinger(-18, -90, 100, 20, -0.3);
            drawRealisticFinger(8, -90, 100, 20, 0.3);
            for(let i = 2; i < 4; i++){
                drawRealisticFinger(15 + i * 20, 15, 26, 18, 0, true);
            }
            drawRealisticThumb(-60, 20, 50, 22, -0.2);
            break;
            
        case 'W':
            drawRealisticPalm(0, 40, 110, 140);
            drawRealisticFinger(-25, -90, 95, 19, -0.3);
            drawRealisticFinger(-5, -92, 100, 20, 0);
            drawRealisticFinger(18, -90, 98, 19, 0.3);
            drawRealisticFinger(40, 15, 26, 18, 0.2, true);
            drawRealisticThumb(-60, 20, 50, 22, -0.2);
            break;
            
        case 'X':
            drawRealisticPalm(0, 35, 120, 140);
            ctx.save();
            ctx.translate(0, -50);
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.lineTo(-8, 40);
            ctx.bezierCurveTo(-8, 45, -5, 48, 0, 48);
            ctx.bezierCurveTo(5, 48, 8, 45, 8, 40);
            ctx.lineTo(8, 0);
            ctx.bezierCurveTo(8, -5, 5, -8, 0, -8);
            ctx.bezierCurveTo(-5, -8, -8, -5, -8, 0);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            for(let i = 0; i < 3; i++){
                drawRealisticFinger(-25 + i * 22, 0, 28, 20, 0, true);
            }
            drawRealisticFinger(40, 10, 26, 18, 0.2, true);
            drawRealisticThumb(-65, 15, 50, 22, -0.3);
            break;
            
        case 'Y':
            drawRealisticPalm(0, 35, 120, 140);
            drawRealisticFinger(45, -80, 85, 17, 0);
            for(let i = 0; i < 3; i++){
                drawRealisticFinger(-30 + i * 22, -10, 28, 20, 0, true);
            }
            drawRealisticThumb(-70, -20, 70, 24, 1.57);
            break;
            
        case 'Z':
            drawRealisticPalm(0, 35, 120, 140);
            drawRealisticFinger(0, -90, 105, 20, 0);
            for(let i = 1; i < 4; i++){
                drawRealisticFinger(-5 + i * 22, 10, 28, 20, 0, true);
            }
            drawRealisticThumb(-65, 15, 50, 22, -0.3);
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 5;
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
            drawRealisticPalm(0, 20, 100, 130);
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, -25, 50, 0, Math.PI * 2);
            ctx.lineWidth = 22;
            const gradient = ctx.createLinearGradient(-50, -25, 50, -25);
            gradient.addColorStop(0, '#ffd7b5');
            gradient.addColorStop(0.5, '#ffe4c4');
            gradient.addColorStop(1, '#ffd7b5');
            ctx.strokeStyle = gradient;
            ctx.stroke();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#8b6f47';
            ctx.stroke();
            ctx.restore();
            break;
        case 1:
            drawRealisticPalm(0, 35, 120, 140);
            drawRealisticFinger(0, -90, 105, 20, 0);
            for(let i = 1; i < 4; i++){
                drawRealisticFinger(-5 + i * 22, 10, 28, 20, 0, true);
            }
            drawRealisticThumb(-65, 15, 50, 22, -0.3);
            break;
        case 2:
            drawRealisticPalm(0, 40, 110, 140);
            drawRealisticFinger(-18, -90, 100, 20, -0.3);
            drawRealisticFinger(8, -90, 100, 20, 0.3);
            for(let i = 2; i < 4; i++){
                drawRealisticFinger(15 + i * 20, 15, 26, 18, 0, true);
            }
            drawRealisticThumb(-60, 20, 50, 22, -0.2);
            break;
        case 3:
            drawRealisticPalm(0, 40, 110, 140);
            drawRealisticFinger(-25, -90, 95, 19, -0.3);
            drawRealisticFinger(-5, -92, 100, 20, 0);
            drawRealisticFinger(18, -90, 98, 19, 0.3);
            drawRealisticFinger(40, 15, 26, 18, 0.2, true);
            drawRealisticThumb(-60, 20, 50, 22, -0.2);
            break;
        case 4:
            drawRealisticPalm(0, 40, 110, 150);
            drawRealisticFinger(-38, -80, 95, 20, 0);
            drawRealisticFinger(-13, -85, 100, 20, 0);
            drawRealisticFinger(12, -85, 98, 19, 0);
            drawRealisticFinger(35, -80, 90, 18, 0);
            drawRealisticThumb(-65, 25, 50, 22, 0);
            break;
        case 5:
            drawRealisticPalm(0, 40, 110, 150);
            drawRealisticFinger(-38, -80, 95, 20, 0);
            drawRealisticFinger(-13, -85, 100, 20, 0);
            drawRealisticFinger(12, -85, 98, 19, 0);
            drawRealisticFinger(35, -80, 90, 18, 0);
            drawRealisticThumb(-70, -20, 70, 24, 1.57);
            break;
        case 6:
            drawRealisticPalm(0, 40, 110, 150);
            drawRealisticFinger(-38, -80, 95, 20, 0);
            drawRealisticFinger(-13, -85, 100, 20, 0);
            drawRealisticFinger(12, -85, 98, 19, 0);
            drawRealisticFinger(35, 10, 28, 18, 0, true);
            drawRealisticThumb(-70, -20, 70, 24, 1.57);
            break;
        case 7:
            drawRealisticPalm(0, 40, 110, 150);
            drawRealisticFinger(-38, -80, 95, 20, 0);
            drawRealisticFinger(-13, -85, 100, 20, 0);
            drawRealisticFinger(12, 10, 28, 18, 0, true);
            drawRealisticFinger(35, 10, 28, 18, 0, true);
            drawRealisticThumb(-70, -20, 70, 24, 1.57);
            break;
        case 8:
            drawRealisticPalm(0, 40, 110, 150);
            drawRealisticFinger(-38, -80, 95, 20, 0);
            drawRealisticFinger(-13, 10, 28, 18, 0, true);
            drawRealisticFinger(12, 10, 28, 18, 0, true);
            drawRealisticFinger(35, 10, 28, 18, 0, true);
            drawRealisticThumb(-70, -20, 70, 24, 1.57);
            break;
        case 9:
            drawRealisticPalm(0, 40, 110, 150);
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, -20, 45, 0, Math.PI * 2);
            ctx.lineWidth = 20;
            ctx.strokeStyle = '#ffd7b5';
            ctx.stroke();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#8b6f47';
            ctx.stroke();
            ctx.restore();
            drawRealisticThumb(-70, -20, 70, 24, 1.57);
            break;
        default:
            ctx.font = '80px Arial';
            ctx.fillText('✋', 0, 20);
    }
    ctx.restore();
}

clearCanvas();