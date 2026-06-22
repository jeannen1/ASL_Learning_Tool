const canvas = document.getElementById('signCanvas');
const ctx = canvas.getContext('2d');
const alphabetGrid = document.getElementById('alphabetGrid');
const wordInput = document.getElementById('wordInput');
const errorMessage = document.getElementById('errorMessage');
const currentWord = document.getElementById('currentWord');
const animationControls = document.getElementById('animationControls');
const animationSlider = document.getElementById('animationSlider');
const replayBtn = document.getElementById('replayBtn');

const profanityList = ['damn','hell','shit','fuck','bitch','ass','bastard','crap','piss','dick','cock','pussy','slut','whore','cunt','fag','nigger','nigga'];

let currentLetter = null;
let currentNumber = null;
let animationProgress = 0;
let isAnimating = false;
let animationFrame = null;

// Create alphabet buttons
for(let i = 65; i <= 90; i++){
    const letter = String.fromCharCode(i);
    const btn = document.createElement('button');
    btn.className = 'letter-btn';
    btn.textContent = letter;
    btn.onclick = () => showLetterSign(letter);
    alphabetGrid.appendChild(btn);
}

// Create number buttons
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

// Animation slider control
animationSlider.addEventListener('input', function(e){
    if(isAnimating) {
        cancelAnimationFrame(animationFrame);
        isAnimating = false;
    }
    animationProgress = parseFloat(e.target.value) / 100;
    if(currentLetter) {
        drawAnimatedLetter(currentLetter, animationProgress);
    } else if(currentNumber !== null) {
        drawAnimatedNumber(currentNumber, animationProgress);
    }
});

// Replay button
replayBtn.addEventListener('click', function(){
    startAnimation();
});

function clearCanvas(){
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function showLetterSign(letter){
    clearCanvas();
    currentWord.textContent = `Letter: ${letter}`;
    errorMessage.textContent = '';
    currentLetter = letter;
    currentNumber = null;
    
    document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.textContent === letter) btn.classList.add('active');
    });
    
    animationControls.style.display = 'block';
    startAnimation();
}

function showNumberSign(number){
    clearCanvas();
    currentWord.textContent = `Number: ${number}`;
    errorMessage.textContent = '';
    currentNumber = number;
    currentLetter = null;
    
    document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.textContent == number) btn.classList.add('active');
    });
    
    animationControls.style.display = 'block';
    startAnimation();
}

function startAnimation(){
    if(isAnimating) {
        cancelAnimationFrame(animationFrame);
    }
    
    animationProgress = 0;
    animationSlider.value = 0;
    isAnimating = true;
    
    const duration = 3000; // 3 seconds
    const startTime = Date.now();
    
    function animate(){
        const elapsed = Date.now() - startTime;
        animationProgress = Math.min(elapsed / duration, 1);
        animationSlider.value = animationProgress * 100;
        
        if(currentLetter) {
            drawAnimatedLetter(currentLetter, animationProgress);
        } else if(currentNumber !== null) {
            drawAnimatedNumber(currentNumber, animationProgress);
        }
        
        if(animationProgress < 1) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            isAnimating = false;
        }
    }
    
    animate();
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
    animationControls.style.display = 'none';
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
            drawAnimatedLetter(char.toUpperCase(), 1);
        } else if(/[0-9]/.test(char)){
            drawAnimatedNumber(parseInt(char), 1);
        }
        ctx.restore();
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(char, startX + index * spacing, y + 100);
    });
}

// Easing function for smooth animation
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Interpolate between two values
function lerp(start, end, progress) {
    return start + (end - start) * easeInOutCubic(progress);
}

