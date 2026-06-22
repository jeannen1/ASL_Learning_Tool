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
        ctx.scale(0.28, 0.28);
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

// HIGHLY DETAILED HAND DRAWING FUNCTIONS
function drawDetailedFinger(x, y, len, width, angle, curled = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    if(curled) {
        // Curled finger - cartoon style with outline
        ctx.fillStyle = '#e8b896';
        ctx.strokeStyle = '#8b6f47';
        ctx.lineWidth = 4;
        
        ctx.beginPath();
        ctx.arc(0, len * 0.35, width * 0.65, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Inner shadow for depth
        ctx.fillStyle = 'rgba(139, 111, 71, 0.2)';
        ctx.beginPath();
        ctx.arc(width * 0.15, len * 0.3, width * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Fingernail
        ctx.fillStyle = '#f5d5d5';
        ctx.strokeStyle = '#c9a0a0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(width * 0.25, len * 0.25, width * 0.28, width * 0.2, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
    } else {
        // Extended finger with segments
        const segments = 3;
        const segLen = len / segments;
        
        for(let i = 0; i < segments; i++) {
            const w = width * (1 - i * 0.1);
            const yPos = i * segLen;
            
            // Fill color with gradient effect
            const gradient = ctx.createLinearGradient(-w/2, yPos, w/2, yPos + segLen);
            gradient.addColorStop(0, '#e8b896');
            gradient.addColorStop(0.5, '#f0c8a8');
            gradient.addColorStop(1, '#e8b896');
            ctx.fillStyle = gradient;
            
            // Finger segment shape
            ctx.beginPath();
            ctx.moveTo(-w/2, yPos);
            ctx.bezierCurveTo(-w/2, yPos + segLen * 0.3, -w/2, yPos + segLen * 0.7, -w * 0.48/2, yPos + segLen);
            ctx.lineTo(w * 0.48/2, yPos + segLen);
            ctx.bezierCurveTo(w/2, yPos + segLen * 0.7, w/2, yPos + segLen * 0.3, w/2, yPos);
            ctx.closePath();
            ctx.fill();
            
            // Bold outline
            ctx.strokeStyle = '#8b6f47';
            ctx.lineWidth = 4;
            ctx.stroke();
            
            // Knuckle crease
            if(i > 0) {
                ctx.strokeStyle = '#6b4f37';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(0, yPos, w * 0.42, 0.2, Math.PI - 0.2);
                ctx.stroke();
                
                // Knuckle shadow
                ctx.fillStyle = 'rgba(107, 79, 55, 0.15)';
                ctx.beginPath();
                ctx.ellipse(0, yPos - 3, w * 0.35, 4, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Side shading for 3D effect
            ctx.fillStyle = 'rgba(139, 111, 71, 0.25)';
            ctx.beginPath();
            ctx.ellipse(-w * 0.35, yPos + segLen/2, w * 0.12, segLen * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Fingernail at tip
        ctx.fillStyle = '#f5d5d5';
        ctx.strokeStyle = '#c9a0a0';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, len - width * 0.32, width * 0.38, width * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Nail highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.ellipse(-width * 0.12, len - width * 0.38, width * 0.18, width * 0.12, -0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Nail moon (lunula)
        ctx.fillStyle = 'rgba(255, 240, 240, 0.8)';
        ctx.beginPath();
        ctx.ellipse(0, len - width * 0.15, width * 0.22, width * 0.12, 0, Math.PI, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

function drawDetailedThumb(x, y, len, width, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    const seg1Len = len * 0.56;
    const seg2Len = len * 0.44;
    
    // Lower thumb segment
    const grad1 = ctx.createLinearGradient(-width/2, 0, width/2, seg1Len);
    grad1.addColorStop(0, '#e8b896');
    grad1.addColorStop(0.5, '#f0c8a8');
    grad1.addColorStop(1, '#e8b896');
    ctx.fillStyle = grad1;
    
    ctx.beginPath();
    ctx.moveTo(-width/2, 0);
    ctx.bezierCurveTo(-width/2, seg1Len * 0.3, -width/2, seg1Len * 0.7, -width * 0.48/2, seg1Len);
    ctx.lineTo(width * 0.48/2, seg1Len);
    ctx.bezierCurveTo(width/2, seg1Len * 0.7, width/2, seg1Len * 0.3, width/2, 0);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#8b6f47';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Thumb knuckle
    ctx.strokeStyle = '#6b4f37';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, seg1Len, width * 0.4, 0.2, Math.PI - 0.2);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(107, 79, 55, 0.15)';
    ctx.beginPath();
    ctx.ellipse(0, seg1Len - 3, width * 0.32, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Upper thumb segment
    const w2 = width * 0.9;
    const grad2 = ctx.createLinearGradient(-w2/2, seg1Len, w2/2, len);
    grad2.addColorStop(0, '#e8b896');
    grad2.addColorStop(0.5, '#f0c8a8');
    grad2.addColorStop(1, '#e8b896');
    ctx.fillStyle = grad2;
    
    ctx.beginPath();
    ctx.moveTo(-w2/2, seg1Len);
    ctx.bezierCurveTo(-w2/2, seg1Len + seg2Len * 0.3, -w2/2, seg1Len + seg2Len * 0.7, -w2 * 0.87/2, len);
    ctx.lineTo(w2 * 0.87/2, len);
    ctx.bezierCurveTo(w2/2, seg1Len + seg2Len * 0.7, w2/2, seg1Len + seg2Len * 0.3, w2/2, seg1Len);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#8b6f47';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Side shading
    ctx.fillStyle = 'rgba(139, 111, 71, 0.25)';
    ctx.beginPath();
    ctx.ellipse(-w2 * 0.35, seg1Len + seg2Len/2, w2 * 0.12, seg2Len * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Thumbnail
    ctx.fillStyle = '#f5d5d5';
    ctx.strokeStyle = '#c9a0a0';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, len - width * 0.3, width * 0.42, width * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Nail highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.ellipse(-width * 0.14, len - width * 0.36, width * 0.2, width * 0.14, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function drawDetailedPalm(x, y, w, h) {
    ctx.save();
    ctx.translate(x, y);
    
    // Palm gradient
    const palmGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(w, h)/2);
    palmGrad.addColorStop(0, '#f0c8a8');
    palmGrad.addColorStop(0.4, '#e8b896');
    palmGrad.addColorStop(0.7, '#d4a076');
    palmGrad.addColorStop(1, '#c9956c');
    ctx.fillStyle = palmGrad;
    
    // Palm shape
    ctx.beginPath();
    ctx.ellipse(0, 0, w/2, h/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Bold outline
    ctx.strokeStyle = '#8b6f47';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Palm crease lines (darker and more visible)
    ctx.strokeStyle = '#7a5f3f';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    // Heart line
    ctx.beginPath();
    ctx.moveTo(-w/3, -h/5);
    ctx.quadraticCurveTo(-w/8, -h/7, w/5, -h/6);
    ctx.stroke();
    
    // Head line
    ctx.beginPath();
    ctx.moveTo(-w/3, h/10);
    ctx.quadraticCurveTo(0, h/6, w/3, h/5);
    ctx.stroke();
    
    // Life line
    ctx.beginPath();
    ctx.arc(-w/5, h/5, w/3.5, -Math.PI * 0.6, Math.PI * 0.3);
    ctx.stroke();
    
    // Thumb muscle shadow
    ctx.fillStyle = 'rgba(139, 111, 71, 0.25)';
    ctx.beginPath();
    ctx.ellipse(-w/4, h/6, w/5, h/4, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Palm shadow for depth
    ctx.fillStyle = 'rgba(139, 111, 71, 0.15)';
    ctx.beginPath();
    ctx.ellipse(w/6, h/4, w/6, h/5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function drawContactPoint(x, y, size = 18) {
    ctx.save();
    
    // Outer glow
    const outerGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 1.8);
    outerGrad.addColorStop(0, 'rgba(255, 50, 50, 0.8)');
    outerGrad.addColorStop(0.5, 'rgba(255, 80, 80, 0.4)');
    outerGrad.addColorStop(1, 'rgba(255, 120, 120, 0)');
    ctx.fillStyle = outerGrad;
    ctx.beginPath();
    ctx.arc(x, y, size * 1.8, 0, Math.PI * 2);
    ctx.fill();
    
    // Main contact dot
    const mainGrad = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, size);
    mainGrad.addColorStop(0, '#ff6060');
    mainGrad.addColorStop(0.7, '#ff3030');
    mainGrad.addColorStop(1, '#cc0000');
    ctx.fillStyle = mainGrad;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Bright highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
    
    // Bold outline
    ctx.strokeStyle = '#990000';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
}

function drawASLLetter(letter){
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.save();
    ctx.translate(cx, cy);
    
    // Letter label
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 52px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(letter, 0, -185);
    
    switch(letter){
        case 'A':
            drawDetailedPalm(0, 30, 120, 140);
            for(let i = 0; i < 4; i++){
                drawDetailedFinger(-35 + i * 23, -15, 32, 22, 0, true);
            }
            drawDetailedThumb(-72, 10, 58, 26, -0.2);
            break;
            
        case 'B':
            drawDetailedPalm(0, 40, 110, 150);
            drawDetailedFinger(-38, -85, 98, 22, 0);
            drawDetailedFinger(-13, -90, 103, 22, 0);
            drawDetailedFinger(12, -90, 101, 21, 0);
            drawDetailedFinger(35, -85, 93, 20, 0);
            drawDetailedThumb(-67, 25, 52, 24, 0);
            break;
            
        case 'C':
            drawDetailedPalm(0, 20, 100, 130);
            drawDetailedFinger(-35, -65, 88, 20, 0.35);
            drawDetailedFinger(-12, -75, 98, 21, 0.18);
            drawDetailedFinger(12, -75, 98, 21, -0.18);
            drawDetailedFinger(35, -65, 88, 20, -0.35);
            drawDetailedThumb(-58, -35, 63, 26, 0.55);
            break;
            
        case 'D':
            drawDetailedPalm(0, 40, 110, 140);
            drawDetailedFinger(0, -95, 108, 22, 0);
            drawDetailedThumb(-52, -12, 58, 24, 0.85);
            drawDetailedFinger(15, 8, 30, 22, 0, true);
            drawDetailedFinger(35, 13, 28, 20, 0.2, true);
            drawDetailedFinger(53, 18, 26, 18, 0.3, true);
            drawContactPoint(-22, 3, 16);
            ctx.fillStyle = '#667eea';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('← Thumb touches middle finger', 70, 5);
            break;
            
        case 'E':
            drawDetailedPalm(0, 35, 120, 140);
            for(let i = 0; i < 4; i++){
                drawDetailedFinger(-35 + i * 23, -22, 30, 22, 0, true);
            }
            ctx.save();
            ctx.translate(-58, -8);
            ctx.rotate(-0.35);
            const thumbGrad = ctx.createLinearGradient(-12, -16, 12, 16);
            thumbGrad.addColorStop(0, '#e8b896');
            thumbGrad.addColorStop(0.5, '#f0c8a8');
            thumbGrad.addColorStop(1, '#e8b896');
            ctx.fillStyle = thumbGrad;
            ctx.beginPath();
            ctx.ellipse(0, 0, 24, 34, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#8b6f47';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.restore();
            break;
            
        case 'F':
            drawDetailedPalm(0, 40, 110, 140);
            drawDetailedFinger(-12, -90, 103, 22, 0);
            drawDetailedFinger(12, -90, 101, 21, 0);
            drawDetailedFinger(35, -85, 93, 20, 0);
            drawDetailedThumb(-52, -35, 63, 26, 0.65);
            ctx.save();
            ctx.fillStyle = '#e8b896';
            ctx.strokeStyle = '#8b6f47';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(-40, -55, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            drawContactPoint(-40, -53, 15);
            ctx.fillStyle = '#667eea';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('← Index & thumb touch', 15, -53);
            break;
            
        case 'G':
            drawDetailedPalm(0, 30, 110, 140);
            drawDetailedFinger(-32, -25, 83, 20, 1.57);
            drawDetailedThumb(-58, -28, 63, 26, 0);
            for(let i = 1; i < 4; i++){
                drawDetailedFinger(-10 + i * 20, 13, 28, 20, 0, true);
            }
            break;
            
        case 'H':
            drawDetailedPalm(0, 40, 110, 140);
            drawDetailedFinger(-17, -25, 83, 20, 1.57);
            drawDetailedFinger(10, -25, 83, 20, 1.57);
            drawDetailedThumb(-62, -12, 58, 24, 0);
            drawDetailedFinger(42, 13, 26, 18, 0, true);
            drawDetailedFinger(60, 18, 24, 17, 0.2, true);
            break;
            
        case 'I':
            drawDetailedPalm(0, 35, 120, 140);
            drawDetailedFinger(47, -85, 88, 19, 0);
            for(let i = 0; i < 3; i++){
                drawDetailedFinger(-30 + i * 22, -12, 30, 22, 0, true);
            }
            drawDetailedThumb(-67, 13, 52, 24, -0.3);
            break;
            
        case 'J':
            drawDetailedPalm(0, 35, 120, 140);
            drawDetailedFinger(47, -85, 88, 19, 0);
            for(let i = 0; i < 3; i++){
                drawDetailedFinger(-30 + i * 22, -12, 30, 22, 0, true);
            }
            drawDetailedThumb(-67, 13, 52, 24, -0.3);
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(62, -45, 28, 0, Math.PI * 0.85);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(90, -45);
            ctx.lineTo(95, -42);
            ctx.stroke();
            break;
            
        case 'K':
            drawDetailedPalm(0, 40, 110, 140);
            drawDetailedFinger(-10, -95, 108, 22, 0);
            drawDetailedFinger(15, -90, 103, 21, 0.22);
            drawDetailedThumb(-47, -35, 63, 26, 0.55);
            drawDetailedFinger(42, 13, 28, 20, 0, true);
            drawDetailedFinger(60, 18, 26, 18, 0.2, true);
            break;
            
        case 'L':
            drawDetailedPalm(0, 35, 120, 140);
            drawDetailedFinger(-27, -95, 103, 22, 0);
            drawDetailedThumb(-27, -95, 93, 24, 1.57);
            for(let i = 1; i < 4; i++){
                drawDetailedFinger(-5 + i * 22, 8, 30, 22, 0, true);
            }
            break;
            
        case 'M':
            drawDetailedPalm(0, 40, 120, 150);
            for(let i = 0; i < 3; i++){
                drawDetailedFinger(-30 + i * 25, -12, 32, 24, 0, true);
            }
            drawDetailedFinger(52, 3, 28, 22, 0.2, true);
            drawDetailedThumb(-62, 13, 52, 24, -0.3);
            break;
            
        case 'N':
            drawDetailedPalm(0, 40, 120, 150);
            for(let i = 0; i < 2; i++){
                drawDetailedFinger(-25 + i * 25, -12, 32, 24, 0, true);
            }
            drawDetailedFinger(32, 3, 28, 22, 0.2, true);
            drawDetailedFinger(52, 8, 28, 21, 0.3, true);
            drawDetailedThumb(-62, 13, 52, 24, -0.3);
            break;
            
        case 'O':
            drawDetailedPalm(0, 20, 100, 130);
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, -28, 53, 0, Math.PI * 2);
            ctx.lineWidth = 24;
            const oGrad = ctx.createLinearGradient(-53, -28, 53, -28);
            oGrad.addColorStop(0, '#e8b896');
            oGrad.addColorStop(0.3, '#f0c8a8');
            oGrad.addColorStop(0.7, '#f0c8a8');
            oGrad.addColorStop(1, '#e8b896');
            ctx.strokeStyle = oGrad;
            ctx.stroke();
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#8b6f47';
            ctx.stroke();
            ctx.restore();
            drawContactPoint(-38, -28, 14);
            drawContactPoint(38, -28, 14);
            ctx.fillStyle = '#667eea';
            ctx.font = 'bold 15px Arial';
            ctx.fillText('All fingertips touch thumb', 0, 35);
            break;
            
        case 'P':
            drawDetailedPalm(0, 40, 110, 140);
            drawDetailedFinger(-12, -25, 83, 20, 1.35);
            drawDetailedThumb(-47, -35, 63, 26, 0.55);
            for(let i = 1; i < 4; i++){
                drawDetailedFinger(10 + i * 20, 13, 28, 20, 0, true);
            }
            break;
            
        case 'Q':
            drawDetailedPalm(0, 30, 110, 140);
            drawDetailedFinger(-32, 8, 83, 20, 1.85);
            drawDetailedThumb(-58, 3, 63, 26, 1.85);
            for(let i = 1; i < 4; i++){
                drawDetailedFinger(-10 + i * 20, 13, 28, 20, 0, true);
            }
            break;
            
        case 'R':
            drawDetailedPalm(0, 40, 110, 140);
            drawDetailedFinger(-17, -95, 103, 22, 0);
            drawDetailedFinger(10, -93, 101, 21, 0);
            ctx.save();
            ctx.strokeStyle = '#8b6f47';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-17, -35);
            ctx.lineTo(10, -45);
            ctx.stroke();
            ctx.restore();
            for(let i = 2; i < 4; i++){
                drawDetailedFinger(15 + i * 20, 13, 28, 20, 0, true);
            }
            drawDetailedThumb(-62, 18, 52, 24, -0.2);
            break;
            
        case 'S':
            drawDetailedPalm(0, 30, 120, 140);
            for(let i = 0; i < 4; i++){
                drawDetailedFinger(-35 + i * 23, -17, 30, 22, 0, true);
            }
            ctx.save();
            ctx.translate(-42, -17);
            ctx.rotate(-0.55);
            const sThumbGrad = ctx.createLinearGradient(-12, -14, 12, 14);
            sThumbGrad.addColorStop(0, '#e8b896');
            sThumbGrad.addColorStop(0.5, '#f0c8a8');
            sThumbGrad.addColorStop(1, '#e8b896');
            ctx.fillStyle = sThumbGrad;
            ctx.beginPath();
            ctx.ellipse(0, 0, 24, 30, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#8b6f47';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.fillStyle = '#f5d5d5';
            ctx.beginPath();
            ctx.ellipse(0, -8, 11, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            break;
            
        case 'T':
            drawDetailedPalm(0, 40, 120, 150);
            drawDetailedFinger(-27, -12, 30, 24, 0, true);
            for(let i = 1; i < 4; i++){
                drawDetailedFinger(0 + i * 22, 3, 30, 22, 0, true);
            }
            ctx.save();
            ctx.translate(-47, -12);
            ctx.rotate(-0.55);
            const tThumbGrad = ctx.createLinearGradient(-10, -15, 10, 15);
            tThumbGrad.addColorStop(0, '#e8b896');
            tThumbGrad.addColorStop(0.5, '#f0c8a8');
            tThumbGrad.addColorStop(1, '#e8b896');
            ctx.fillStyle = tThumbGrad;
            ctx.beginPath();
            ctx.ellipse(0, 0, 20, 32, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#8b6f47';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.restore();
            break;
            
        case 'U':
            drawDetailedPalm(0, 40, 110, 140);
            drawDetailedFinger(-17, -95, 103, 22, 0);
            drawDetailedFinger(10, -93, 101, 21, 0);
            for(let i = 2; i < 4; i++){
                drawDetailedFinger(15 + i * 20, 13, 28, 20, 0, true);
            }
            drawDetailedThumb(-62, 18, 52, 24, -0.2);
            break;
            
        case 'V':
            drawDetailedPalm(0, 40, 110, 140);
            drawDetailedFinger(-20, -95, 103, 22, -0.35);
            drawDetailedFinger(8, -95, 103, 22, 0.35);
            for(let i = 2; i < 4; i++){
                drawDetailedFinger(15 + i * 20, 13, 28, 20, 0, true);
            }
            drawDetailedThumb(-62, 18, 52, 24, -0.2);
            break;
            
        case 'W':
            drawDetailedPalm(0, 40, 110, 140);
            drawDetailedFinger(-27, -95, 98, 21, -0.35);
            drawDetailedFinger(-5, -97, 103, 22, 0);
            drawDetailedFinger(18, -95, 101, 21, 0.35);
            drawDetailedFinger(42, 13, 28, 20, 0.2, true);
            drawDetailedThumb(-62, 18, 52, 24, -0.2);
            break;
            
        case 'X':
            drawDetailedPalm(0, 35, 120, 140);
            ctx.save();
            ctx.translate(0, -55);
            const xGrad = ctx.createLinearGradient(-8, 0, 8, 50);
            xGrad.addColorStop(0, '#e8b896');
            xGrad.addColorStop(0.5, '#f0c8a8');
            xGrad.addColorStop(1, '#e8b896');
            ctx.fillStyle = xGrad;
            ctx.beginPath();
            ctx.moveTo(-9, 0);
            ctx.lineTo(-9, 42);
            ctx.bezierCurveTo(-9, 47, -6, 50, 0, 50);
            ctx.bezierCurveTo(6, 50, 9, 47, 9, 42);
            ctx.lineTo(9, 0);
            ctx.bezierCurveTo(9, -5, 6, -9, 0, -9);
            ctx.bezierCurveTo(-6, -9, -9, -5, -9, 0);
            ctx.fill();
            ctx.strokeStyle = '#8b6f47';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.restore();
            for(let i = 0; i < 3; i++){
                drawDetailedFinger(-27 + i * 22, -2, 30, 22, 0, true);
            }
            drawDetailedFinger(42, 8, 28, 20, 0.2, true);
            drawDetailedThumb(-67, 13, 52, 24, -0.3);
            break;
            
        case 'Y':
            drawDetailedPalm(0, 35, 120, 140);
            drawDetailedFinger(47, -85, 88, 19, 0);
            for(let i = 0; i < 3; i++){
                drawDetailedFinger(-30 + i * 22, -12, 30, 22, 0, true);
            }
            drawDetailedThumb(-72, -25, 73, 26, 1.57);
            break;
            
        case 'Z':
            drawDetailedPalm(0, 35, 120, 140);
            drawDetailedFinger(0, -95, 108, 22, 0);
            for(let i = 1; i < 4; i++){
                drawDetailedFinger(-5 + i * 22, 8, 30, 22, 0, true);
            }
            drawDetailedThumb(-67, 13, 52, 24, -0.3);
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 7;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'miter';
            ctx.beginPath();
            ctx.moveTo(-22, -95);
            ctx.lineTo(22, -95);
            ctx.lineTo(-22, -55);
            ctx.lineTo(22, -55);
            ctx.stroke();
            break;
            
        default:
            ctx.font = 'bold 90px Arial';
            ctx.fillStyle = '#e8b896';
            ctx.strokeStyle = '#8b6f47';
            ctx.lineWidth = 4;
            ctx.fillText('✋', 0, 30);
            ctx.strokeText('✋', 0, 30);
    }
    ctx.restore();
}

function drawASLNumber(num){
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 52px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(num.toString(), 0, -185);
    
    switch(num){
        case 0:
            drawDetailedPalm(0, 20, 100, 130);
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, -28, 53, 0, Math.PI * 2);
            ctx.lineWidth = 24;
            const zeroGrad = ctx.createLinearGradient(-53, -28, 53, -28);
            zeroGrad.addColorStop(0, '#e8b896');
            zeroGrad.addColorStop(0.3, '#f0c8a8');
            zeroGrad.addColorStop(0.7, '#f0c8a8');
            zeroGrad.addColorStop(1, '#e8b896');
            ctx.strokeStyle = zeroGrad;
            ctx.stroke();
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#8b6f47';
            ctx.stroke();
            ctx.restore();
            break;
        case 1:
            drawDetailedPalm(0, 35, 120, 140);
            drawDetailedFinger(0, -95, 108, 22, 0);
            for(let i = 1; i < 4; i++){
                drawDetailedFinger(-5 + i * 22, 8, 30, 22, 0, true);
            }
            drawDetailedThumb(-67, 13, 52, 24, -0.3);
            break;
        case 2:
            drawDetailedPalm(0, 40, 110, 140);
            drawDetailedFinger(-20, -95, 103, 22, -0.35);
            drawDetailedFinger(8, -95, 103, 22, 0.35);
            for(let i = 2; i < 4; i++){
                drawDetailedFinger(15 + i * 20, 13, 28, 20, 0, true);
            }
            drawDetailedThumb(-62, 18, 52, 24, -0.2);
            break;
        case 3:
            drawDetailedPalm(0, 40, 110, 140);
            drawDetailedFinger(-27, -95, 98, 21, -0.35);
            drawDetailedFinger(-5, -97, 103, 22, 0);
            drawDetailedFinger(18, -95, 101, 21, 0.35);
            drawDetailedFinger(42, 13, 28, 20, 0.2, true);
            drawDetailedThumb(-62, 18, 52, 24, -0.2);
            break;
        case 4:
            drawDetailedPalm(0, 40, 110, 150);
            drawDetailedFinger(-38, -85, 98, 22, 0);
            drawDetailedFinger(-13, -90, 103, 22, 0);
            drawDetailedFinger(12, -90, 101, 21, 0);
            drawDetailedFinger(35, -85, 93, 20, 0);
            drawDetailedThumb(-67, 25, 52, 24, 0);
            break;
        case 5:
            drawDetailedPalm(0, 40, 110, 150);
            drawDetailedFinger(-38, -85, 98, 22, 0);
            drawDetailedFinger(-13, -90, 103, 22, 0);
            drawDetailedFinger(12, -90, 101, 21, 0);
            drawDetailedFinger(35, -85, 93, 20, 0);
            drawDetailedThumb(-72, -25, 73, 26, 1.57);
            break;
        case 6:
            drawDetailedPalm(0, 40, 110, 150);
            drawDetailedFinger(-38, -85, 98, 22, 0);
            drawDetailedFinger(-13, -90, 103, 22, 0);
            drawDetailedFinger(12, -90, 101, 21, 0);
            drawDetailedFinger(35, 8, 30, 20, 0, true);
            drawDetailedThumb(-72, -25, 73, 26, 1.57);
            break;
        case 7:
            drawDetailedPalm(0, 40, 110, 150);
            drawDetailedFinger(-38, -85, 98, 22, 0);
            drawDetailedFinger(-13, -90, 103, 22, 0);
            drawDetailedFinger(12, 8, 30, 20, 0, true);
            drawDetailedFinger(35, 8, 30, 20, 0, true);
            drawDetailedThumb(-72, -25, 73, 26, 1.57);
            break;
        case 8:
            drawDetailedPalm(0, 40, 110, 150);
            drawDetailedFinger(-38, -85, 98, 22, 0);
            drawDetailedFinger(-13, 8, 30, 20, 0, true);
            drawDetailedFinger(12, 8, 30, 20, 0, true);
            drawDetailedFinger(35, 8, 30, 20, 0, true);
            drawDetailedThumb(-72, -25, 73, 26, 1.57);
            break;
        case 9:
            drawDetailedPalm(0, 40, 110, 150);
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, -23, 48, 0, Math.PI * 2);
            ctx.lineWidth = 22;
            const nineGrad = ctx.createLinearGradient(-48, -23, 48, -23);
            nineGrad.addColorStop(0, '#e8b896');
            nineGrad.addColorStop(0.5, '#f0c8a8');
            nineGrad.addColorStop(1, '#e8b896');
            ctx.strokeStyle = nineGrad;
            ctx.stroke();
            ctx.lineWidth = 4;
            ctx.strokeStyle = '#8b6f47';
            ctx.stroke();
            ctx.restore();
            drawDetailedThumb(-72, -25, 73, 26, 1.57);
            break;
        default:
            ctx.font = 'bold 90px Arial';
            ctx.fillStyle = '#e8b896';
            ctx.strokeStyle = '#8b6f47';
            ctx.lineWidth = 4;
            ctx.fillText('✋', 0, 30);
            ctx.strokeText('✋', 0, 30);
    }
    ctx.restore();
}

clearCanvas();