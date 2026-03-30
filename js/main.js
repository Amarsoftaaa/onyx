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
/* 3. HERITAGE SECTION ANIMATION                                              */
/* -------------------------------------------------------------------------- */
const heritageTl = gsap.timeline({
    scrollTrigger: {
        trigger: '#heritage-section',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
    }
});

// Fade in and slide up text elements with a stagger
heritageTl.fromTo('.heritage-item', 
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power3.out" }
);

// Parallax and zoom effect on video
gsap.to('#heritage-video', {
    scrollTrigger: {
        trigger: '#heritage-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    },
    y: "10%",
    scale: 1.05,
    ease: "none"
});

// Light sweep effect
gsap.to('#heritage-sweep', {
    scrollTrigger: {
        trigger: '#heritage-section',
        start: 'top 50%',
        toggleActions: 'play none none reverse'
    },
    x: '0%', // Translating to 0% creates the sweep
    duration: 2.5,
    ease: "power2.inOut"
});

/* -------------------------------------------------------------------------- */
/* 4. PREMIUM SHOWCASE SECTION ANIMATION                                      */
/* -------------------------------------------------------------------------- */
const showcaseTl = gsap.timeline({
    scrollTrigger: {
        trigger: '#showcase-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
    }
});

// Video container scales up and fades in
showcaseTl.fromTo('#showcase-video-container',
    { opacity: 0, scale: 0.9, x: -30 },
    { opacity: 1, scale: 1, x: 0, duration: 1.2, ease: "power3.out" }
);

// Text info staggered fade and slide right
showcaseTl.fromTo('.showcase-text',
    { opacity: 0, x: 40 },
    { opacity: 1, x: 0, duration: 1, stagger: 0.15, ease: "power2.out" },
    "-=0.8" // Start slightly before video animation finishes
);

// 3D Tilt Interaction on the Glass Card and Image Parallax
const showcaseCard = document.querySelector('.showcase-card');
const showcaseImage = document.getElementById('showcase-image');

if(showcaseCard) {
    showcaseCard.addEventListener('mousemove', (e) => {
        const rect = showcaseCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation based on cursor position
        const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg
        const rotateY = ((x - centerX) / centerX) * 15;
        
        // Rotate the parent card
        gsap.to(showcaseCard, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.5,
            ease: "power2.out"
        });

        // Add extreme parallax translation to the image to make it pop out in 3D space
        if(showcaseImage) {
            gsap.to(showcaseImage, {
                x: ((x - centerX) / centerX) * 40, // moves up to 40px
                y: ((y - centerY) / centerY) * 40,
                rotateZ: ((x - centerX) / centerX) * 5, // slight twist based on X
                duration: 0.5,
                ease: "power2.out"
            });
        }
    });

    showcaseCard.addEventListener('mouseleave', () => {
        // Snap back to 0 with a high-quality elastic bounce
        gsap.to(showcaseCard, {
            rotateX: 0,
            rotateY: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)"
        });

        if(showcaseImage) {
            gsap.to(showcaseImage, {
                x: 0,
                y: 0,
                rotateZ: 0,
                duration: 1.2,
                ease: "elastic.out(1, 0.5)"
            });
        }
    });
}

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
