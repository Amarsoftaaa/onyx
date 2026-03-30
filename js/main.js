gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/* 1. HERO CANVAS ANIMATION                                                   */
/* -------------------------------------------------------------------------- */
const canvas = document.getElementById('hero-canvas');
const context = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
}
window.addEventListener('resize', resize);

const frameCount = 299;
const currentFrame = index => (
    `Onyx/im/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

const images = [];
const frames = { frame: 0 };
let loadedCount = 0;

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
        loadedCount++;
        if (loadedCount === 1) resize();
    };
    images.push(img);
}

function render() {
    const img = images[Math.round(frames.frame)];
    if (!img || !img.complete) return;
    
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        drawWidth = canvas.height * imgRatio;
        drawHeight = canvas.height;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

/* ----- Hero Section Timeline ----- */
// We use gsap timeline that pins the wrapper for 400vh
const heroTl = gsap.timeline({
    scrollTrigger: {
        trigger: '#hero-pin-wrapper',
        pin: true,
        start: 'top top',
        end: '+=400%',
        scrub: 1.2
    }
});

// Add frame animation mapped across the entire hero timeline
heroTl.to(frames, {
    frame: frameCount - 1,
    ease: 'none',
    duration: 100, // Using 100 as percentage scale
    onUpdate: render
}, 0);

// UI states
gsap.set("#section-2", { opacity: 0 });
gsap.set("#section-2 .glass-panel", { y: 60 });
gsap.set("#section-3", { opacity: 0 });
gsap.set("#section-3 .glass-panel", { y: 60 });
gsap.set("#section-4", { opacity: 0 });
gsap.set("#section-4 .glass-panel", { y: 60, scale: 0.95 });

// Overlay animations directly injected into the heroTl
// 0% - 15%: Hide section 1
heroTl.to("#section-1", { opacity: 0, duration: 10, ease: "power1.inOut" }, 5);
heroTl.to("#section-1 .glass-panel", { y: -80, scale: 0.95, duration: 10, ease: "power1.inOut" }, 5);

// 22% - 33%: Show section 2
heroTl.to("#section-2", { opacity: 1, duration: 11, ease: "power2.out" }, 22);
heroTl.to("#section-2 .glass-panel", { y: 0, duration: 11, ease: "power2.out" }, 22);

// 40% - 48%: Hide section 2
heroTl.to("#section-2", { opacity: 0, duration: 8, ease: "power1.in" }, 40);
heroTl.to("#section-2 .glass-panel", { y: -60, duration: 8, ease: "power1.in" }, 40);

// 55% - 66%: Show section 3
heroTl.to("#section-3", { opacity: 1, duration: 11, ease: "power2.out" }, 55);
heroTl.to("#section-3 .glass-panel", { y: 0, duration: 11, ease: "power2.out" }, 55);

// 73% - 81%: Hide section 3
heroTl.to("#section-3", { opacity: 0, duration: 8, ease: "power1.in" }, 73);
heroTl.to("#section-3 .glass-panel", { y: -60, duration: 8, ease: "power1.in" }, 73);

// 86% - 100%: Show section 4
heroTl.to("#section-4", { opacity: 1, duration: 9, ease: "power2.out" }, 86);
heroTl.to("#section-4 .glass-panel", { y: 0, scale: 1, duration: 9, ease: "power2.out" }, 86);


/* -------------------------------------------------------------------------- */
/* 2. ARSENAL (PRODUCT) HORIZONTAL SCROLL                                     */
/* -------------------------------------------------------------------------- */
const productsContainer = document.getElementById('products-container');

function getScrollAmount() {
    return -(productsContainer.scrollWidth - window.innerWidth);
}

const productsTl = gsap.timeline({
    scrollTrigger: {
        trigger: '#arsenal-pin-wrapper',
        pin: true,
        start: 'top top',
        end: '+=300%', // 300vh scroll
        scrub: 1.2
    }
});

// Translate the horizontal container leftwards
productsTl.to(productsContainer, {
    x: getScrollAmount,
    duration: 100,
    ease: "none"
}, 0);

// Dynamic Parallax on BG (moves slightly left to simulate depth)
productsTl.to('#arsenal-bg', {
    x: '-15%', // move bg significantly slower
    duration: 100,
    ease: "none"
}, 0);

// Product Cards Scroll Effects
const productCards = gsap.utils.toArray('.product-card');

productCards.forEach((card, index) => {
    // Apply a slight lag/parallax to the text panel inside the card
    const textPanel = card.querySelector('.product-info');
    
    // To animate elements based on their horizontal appearance in the pinned container,
    // we use the containerAnimation property
    
    // We want the card to be somewhat faded and blurred when off-center,
    // and come to full scale/opacity right in the middle
    
    // Phase 1: entering from the right
    gsap.fromTo(card, 
        { scale: 0.85, opacity: 0.3, filter: 'blur(8px)' },
        {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            ease: "power2.out",
            scrollTrigger: {
                trigger: card,
                containerAnimation: productsTl,
                start: "left 90%", // When card left hits 90% of screen width
                end: "center center", 
                scrub: true
            }
        }
    );

    // Phase 2: leaving to the left
    gsap.fromTo(card, 
        { scale: 1, opacity: 1, filter: 'blur(0px)' },
        {
            scale: 0.85,
            opacity: 0.3,
            filter: 'blur(8px)',
            ease: "power2.in",
            scrollTrigger: {
                trigger: card,
                containerAnimation: productsTl,
                start: "center center",
                end: "right 10%", // When card right hits 10% of screen width
                scrub: true
            }
        }
    );

    // Text Lag (Parallax on the Glass Panel)
    // Noticeable depth effect as the layout slides past
    gsap.to(textPanel, {
        x: 100, // moves rightward relative to the sliding container (giving a lag effect)
        ease: "none",
        scrollTrigger: {
            trigger: card,
            containerAnimation: productsTl,
            start: "left right",
            end: "right left",
            scrub: true
        }
    });
});

// Handle window resize recalculations
window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
});
