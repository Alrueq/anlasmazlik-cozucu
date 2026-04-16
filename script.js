const justifications = [
    "Plüton'un bugün gezegen statüsüne bir anlığına geri dönmesi nedeniyle bu seçenek daha mantıklı bulundu.",
    "Jürinin kahvesindeki falda bu seçeneğin baş harfi çıktığı için tartışılamaz bir zafer kazandı.",
    "Brezilya'daki bir kelebek kanat çırptığı için rüzgar yönü tamamen bu seçeneği gösteriyor.",
    "Rakip seçenek o kadar sıkıcıydı ki jüri üyelerinden biri uyuya kaldı. Bu yüzden kazanan otomatik olarak belirlendi.",
    "Kuantum fiziğine göre her iki seçenek de aynı anda gerçekleşebilir, ancak biz bu evrende sadece bunu seçmeye karar verdik.",
    "Uzaylılar Dünya'ya telepatik bir mesaj gönderdi ve özellikle bunu onaylamamızı istediler.",
    "Yazılımcı jüri kodunu yazarken kahve döktü ve devreler yandığı için mantık aranmaksızın bu seçildi.",
    "Karşısındaki seçenek jürinin eski sevgilisini hatırlattığı için derhal veto edildi.",
    "Astroloji haritasında Merkür retrosu var, bu yüzden tehlikeye girmemek adına rastgele bu kutuya tıkladık.",
    "Bunu seçmezsek uygulamanın moralinin bozulma ihtimali %90'dı, risk alamadık.",
    "Bugün salı olduğu için... Yani ciddiyim, jüri salı günleri hep böyle tercihler yapar.",
    "Diğer seçeneğin enerjisi jüriye biraz 'düşük titreşimli' geldi. Olumlada kalıyoruz."
];

document.addEventListener('DOMContentLoaded', () => {
    const resolveBtn = document.getElementById('resolveBtn');
    const resetBtn = document.getElementById('resetBtn');
    const option1Input = document.getElementById('option1');
    const option2Input = document.getElementById('option2');
    const resultArea = document.getElementById('resultArea');
    const winnerName = document.getElementById('winnerName');
    const justificationText = document.getElementById('justificationText');

    resolveBtn.addEventListener('click', () => {
        const opt1 = option1Input.value.trim();
        const opt2 = option2Input.value.trim();

        if (!opt1 || !opt2) {
            alert('Jürinin karar verebilmesi için lütfen iki seçeneği de doldurun! (Taraflılık sevmiyoruz)');
            
            if (!opt1) option1Input.focus();
            else option2Input.focus();
            
            return;
        }
        
        if (opt1.toLowerCase() === opt2.toLowerCase()) {
            alert('İkiniz de aynı şeyi yazmışsınız! Zaten anlaşıyorsunuz, bizi neden yoruyorsunuz?');
            return;
        }

        // Simulating some "thinking" time for the jury
        resolveBtn.querySelector('span').textContent = 'Jüri Hararetle Tartışıyor...';
        resolveBtn.disabled = true;
        resolveBtn.style.opacity = '0.5';

        setTimeout(() => {
            // Decide winner
            const randomlySelectFirst = Math.random() > 0.5;
            const winner = randomlySelectFirst ? opt1 : opt2;
            
            // Random justification
            const randomJustification = justifications[Math.floor(Math.random() * justifications.length)];

            winnerName.textContent = winner;
            justificationText.textContent = randomJustification;

            // Show result
            document.querySelector('.resolution-form').style.display = 'none';
            resultArea.style.display = 'block';
            
            // Slight delay to allow display property to apply before removing hidden class (gives zoom/opactiy animation)
            setTimeout(() => {
                resultArea.classList.remove('hidden');
                triggerConfetti();
            }, 50);

            // Reset button state
            resolveBtn.querySelector('span').textContent = 'Karar Ver!';
            resolveBtn.disabled = false;
            resolveBtn.style.opacity = '1';

        }, 2000); // 2 second dramatic delay
    });

    resetBtn.addEventListener('click', () => {
        option1Input.value = '';
        option2Input.value = '';
        
        resultArea.classList.add('hidden');
        
        setTimeout(() => {
            resultArea.style.display = 'none';
            document.querySelector('.resolution-form').style.display = 'flex';
            option1Input.focus();
        }, 500); // Sync with CSS transition
    });

    // Enter key support
    [option1Input, option2Input].forEach(input => {
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                resolveBtn.click();
            }
        });
    });
});

function triggerConfetti() {
    const colors = ['#6366f1', '#ec4899', '#f43f5e', '#a855f7', '#ffd700', '#00f2fe'];
    
    // Find the center of the winner text to burst from there
    const origin = document.getElementById('winnerName').getBoundingClientRect();
    const centerX = origin.x + (origin.width / 2);
    const centerY = origin.y + (origin.height / 2);

    for (let i = 0; i < 60; i++) {
        createConfettiPiece(centerX, centerY, colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfettiPiece(x, y, color) {
    const piece = document.createElement('div');
    piece.style.position = 'fixed';
    piece.style.width = '10px';
    piece.style.height = '10px';
    piece.style.backgroundColor = color;
    piece.style.left = x + 'px';
    piece.style.top = y + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    piece.style.pointerEvents = 'none';
    piece.style.zIndex = '9999';

    document.body.appendChild(piece);

    // Random physics calculations
    const angle = Math.random() * Math.PI * 2;
    const velocity = 8 + Math.random() * 15;
    const drag = 0.94;
    const gravity = 0.6;

    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity;
    let currentX = x;
    let currentY = y;
    let rotation = Math.random() * 360;
    let rotationSpeed = (Math.random() - 0.5) * 20;

    let opacity = 1;

    function animate() {
        vx *= drag;
        // Apply gravity
        vy += gravity;
        
        currentX += vx;
        currentY += vy;
        rotation += rotationSpeed;

        piece.style.transform = `translate(${currentX - x}px, ${currentY - y}px) rotate(${rotation}deg)`;
        
        // Starts fading out after passing halfway screen
        if (currentY > window.innerHeight * 0.7) {
            opacity -= 0.02;
            piece.style.opacity = opacity;
        }

        // Loop condition
        if (currentY < window.innerHeight + 100 && opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            // Clean up
            if (document.body.contains(piece)) {
                document.body.removeChild(piece);
            }
        }
    }

    requestAnimationFrame(animate);
}