// Draw detailed finger with animation
function drawAnimatedFinger(x, y, startLen, endLen, width, startAngle, endAngle, curled = false, progress = 1) {
    const len = lerp(startLen, endLen, progress);
    const angle = lerp(startAngle, endAngle, progress);
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    if(curled) {
        const curlProgress = lerp(0, 1, progress);
        ctx.fillStyle = '#e8b896';
        ctx.strokeStyle = '#8b6f47';
        ctx.lineWidth = 4;
        
        ctx.beginPath();
        ctx.arc(0, len * 0.35, width * 0.65 * curlProgress, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(139, 111, 71, 0.2)';
        ctx.beginPath();
        ctx.arc(width * 0.15, len * 0.3, width * 0.4 * curlProgress, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#f5d5d5';
        ctx.strokeStyle = '#c9a0a0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(width * 0.25, len * 0.25, width * 0.28, width * 0.2, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    } else {
        const segments = 3;
        const segLen = len / segments;
        
        for(let i = 0; i < segments; i++) {
            const w = width * (1 - i * 0.1);
            const yPos = i * segLen;
            
            const gradient = ctx.createLinearGradient(-w/2, yPos, w/2, yPos + segLen);
            gradient.addColorStop(0, '#e8b896');
            gradient.addColorStop(0.5, '#f0c8a8');
            gradient.addColorStop(1, '#e8b896');
            ctx.fillStyle = gradient;
            
            ctx.beginPath();
            ctx.moveTo(-w/2, yPos);
            ctx.bezierCurveTo(-w/2, yPos + segLen * 0.3, -w/2, yPos + segLen * 0.7, -w * 0.48/2, yPos + segLen);
            ctx.lineTo(w * 0.48/2, yPos + segLen);
            ctx.bezierCurveTo(w/2, yPos + segLen * 0.7, w/2, yPos + segLen * 0.3, w/2, yPos);
            ctx.closePath();
            ctx.fill();
            
            ctx.strokeStyle = '#8b6f47';
            ctx.lineWidth = 4;
            ctx.stroke();
            
            if(i > 0) {
                ctx.strokeStyle = '#6b4f37';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(0, yPos, w * 0.42, 0.2, Math.PI - 0.2);
                ctx.stroke();
                
                ctx.fillStyle = 'rgba(107, 79, 55, 0.15)';
                ctx.beginPath();
                ctx.ellipse(0, yPos - 3, w * 0.35, 4, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.fillStyle = 'rgba(139, 111, 71, 0.25)';
            ctx.beginPath();
            ctx.ellipse(-w * 0.35, yPos + segLen/2, w * 0.12, segLen * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.fillStyle = '#f5d5d5';
        ctx.strokeStyle = '#c9a0a0';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(0, len - width * 0.32, width * 0.38, width * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.ellipse(-width * 0.12, len - width * 0.38, width * 0.18, width * 0.12, -0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 240, 240, 0.8)';
        ctx.beginPath();
        ctx.ellipse(0, len - width * 0.15, width * 0.22, width * 0.12, 0, Math.PI, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

function drawAnimatedThumb(x, y, startLen, endLen, width, startAngle, endAngle, progress = 1) {
    const len = lerp(startLen, endLen, progress);
    const angle = lerp(startAngle, endAngle, progress);
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    const seg1Len = len * 0.56;
    const seg2Len = len * 0.44;
    
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
    
    ctx.strokeStyle = '#6b4f37';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, seg1Len, width * 0.4, 0.2, Math.PI - 0.2);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(107, 79, 55, 0.15)';
    ctx.beginPath();
    ctx.ellipse(0, seg1Len - 3, width * 0.32, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
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
    
    ctx.fillStyle = 'rgba(139, 111, 71, 0.25)';
    ctx.beginPath();
    ctx.ellipse(-w2 * 0.35, seg1Len + seg2Len/2, w2 * 0.12, seg2Len * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#f5d5d5';
    ctx.strokeStyle = '#c9a0a0';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, len - width * 0.3, width * 0.42, width * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.ellipse(-width * 0.14, len - width * 0.36, width * 0.2, width * 0.14, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function drawDetailedPalm(x, y, w, h) {
    ctx.save();
    ctx.translate(x, y);
    
    const palmGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(w, h)/2);
    palmGrad.addColorStop(0, '#f0c8a8');
    palmGrad.addColorStop(0.4, '#e8b896');
    palmGrad.addColorStop(0.7, '#d4a076');
    palmGrad.addColorStop(1, '#c9956c');
    ctx.fillStyle = palmGrad;
    
    ctx.beginPath();
    ctx.ellipse(0, 0, w/2, h/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#8b6f47';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.strokeStyle = '#7a5f3f';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(-w/3, -h/5);
    ctx.quadraticCurveTo(-w/8, -h/7, w/5, -h/6);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-w/3, h/10);
    ctx.quadraticCurveTo(0, h/6, w/3, h/5);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(-w/5, h/5, w/3.5, -Math.PI * 0.6, Math.PI * 0.3);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(139, 111, 71, 0.25)';
    ctx.beginPath();
    ctx.ellipse(-w/4, h/6, w/5, h/4, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(139, 111, 71, 0.15)';
    ctx.beginPath();
    ctx.ellipse(w/6, h/4, w/6, h/5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

function drawContactPoint(x, y, size = 18, progress = 1) {
    if(progress < 0.8) return; // Only show contact point near end of animation
    
    const opacity = (progress - 0.8) / 0.2; // Fade in during last 20%
    
    ctx.save();
    ctx.globalAlpha = opacity;
    
    const outerGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 1.8);
    outerGrad.addColorStop(0, 'rgba(255, 50, 50, 0.8)');
    outerGrad.addColorStop(0.5, 'rgba(255, 80, 80, 0.4)');
    outerGrad.addColorStop(1, 'rgba(255, 120, 120, 0)');
    ctx.fillStyle = outerGrad;
    ctx.beginPath();
    ctx.arc(x, y, size * 1.8, 0, Math.PI * 2);
    ctx.fill();
    
    const mainGrad = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, size);
    mainGrad.addColorStop(0, '#ff6060');
    mainGrad.addColorStop(0.7, '#ff3030');
    mainGrad.addColorStop(1, '#cc0000');
    ctx.fillStyle = mainGrad;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(x - 5, y - 5, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#990000';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
}

function drawAnimatedLetter(letter, progress){
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    clearCanvas();
    
    ctx.save();
    ctx.translate(cx, cy);
    
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 52px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(letter, 0, -185);
    
    drawDetailedPalm(0, 30, 120, 140);
    
    // Open hand starting positions (all fingers extended)
    const openFingerLen = 100;
    const openAngle = 0;
    
    switch(letter){
        case 'A':
            // Fingers curl down, thumb stays on side
            for(let i = 0; i < 4; i++){
                drawAnimatedFinger(-35 + i * 23, -15, openFingerLen, 32, 22, openAngle, 0, true, progress);
            }
            drawAnimatedThumb(-72, 10, 70, 58, 26, -0.2, -0.2, progress);
            break;
            
        case 'B':
            // All fingers stay up, thumb moves across
            drawAnimatedFinger(-38, -85, openFingerLen, 98, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(-13, -90, openFingerLen, 103, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(12, -90, openFingerLen, 101, 21, openAngle, 0, false, progress);
            drawAnimatedFinger(35, -85, openFingerLen, 93, 20, openAngle, 0, false, progress);
            drawAnimatedThumb(-67, 25, 70, 52, 24, -0.5, 0, progress);
            break;
            
        case 'C':
            // Fingers curve to form C
            drawAnimatedFinger(-35, -65, openFingerLen, 88, 20, openAngle, 0.35, false, progress);
            drawAnimatedFinger(-12, -75, openFingerLen, 98, 21, openAngle, 0.18, false, progress);
            drawAnimatedFinger(12, -75, openFingerLen, 98, 21, openAngle, -0.18, false, progress);
            drawAnimatedFinger(35, -65, openFingerLen, 88, 20, openAngle, -0.35, false, progress);
            drawAnimatedThumb(-58, -35, 70, 63, 26, -0.2, 0.55, progress);
            break;
            
        case 'D':
            // Index up, others curl, thumb moves to touch middle
            drawAnimatedFinger(0, -95, openFingerLen, 108, 22, openAngle, 0, false, progress);
            drawAnimatedThumb(-52, -12, 70, 58, 24, -0.2, 0.85, progress);
            drawAnimatedFinger(15, 8, openFingerLen, 30, 22, openAngle, 0, true, progress);
            drawAnimatedFinger(35, 13, openFingerLen, 28, 20, openAngle, 0.2, true, progress);
            drawAnimatedFinger(53, 18, openFingerLen, 26, 18, openAngle, 0.3, true, progress);
            drawContactPoint(-22, 3, 16, progress);
            if(progress > 0.8) {
                ctx.fillStyle = '#667eea';
                ctx.font = 'bold 16px Arial';
                ctx.globalAlpha = (progress - 0.8) / 0.2;
                ctx.fillText('← Thumb touches middle finger', 70, 5);
                ctx.globalAlpha = 1;
            }
            break;
            
        case 'E':
            // All fingers curl tight, thumb wraps over
            for(let i = 0; i < 4; i++){
                drawAnimatedFinger(-35 + i * 23, -22, openFingerLen, 30, 22, openAngle, 0, true, progress);
            }
            ctx.save();
            const thumbX = lerp(-58, -58, progress);
            const thumbY = lerp(-30, -8, progress);
            const thumbAngle = lerp(-0.1, -0.35, progress);
            ctx.translate(thumbX, thumbY);
            ctx.rotate(thumbAngle);
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
            // Index and thumb form circle, others up
            drawAnimatedFinger(-12, -90, openFingerLen, 103, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(12, -90, openFingerLen, 101, 21, openAngle, 0, false, progress);
            drawAnimatedFinger(35, -85, openFingerLen, 93, 20, openAngle, 0, false, progress);
            drawAnimatedThumb(-52, -35, 70, 63, 26, -0.2, 0.65, progress);
            if(progress > 0.5) {
                ctx.save();
                ctx.fillStyle = '#e8b896';
                ctx.strokeStyle = '#8b6f47';
                ctx.lineWidth = 4;
                ctx.globalAlpha = (progress - 0.5) / 0.5;
                ctx.beginPath();
                ctx.arc(-40, -55, 20, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
            drawContactPoint(-40, -53, 15, progress);
            if(progress > 0.8) {
                ctx.fillStyle = '#667eea';
                ctx.font = 'bold 16px Arial';
                ctx.globalAlpha = (progress - 0.8) / 0.2;
                ctx.fillText('← Index & thumb touch', 15, -53);
                ctx.globalAlpha = 1;
            }
            break;
            
        case 'G':
            // Index points sideways, thumb opposite
            drawAnimatedFinger(-32, -25, openFingerLen, 83, 20, openAngle, 1.57, false, progress);
            drawAnimatedThumb(-58, -28, 70, 63, 26, -0.2, 0, progress);
            for(let i = 1; i < 4; i++){
                drawAnimatedFinger(-10 + i * 20, 13, openFingerLen, 28, 20, openAngle, 0, true, progress);
            }
            break;
            
        case 'H':
            // Index and middle point sideways
            drawAnimatedFinger(-17, -25, openFingerLen, 83, 20, openAngle, 1.57, false, progress);
            drawAnimatedFinger(10, -25, openFingerLen, 83, 20, openAngle, 1.57, false, progress);
            drawAnimatedThumb(-62, -12, 70, 58, 24, -0.2, 0, progress);
            drawAnimatedFinger(42, 13, openFingerLen, 26, 18, openAngle, 0, true, progress);
            drawAnimatedFinger(60, 18, openFingerLen, 24, 17, openAngle, 0.2, true, progress);
            break;
            
        case 'I':
            // Pinky up, others curl
            drawAnimatedFinger(47, -85, openFingerLen, 88, 19, openAngle, 0, false, progress);
            for(let i = 0; i < 3; i++){
                drawAnimatedFinger(-30 + i * 22, -12, openFingerLen, 30, 22, openAngle, 0, true, progress);
            }
            drawAnimatedThumb(-67, 13, 70, 52, 24, -0.5, -0.3, progress);
            break;
            
        case 'J':
            // Same as I but with motion indicator
            drawAnimatedFinger(47, -85, openFingerLen, 88, 19, openAngle, 0, false, progress);
            for(let i = 0; i < 3; i++){
                drawAnimatedFinger(-30 + i * 22, -12, openFingerLen, 30, 22, openAngle, 0, true, progress);
            }
            drawAnimatedThumb(-67, 13, 70, 52, 24, -0.5, -0.3, progress);
            if(progress > 0.7) {
                ctx.strokeStyle = '#667eea';
                ctx.lineWidth = 6;
                ctx.lineCap = 'round';
                ctx.globalAlpha = (progress - 0.7) / 0.3;
                ctx.beginPath();
                ctx.arc(62, -45, 28, 0, Math.PI * 0.85);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(90, -45);
                ctx.lineTo(95, -42);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
            break;
            
        case 'K':
            // Index and middle up at angle, thumb between
            drawAnimatedFinger(-10, -95, openFingerLen, 108, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(15, -90, openFingerLen, 103, 21, openAngle, 0.22, false, progress);
            drawAnimatedThumb(-47, -35, 70, 63, 26, -0.2, 0.55, progress);
            drawAnimatedFinger(42, 13, openFingerLen, 28, 20, openAngle, 0, true, progress);
            drawAnimatedFinger(60, 18, openFingerLen, 26, 18, openAngle, 0.2, true, progress);
            break;
            
        case 'L':
            // Index and thumb form L
            drawAnimatedFinger(-27, -95, openFingerLen, 103, 22, openAngle, 0, false, progress);
            drawAnimatedThumb(-27, -95, 70, 93, 24, -0.2, 1.57, progress);
            for(let i = 1; i < 4; i++){
                drawAnimatedFinger(-5 + i * 22, 8, openFingerLen, 30, 22, openAngle, 0, true, progress);
            }
            break;
            
        case 'M':
            // Three fingers curl over thumb
            for(let i = 0; i < 3; i++){
                drawAnimatedFinger(-30 + i * 25, -12, openFingerLen, 32, 24, openAngle, 0, true, progress);
            }
            drawAnimatedFinger(52, 3, openFingerLen, 28, 22, openAngle, 0.2, true, progress);
            drawAnimatedThumb(-62, 13, 70, 52, 24, -0.5, -0.3, progress);
            break;
            
        case 'N':
            // Two fingers curl over thumb
            for(let i = 0; i < 2; i++){
                drawAnimatedFinger(-25 + i * 25, -12, openFingerLen, 32, 24, openAngle, 0, true, progress);
            }
            drawAnimatedFinger(32, 3, openFingerLen, 28, 22, openAngle, 0.2, true, progress);
            drawAnimatedFinger(52, 8, openFingerLen, 28, 21, openAngle, 0.3, true, progress);
            drawAnimatedThumb(-62, 13, 70, 52, 24, -0.5, -0.3, progress);
            break;
            
        case 'O':
            // All fingertips touch thumb in circle
            if(progress > 0.5) {
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
                ctx.globalAlpha = (progress - 0.5) / 0.5;
                ctx.stroke();
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#8b6f47';
                ctx.stroke();
                ctx.restore();
            }
            drawContactPoint(-38, -28, 14, progress);
            drawContactPoint(38, -28, 14, progress);
            if(progress > 0.8) {
                ctx.fillStyle = '#667eea';
                ctx.font = 'bold 15px Arial';
                ctx.globalAlpha = (progress - 0.8) / 0.2;
                ctx.fillText('All fingertips touch thumb', 0, 35);
                ctx.globalAlpha = 1;
            }
            break;
            
        case 'P':
            // Index points down at angle
            drawAnimatedFinger(-12, -25, openFingerLen, 83, 20, openAngle, 1.35, false, progress);
            drawAnimatedThumb(-47, -35, 70, 63, 26, -0.2, 0.55, progress);
            for(let i = 1; i < 4; i++){
                drawAnimatedFinger(10 + i * 20, 13, openFingerLen, 28, 20, openAngle, 0, true, progress);
            }
            break;
            
        case 'Q':
            // Index and thumb point down
            drawAnimatedFinger(-32, 8, openFingerLen, 83, 20, openAngle, 1.85, false, progress);
            drawAnimatedThumb(-58, 3, 70, 63, 26, -0.2, 1.85, progress);
            for(let i = 1; i < 4; i++){
                drawAnimatedFinger(-10 + i * 20, 13, openFingerLen, 28, 20, openAngle, 0, true, progress);
            }
            break;
            
        case 'R':
            // Index and middle crossed
            drawAnimatedFinger(-17, -95, openFingerLen, 103, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(10, -93, openFingerLen, 101, 21, openAngle, 0, false, progress);
            if(progress > 0.6) {
                ctx.save();
                ctx.strokeStyle = '#8b6f47';
                ctx.lineWidth = 5;
                ctx.lineCap = 'round';
                ctx.globalAlpha = (progress - 0.6) / 0.4;
                ctx.beginPath();
                ctx.moveTo(-17, -35);
                ctx.lineTo(10, -45);
                ctx.stroke();
                ctx.restore();
            }
            for(let i = 2; i < 4; i++){
                drawAnimatedFinger(15 + i * 20, 13, openFingerLen, 28, 20, openAngle, 0, true, progress);
            }
            drawAnimatedThumb(-62, 18, 70, 52, 24, -0.5, -0.2, progress);
            break;
            
        case 'S':
            // Fist with thumb over fingers
            for(let i = 0; i < 4; i++){
                drawAnimatedFinger(-35 + i * 23, -17, openFingerLen, 30, 22, openAngle, 0, true, progress);
            }
            ctx.save();
            const sThumbX = lerp(-42, -42, progress);
            const sThumbY = lerp(-40, -17, progress);
            const sThumbRot = lerp(-0.2, -0.55, progress);
            ctx.translate(sThumbX, sThumbY);
            ctx.rotate(sThumbRot);
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
            // Thumb between index and middle
            drawAnimatedFinger(-27, -12, openFingerLen, 30, 24, openAngle, 0, true, progress);
            for(let i = 1; i < 4; i++){
                drawAnimatedFinger(0 + i * 22, 3, openFingerLen, 30, 22, openAngle, 0, true, progress);
            }
            ctx.save();
            const tThumbX = lerp(-47, -47, progress);
            const tThumbY = lerp(-35, -12, progress);
            const tThumbRot = lerp(-0.2, -0.55, progress);
            ctx.translate(tThumbX, tThumbY);
            ctx.rotate(tThumbRot);
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
            // Index and middle together pointing up
            drawAnimatedFinger(-17, -95, openFingerLen, 103, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(10, -93, openFingerLen, 101, 21, openAngle, 0, false, progress);
            for(let i = 2; i < 4; i++){
                drawAnimatedFinger(15 + i * 20, 13, openFingerLen, 28, 20, openAngle, 0, true, progress);
            }
            drawAnimatedThumb(-62, 18, 70, 52, 24, -0.5, -0.2, progress);
            break;
            
        case 'V':
            // Index and middle form V
            drawAnimatedFinger(-20, -95, openFingerLen, 103, 22, openAngle, -0.35, false, progress);
            drawAnimatedFinger(8, -95, openFingerLen, 103, 22, openAngle, 0.35, false, progress);
            for(let i = 2; i < 4; i++){
                drawAnimatedFinger(15 + i * 20, 13, openFingerLen, 28, 20, openAngle, 0, true, progress);
            }
            drawAnimatedThumb(-62, 18, 70, 52, 24, -0.5, -0.2, progress);
            break;
            
        case 'W':
            // Three fingers form W
            drawAnimatedFinger(-27, -95, openFingerLen, 98, 21, openAngle, -0.35, false, progress);
            drawAnimatedFinger(-5, -97, openFingerLen, 103, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(18, -95, openFingerLen, 101, 21, openAngle, 0.35, false, progress);
            drawAnimatedFinger(42, 13, openFingerLen, 28, 20, openAngle, 0.2, true, progress);
            drawAnimatedThumb(-62, 18, 70, 52, 24, -0.5, -0.2, progress);
            break;
            
        case 'X':
            // Index bent/hooked
            ctx.save();
            const xY = lerp(-80, -55, progress);
            ctx.translate(0, xY);
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
                drawAnimatedFinger(-27 + i * 22, -2, openFingerLen, 30, 22, openAngle, 0, true, progress);
            }
            drawAnimatedFinger(42, 8, openFingerLen, 28, 20, openAngle, 0.2, true, progress);
            drawAnimatedThumb(-67, 13, 70, 52, 24, -0.5, -0.3, progress);
            break;
            
        case 'Y':
            // Thumb and pinky extended
            drawAnimatedFinger(47, -85, openFingerLen, 88, 19, openAngle, 0, false, progress);
            for(let i = 0; i < 3; i++){
                drawAnimatedFinger(-30 + i * 22, -12, openFingerLen, 30, 22, openAngle, 0, true, progress);
            }
            drawAnimatedThumb(-72, -25, 70, 73, 26, -0.2, 1.57, progress);
            break;
            
        case 'Z':
            // Index draws Z in air
            drawAnimatedFinger(0, -95, openFingerLen, 108, 22, openAngle, 0, false, progress);
            for(let i = 1; i < 4; i++){
                drawAnimatedFinger(-5 + i * 22, 8, openFingerLen, 30, 22, openAngle, 0, true, progress);
            }
            drawAnimatedThumb(-67, 13, 70, 52, 24, -0.5, -0.3, progress);
            if(progress > 0.7) {
                ctx.strokeStyle = '#667eea';
                ctx.lineWidth = 7;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'miter';
                ctx.globalAlpha = (progress - 0.7) / 0.3;
                ctx.beginPath();
                ctx.moveTo(-22, -95);
                ctx.lineTo(22, -95);
                ctx.lineTo(-22, -55);
                ctx.lineTo(22, -55);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
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

function drawAnimatedNumber(num, progress){
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    clearCanvas();
    
    ctx.save();
    ctx.translate(cx, cy);
    
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 52px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(num.toString(), 0, -185);
    
    drawDetailedPalm(0, 30, 120, 140);
    
    const openFingerLen = 100;
    const openAngle = 0;
    
    switch(num){
        case 0:
            // O shape
            if(progress > 0.5) {
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
                ctx.globalAlpha = (progress - 0.5) / 0.5;
                ctx.stroke();
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#8b6f47';
                ctx.stroke();
                ctx.restore();
            }
            break;
            
        case 1:
            // Index up
            drawAnimatedFinger(0, -95, openFingerLen, 108, 22, openAngle, 0, false, progress);
            for(let i = 1; i < 4; i++){
                drawAnimatedFinger(-5 + i * 22, 8, openFingerLen, 30, 22, openAngle, 0, true, progress);
            }
            drawAnimatedThumb(-67, 13, 70, 52, 24, -0.5, -0.3, progress);
            break;
            
        case 2:
            // Index and middle up
            drawAnimatedFinger(-20, -95, openFingerLen, 103, 22, openAngle, -0.35, false, progress);
            drawAnimatedFinger(8, -95, openFingerLen, 103, 22, openAngle, 0.35, false, progress);
            for(let i = 2; i < 4; i++){
                drawAnimatedFinger(15 + i * 20, 13, openFingerLen, 28, 20, openAngle, 0, true, progress);
            }
            drawAnimatedThumb(-62, 18, 70, 52, 24, -0.5, -0.2, progress);
            break;
            
        case 3:
            // Three fingers up
            drawAnimatedFinger(-27, -95, openFingerLen, 98, 21, openAngle, -0.35, false, progress);
            drawAnimatedFinger(-5, -97, openFingerLen, 103, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(18, -95, openFingerLen, 101, 21, openAngle, 0.35, false, progress);
            drawAnimatedFinger(42, 13, openFingerLen, 28, 20, openAngle, 0.2, true, progress);
            drawAnimatedThumb(-62, 18, 70, 52, 24, -0.5, -0.2, progress);
            break;
            
        case 4:
            // Four fingers up
            drawAnimatedFinger(-38, -85, openFingerLen, 98, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(-13, -90, openFingerLen, 103, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(12, -90, openFingerLen, 101, 21, openAngle, 0, false, progress);
            drawAnimatedFinger(35, -85, openFingerLen, 93, 20, openAngle, 0, false, progress);
            drawAnimatedThumb(-67, 25, 70, 52, 24, -0.5, 0, progress);
            break;
            
        case 5:
            // All five fingers extended
            drawAnimatedFinger(-38, -85, openFingerLen, 98, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(-13, -90, openFingerLen, 103, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(12, -90, openFingerLen, 101, 21, openAngle, 0, false, progress);
            drawAnimatedFinger(35, -85, openFingerLen, 93, 20, openAngle, 0, false, progress);
            drawAnimatedThumb(-72, -25, 70, 73, 26, -0.2, 1.57, progress);
            break;
            
        case 6:
            // Three fingers up, pinky touches thumb
            drawAnimatedFinger(-38, -85, openFingerLen, 98, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(-13, -90, openFingerLen, 103, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(12, -90, openFingerLen, 101, 21, openAngle, 0, false, progress);
            drawAnimatedFinger(35, 8, openFingerLen, 30, 20, openAngle, 0, true, progress);
            drawAnimatedThumb(-72, -25, 70, 73, 26, -0.2, 1.57, progress);
            break;
            
        case 7:
            // Two fingers up, ring and pinky touch thumb
            drawAnimatedFinger(-38, -85, openFingerLen, 98, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(-13, -90, openFingerLen, 103, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(12, 8, openFingerLen, 30, 20, openAngle, 0, true, progress);
            drawAnimatedFinger(35, 8, openFingerLen, 30, 20, openAngle, 0, true, progress);
            drawAnimatedThumb(-72, -25, 70, 73, 26, -0.2, 1.57, progress);
            break;
            
        case 8:
            // Index up, middle/ring/pinky touch thumb
            drawAnimatedFinger(-38, -85, openFingerLen, 98, 22, openAngle, 0, false, progress);
            drawAnimatedFinger(-13, 8, openFingerLen, 30, 20, openAngle, 0, true, progress);
            drawAnimatedFinger(12, 8, openFingerLen, 30, 20, openAngle, 0, true, progress);
            drawAnimatedFinger(35, 8, openFingerLen, 30, 20, openAngle, 0, true, progress);
            drawAnimatedThumb(-72, -25, 70, 73, 26, -0.2, 1.57, progress);
            break;
            
        case 9:
            // All fingers touch thumb in circle
            if(progress > 0.5) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(0, -23, 48, 0, Math.PI * 2);
                ctx.lineWidth = 22;
                const nineGrad = ctx.createLinearGradient(-48, -23, 48, -23);
                nineGrad.addColorStop(0, '#e8b896');
                nineGrad.addColorStop(0.5, '#f0c8a8');
                nineGrad.addColorStop(1, '#e8b896');
                ctx.strokeStyle = nineGrad;
                ctx.globalAlpha = (progress - 0.5) / 0.5;
                ctx.stroke();
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#8b6f47';
                ctx.stroke();
                ctx.restore();
            }
            drawAnimatedThumb(-72, -25, 70, 73, 26, -0.2, 1.57, progress);
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