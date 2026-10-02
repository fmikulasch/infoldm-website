// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Respect reduced motion and let readers pause the supplied GIFs.
const animationToggle = document.getElementById('animation-toggle');
const hopperImages = document.querySelectorAll('.hopper-gif');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let animationsPaused = motionPreference.matches;

hopperImages.forEach(function(image) {
    image.dataset.animation = image.getAttribute('src');
});

function setAnimationsPaused(paused) {
    animationsPaused = paused;
    hopperImages.forEach(function(image) {
        image.src = paused ? image.dataset.poster : image.dataset.animation;
    });
    animationToggle.textContent = paused ? 'Play animations' : 'Pause animations';
    animationToggle.setAttribute('aria-pressed', String(paused));
}

animationToggle.hidden = false;
setAnimationsPaused(animationsPaused);
animationToggle.addEventListener('click', function() {
    setAnimationsPaused(!animationsPaused);
});
motionPreference.addEventListener('change', function(event) {
    setAnimationsPaused(event.matches);
});
