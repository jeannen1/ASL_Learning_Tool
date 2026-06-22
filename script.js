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

// TEMPORARY: Create fallback images if real ones aren't loaded
function createPlaceholderImage(text, color = '#e8b896') {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 400;
    tempCanvas.height = 400;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw hand-like shape
    tempCtx.fillStyle = color;
    tempCtx.beginPath();
    tempCtx.ellipse(200, 250, 100, 140, 0, 0, Math.PI * 2);
    tempCtx.fill();
    tempCtx.strokeStyle = '#8b6f47';
    tempCtx.lineWidth = 5;
    tempCtx.stroke();
    
    // Draw text
    tempCtx.fillStyle = '#667eea';
    tempCtx.font = 'bold 80px Arial';
    tempCtx.textAlign = 'center';
    tempCtx.fillText(text, 200, 220);
    
    const img = new Image();
    img.src = tempCanvas.toDataURL();
    return img;
}

// Use placeholders if images fail to load
imageCache.openHand.onerror = function() {
    imageCache.openHand = createPlaceholderImage('✋', '#f0c8a8');
};

// Add this after the letter loading loop
for(let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    imageCache.letters[letter].onerror = function() {
        imageCache.letters[letter] = createPlaceholderImage(letter);
    };
}

// Add this after the number loading loop
for(let i = 0; i <= 9; i++) {
    imageCache.numbers[i].onerror = function() {
        imageCache.numbers[i] = createPlaceholderImage(i.toString());
    };
}

let currentLetter = null;
let currentNumber = null;
let animationProgress = 0;
let isAnimating = false;
let animationFrame = null;

// Image cache
const imageCache = {
    openHand: null,
    letters: {},
    numbers: {}
};

// Image base URL - Using placeholder for now, you'll replace with your GitHub path

const IMAGE_BASE_URL = './images/';

// Preload images
function preloadImages() {
    // Load open hand
    imageCache.openHand = new Image();
    imageCache.openHand.crossOrigin = "anonymous";
    imageCache.openHand.src = IMAGE_BASE_URL + 'open-hand.png';
    
    // Load letters A-Z
    for(let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i).toLowerCase();
        imageCache.letters[letter.toUpperCase()] = new Image();
        imageCache.letters[letter.toUpperCase()].crossOrigin = "anonymous";
        imageCache.letters[letter.toUpperCase()].src = IMAGE_BASE_URL + letter + '.png';
    }
    
    // Load numbers 0-9
    for(let i = 0; i <= 9; i++) {
        imageCache.numbers[i] = new Image();
        imageCache.numbers[i].crossOrigin = "anonymous";
        imageCache.numbers[i].src = IMAGE_BASE_URL + i + '.png';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded! Creating buttons...");
    
    // Create alphabet buttons HERE
    for(let i = 65; i <= 90; i++){
        const letter = String.fromCharCode(i);
        const btn = document.createElement('button');
        btn.className = 'letter-btn';
        btn.textContent = letter;
        btn.onclick = () => showLetterSign(letter);
        alphabetGrid.appendChild(btn);
    }

    // Create number buttons HERE
    for(let i = 0; i <= 9; i++){
        const btn = document.createElement('button');
        btn.className = 'letter-btn';
        btn.textContent = i;
        btn.onclick = () => showNumberSign(i);
        alphabetGrid.appendChild(btn);
    }
    
    console.log("Buttons created!");
    
    // Call preload HERE (not outside)
    preloadImages();
});

// Event listeners also inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    if (wordInput) {
        wordInput.addEventListener('keypress', function(e){
            if(e.key === 'Enter') searchWord();
        });
    }
    
    // ... rest of event listeners ...
});

// Animation slider control
animationSlider.addEventListener('input', function(e){
    if(isAnimating) {
        cancelAnimationFrame(animationFrame);
        isAnimating = false;
    }
    animationProgress = parseFloat(e.target.value) / 100;
    if(currentLetter) {
        drawMorphedImage(currentLetter, animationProgress);
    } else if(currentNumber !== null) {
        drawMorphedImage(currentNumber.toString(), animationProgress, true);
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
        
        // Ease in-out curve for smooth animation
        const easedProgress = easeInOutCubic(animationProgress);
        animationSlider.value = animationProgress * 100;
        
        if(currentLetter) {
            drawMorphedImage(currentLetter, easedProgress);
        } else if(currentNumber !== null) {
            drawMorphedImage(currentNumber.toString(), easedProgress, true);
        }
        
        if(animationProgress < 1) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            isAnimating = false;
        }
    }
    
    animate();
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
        const targetImage = /[a-zA-Z]/.test(char) 
            ? imageCache.letters[char.toUpperCase()]
            : imageCache.numbers[parseInt(char)];
        
        if(targetImage && targetImage.complete) {
            const imgWidth = 80;
            const imgHeight = 120;
            const x = startX + index * spacing - imgWidth/2;
            const imgY = y - imgHeight/2;
            
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.drawImage(targetImage, x, imgY, imgWidth, imgHeight);
            ctx.restore();
        } else {
            // Fallback if image not loaded
            ctx.fillStyle = '#999';
            ctx.font = '40px Arial';
            ctx.fillText(char, startX + index * spacing, y);
        }
        
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(char, startX + index * spacing, y + 80);
    });
}

function drawMorphedImage(character, progress, isNumber = false){
    clearCanvas();
    
    const openHand = imageCache.openHand;
    const targetImage = isNumber 
        ? imageCache.numbers[parseInt(character)]
        : imageCache.letters[character];
    
    // Draw letter label
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 52px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(character, canvas.width/2, 50);
    
    // Calculate image dimensions (centered, maintaining aspect ratio)
    const maxWidth = 400;
    const maxHeight = 400;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 20;
    
    // Draw open hand (fading out)
    if(openHand && openHand.complete) {
        ctx.save();
        ctx.globalAlpha = 1 - progress; // Fade out as animation progresses
        const imgWidth = Math.min(maxWidth, openHand.width);
        const imgHeight = Math.min(maxHeight, openHand.height);
        ctx.drawImage(
            openHand,
            centerX - imgWidth/2,
            centerY - imgHeight/2,
            imgWidth,
            imgHeight
        );
        ctx.restore();
    }
    
    // Draw target letter/number (fading in)
    if(targetImage && targetImage.complete) {
        ctx.save();
        ctx.globalAlpha = progress; // Fade in as animation progresses
        const imgWidth = Math.min(maxWidth, targetImage.width);
        const imgHeight = Math.min(maxHeight, targetImage.height);
        ctx.drawImage(
            targetImage,
            centerX - imgWidth/2,
            centerY - imgHeight/2,
            imgWidth,
            imgHeight
        );
        ctx.restore();
    } else {
        // Fallback: show loading message
        ctx.fillStyle = '#999';
        ctx.font = '20px Arial';
        ctx.fillText('Loading image...', canvas.width/2, canvas.height/2);
        
        // Retry loading if not complete
        if(targetImage && !targetImage.complete) {
            setTimeout(() => {
                if(currentLetter === character || currentNumber == character) {
                    drawMorphedImage(character, progress, isNumber);
                }
            }, 100);
        }
    }
    
    // Draw progress indicator
    ctx.fillStyle = '#667eea';
    ctx.font = '16px Arial';
    ctx.fillText(`${Math.round(progress * 100)}% Complete`, canvas.width/2, canvas.height - 30);
}

clearCanvas();