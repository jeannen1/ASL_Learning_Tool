const canvas = document.getElementById('signCanvas');
const ctx = canvas.getContext('2d');
const alphabetGrid = document.getElementById('alphabetGrid');
const wordInput = document.getElementById('wordInput');
const errorMessage = document.getElementById('errorMessage');
const currentWord = document.getElementById('currentWord');

const profanityList = ['damn','hell','shit','fuck','bitch','ass','bastard','crap','piss','dick','cock','pussy','slut','whore','cunt','fag','nigger','nigga'];

// ASL Image URLs (using a free ASL resource)
const aslImages = {
    'A': 'https://www.signingsavvy.com/images/words/alphabet/1/a.jpg',
    'B': 'https://www.signingsavvy.com/images/words/alphabet/1/b.jpg',
    'C': 'https://www.signingsavvy.com/images/words/alphabet/1/c.jpg',
    'D': 'https://www.signingsavvy.com/images/words/alphabet/1/d.jpg',
    'E': 'https://www.signingsavvy.com/images/words/alphabet/1/e.jpg',
    'F': 'https://www.signingsavvy.com/images/words/alphabet/1/f.jpg',
    'G': 'https://www.signingsavvy.com/images/words/alphabet/1/g.jpg',
    'H': 'https://www.signingsavvy.com/images/words/alphabet/1/h.jpg',
    'I': 'https://www.signingsavvy.com/images/words/alphabet/1/i.jpg',
    'J': 'https://www.signingsavvy.com/images/words/alphabet/1/j.jpg',
    'K': 'https://www.signingsavvy.com/images/words/alphabet/1/k.jpg',
    'L': 'https://www.signingsavvy.com/images/words/alphabet/1/l.jpg',
    'M': 'https://www.signingsavvy.com/images/words/alphabet/1/m.jpg',
    'N': 'https://www.signingsavvy.com/images/words/alphabet/1/n.jpg',
    'O': 'https://www.signingsavvy.com/images/words/alphabet/1/o.jpg',
    'P': 'https://www.signingsavvy.com/images/words/alphabet/1/p.jpg',
    'Q': 'https://www.signingsavvy.com/images/words/alphabet/1/q.jpg',
    'R': 'https://www.signingsavvy.com/images/words/alphabet/1/r.jpg',
    'S': 'https://www.signingsavvy.com/images/words/alphabet/1/s.jpg',
    'T': 'https://www.signingsavvy.com/images/words/alphabet/1/t.jpg',
    'U': 'https://www.signingsavvy.com/images/words/alphabet/1/u.jpg',
    'V': 'https://www.signingsavvy.com/images/words/alphabet/1/v.jpg',
    'W': 'https://www.signingsavvy.com/images/words/alphabet/1/w.jpg',
    'X': 'https://www.signingsavvy.com/images/words/alphabet/1/x.jpg',
    'Y': 'https://www.signingsavvy.com/images/words/alphabet/1/y.jpg',
    'Z': 'https://www.signingsavvy.com/images/words/alphabet/1/z.jpg',
    '0': 'https://www.signingsavvy.com/images/words/numbers/1/0.jpg',
    '1': 'https://www.signingsavvy.com/images/words/numbers/1/1.jpg',
    '2': 'https://www.signingsavvy.com/images/words/numbers/1/2.jpg',
    '3': 'https://www.signingsavvy.com/images/words/numbers/1/3.jpg',
    '4': 'https://www.signingsavvy.com/images/words/numbers/1/4.jpg',
    '5': 'https://www.signingsavvy.com/images/words/numbers/1/5.jpg',
    '6': 'https://www.signingsavvy.com/images/words/numbers/1/6.jpg',
    '7': 'https://www.signingsavvy.com/images/words/numbers/1/7.jpg',
    '8': 'https://www.signingsavvy.com/images/words/numbers/1/8.jpg',
    '9': 'https://www.signingsavvy.com/images/words/numbers/1/9.jpg'
};

// Preload images
const imageCache = {};
function preloadImages() {
    Object.keys(aslImages).forEach(key => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = aslImages[key];
        imageCache[key] = img;
    });
}
preloadImages();

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
    drawASLImage(letter);
}

function showNumberSign(number){
    clearCanvas();
    currentWord.textContent = `Number: ${number}`;
    errorMessage.textContent = '';
    document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.textContent == number) btn.classList.add('active');
    });
    drawASLImage(number.toString());
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
        const img = imageCache[char.toUpperCase()];
        if(img && img.complete){
            const imgWidth = 80;
            const imgHeight = 120;
            ctx.drawImage(img, startX + index * spacing - imgWidth/2, y - imgHeight/2, imgWidth, imgHeight);
        }
        
        ctx.fillStyle = '#333';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(char, startX + index * spacing, y + 80);
    });
}

function drawASLImage(character){
    clearCanvas();
    
    const img = imageCache[character.toUpperCase()];
    
    if(img && img.complete){
        const maxWidth = 400;
        const maxHeight = 400;
        const aspectRatio = img.width / img.height;
        
        let drawWidth = maxWidth;
        let drawHeight = maxWidth / aspectRatio;
        
        if(drawHeight > maxHeight){
            drawHeight = maxHeight;
            drawWidth = maxHeight * aspectRatio;
        }
        
        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;
        
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        
        // Add letter label
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(character.toUpperCase(), canvas.width/2, 50);
    } else {
        // Fallback if image doesn't load
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(character.toUpperCase(), canvas.width/2, canvas.height/2 - 50);
        ctx.font = '20px Arial';
        ctx.fillStyle = '#888';
        ctx.fillText('Loading image...', canvas.width/2, canvas.height/2);
        
        // Retry loading
        setTimeout(() => {
            if(img) drawASLImage(character);
        }, 500);
    }
}

clearCanvas();