/* ============================================
   ECOFORM - Main Application Script
   Three.js 3D Cup Showcase + Interactions
   ============================================ */

// ============================================
// THREE.JS 3D CUP SCENE
// ============================================

class CupScene {
    constructor() {
        this.canvas = document.getElementById('cup-canvas');
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        this.cups = [];
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.isDragging = false;
        this.previousMouse = { x: 0, y: 0 };

        this.init();
        this.createLights();
        this.createCups();
        this.createParticles();
        this.animate();
        this.addEventListeners();
    }

    init() {
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 8;
        this.camera.position.y = 0.5;

        // Scene background (transparent)
        this.scene.background = null;
    }

    createLights() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0xE5DDD5, 0.6);
        this.scene.add(ambient);

        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(5, 8, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        this.scene.add(mainLight);

        // Fill light (warm)
        const fillLight = new THREE.DirectionalLight(0xC4A77D, 0.4);
        fillLight.position.set(-3, 2, 2);
        this.scene.add(fillLight);

        // Rim light (green tint)
        const rimLight = new THREE.DirectionalLight(0x5A7A3D, 0.3);
        rimLight.position.set(0, -3, -5);
        this.scene.add(rimLight);
    }

    createCupGeometry(topRadius, bottomRadius, height, segments = 32) {
        // Create a tapered cylinder (cup shape)
        const geometry = new THREE.CylinderGeometry(
            topRadius,
            bottomRadius,
            height,
            segments,
            1,
            true // Open-ended for realistic cup
        );

        return geometry;
    }

    createRimGeometry(radius, tubeRadius = 0.03) {
        return new THREE.TorusGeometry(radius, tubeRadius, 8, 32);
    }

    createCup(config) {
        const {
            topRadius = 0.6,
            bottomRadius = 0.45,
            height = 1.2,
            position = { x: 0, y: 0, z: 0 },
            rotation = { x: 0, y: 0, z: 0 },
            color = 0xC4A77D,
            isKraft = true
        } = config;

        const group = new THREE.Group();

        // Cup body material
        const cupMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.85,
            metalness: 0.0,
            side: THREE.DoubleSide
        });

        // Create texture pattern for kraft look
        if (isKraft) {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');

            // Base color
            ctx.fillStyle = '#C4A77D';
            ctx.fillRect(0, 0, 256, 256);

            // Add noise/grain
            for (let i = 0; i < 5000; i++) {
                const x = Math.random() * 256;
                const y = Math.random() * 256;
                const shade = Math.random() * 30 - 15;
                ctx.fillStyle = `rgba(${164 + shade}, ${135 + shade}, ${100 + shade}, 0.3)`;
                ctx.fillRect(x, y, 1, 1);
            }

            const texture = new THREE.CanvasTexture(canvas);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            cupMaterial.map = texture;
        }

        // Cup body
        const cupGeometry = this.createCupGeometry(topRadius, bottomRadius, height);
        const cup = new THREE.Mesh(cupGeometry, cupMaterial);
        cup.castShadow = true;
        cup.receiveShadow = true;
        group.add(cup);

        // Rim
        const rimGeometry = this.createRimGeometry(topRadius);
        const rimMaterial = new THREE.MeshStandardMaterial({
            color: isKraft ? 0xD4C7A0 : 0xffffff,
            roughness: 0.7,
            metalness: 0.1
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.position.y = height / 2;
        rim.rotation.x = Math.PI / 2;
        group.add(rim);

        // Bottom
        const bottomGeometry = new THREE.CircleGeometry(bottomRadius, 32);
        const bottom = new THREE.Mesh(bottomGeometry, cupMaterial);
        bottom.position.y = -height / 2;
        bottom.rotation.x = -Math.PI / 2;
        group.add(bottom);

        // Ecoform logo band (simplified as a torus around the cup)
        const bandGeometry = new THREE.TorusGeometry(
            (topRadius + bottomRadius) / 2 + 0.02,
            0.015,
            8,
            64
        );
        const bandMaterial = new THREE.MeshStandardMaterial({
            color: 0x6B4F3A,
            roughness: 0.5,
            metalness: 0.2
        });
        const band = new THREE.Mesh(bandGeometry, bandMaterial);
        band.position.y = height * 0.1;
        band.rotation.x = Math.PI / 2;
        group.add(band);

        // Position and rotate the group
        group.position.set(position.x, position.y, position.z);
        group.rotation.set(rotation.x, rotation.y, rotation.z);

        return group;
    }

    createCups() {
        // Main cup (center, kraft)
        const mainCup = this.createCup({
            topRadius: 0.65,
            bottomRadius: 0.48,
            height: 1.4,
            position: { x: 0, y: -0.2, z: 0 },
            color: 0xC4A77D,
            isKraft: true
        });
        this.scene.add(mainCup);
        this.cups.push({
            mesh: mainCup,
            baseY: -0.2,
            floatOffset: 0,
            floatSpeed: 0.8
        });

        // Small cup (left, white)
        const smallCup = this.createCup({
            topRadius: 0.45,
            bottomRadius: 0.35,
            height: 0.9,
            position: { x: -2.2, y: 0.3, z: -1 },
            rotation: { x: 0.1, y: 0.3, z: 0.05 },
            color: 0xF5F1ED,
            isKraft: false
        });
        this.scene.add(smallCup);
        this.cups.push({
            mesh: smallCup,
            baseY: 0.3,
            floatOffset: Math.PI * 0.5,
            floatSpeed: 1.2
        });

        // Medium cup (right, kraft)
        const mediumCup = this.createCup({
            topRadius: 0.55,
            bottomRadius: 0.42,
            height: 1.15,
            position: { x: 2.0, y: 0.1, z: -0.8 },
            rotation: { x: -0.08, y: -0.4, z: -0.05 },
            color: 0xB89A6A,
            isKraft: true
        });
        this.scene.add(mediumCup);
        this.cups.push({
            mesh: mediumCup,
            baseY: 0.1,
            floatOffset: Math.PI,
            floatSpeed: 1.0
        });

        // Back cup (white, partially hidden)
        const backCup = this.createCup({
            topRadius: 0.5,
            bottomRadius: 0.38,
            height: 1.0,
            position: { x: 1.0, y: 0.5, z: -2.5 },
            rotation: { x: 0.15, y: 0.2, z: 0 },
            color: 0xE8E2DC,
            isKraft: false
        });
        this.scene.add(backCup);
        this.cups.push({
            mesh: backCup,
            baseY: 0.5,
            floatOffset: Math.PI * 1.5,
            floatSpeed: 0.9
        });
    }

    createParticles() {
        // Add floating particles for atmosphere
        const particleCount = 50;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xC4A77D,
            size: 0.03,
            transparent: true,
            opacity: 0.4
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    addEventListeners() {
        // Mouse move for subtle parallax
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Drag to rotate
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.previousMouse.x = e.clientX;
            this.previousMouse.y = e.clientY;
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.previousMouse.x;
                const deltaY = e.clientY - this.previousMouse.y;

                this.targetRotation.y += deltaX * 0.01;
                this.targetRotation.x += deltaY * 0.005;

                // Clamp X rotation
                this.targetRotation.x = Math.max(-0.5, Math.min(0.5, this.targetRotation.x));

                this.previousMouse.x = e.clientX;
                this.previousMouse.y = e.clientY;
            }
        });

        // Touch support
        this.canvas.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            this.previousMouse.x = e.touches[0].clientX;
            this.previousMouse.y = e.touches[0].clientY;
        });

        this.canvas.addEventListener('touchend', () => {
            this.isDragging = false;
        });

        this.canvas.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                const deltaX = e.touches[0].clientX - this.previousMouse.x;
                const deltaY = e.touches[0].clientY - this.previousMouse.y;

                this.targetRotation.y += deltaX * 0.01;
                this.targetRotation.x += deltaY * 0.005;

                this.targetRotation.x = Math.max(-0.5, Math.min(0.5, this.targetRotation.x));

                this.previousMouse.x = e.touches[0].clientX;
                this.previousMouse.y = e.touches[0].clientY;
            }
        });

        // Resize
        window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = performance.now() * 0.001;

        // Auto rotation (slow)
        if (!this.isDragging) {
            this.targetRotation.y += 0.002;
        }

        // Animate cups
        this.cups.forEach((cupData, index) => {
            // Floating animation
            const float = Math.sin(time * cupData.floatSpeed + cupData.floatOffset) * 0.05;
            cupData.mesh.position.y = cupData.baseY + float;

            // Rotation follows main target (main cup) or has independent subtle rotation
            if (index === 0) {
                // Main cup follows drag rotation
                cupData.mesh.rotation.y += (this.targetRotation.y - cupData.mesh.rotation.y) * 0.05;
                cupData.mesh.rotation.x += (this.targetRotation.x - cupData.mesh.rotation.x) * 0.05;
            } else {
                // Other cups have subtle independent rotation
                cupData.mesh.rotation.y += 0.001 * (index % 2 === 0 ? 1 : -1);
            }
        });

        // Parallax effect on camera based on mouse
        if (!this.isDragging) {
            this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.02;
            this.camera.position.y += (this.mouse.y * 0.3 + 0.5 - this.camera.position.y) * 0.02;
        }
        this.camera.lookAt(0, 0, 0);

        // Animate particles
        if (this.particles) {
            this.particles.rotation.y = time * 0.02;
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(time + i) * 0.001;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }

        this.renderer.render(this.scene, this.camera);
    }
}


// ============================================
// PRICING TABLE DATA & LOGIC
// ============================================

const pricingData = {
    '4oz': {
        headers: ['Quantity', 'Single (White)', 'Double (White)', 'Double (Kraft)'],
        withoutLogo: [
            ['∞', '0.08₾', '0.17₾', '0.18₾']
        ],
        withLogo: [
            ['500', '0.55₾', '0.80₾', '-'],
            ['1,000', '0.37₾', '0.50₾', '-'],
            ['2,000', '0.25₾', '0.35₾', '-'],
            ['3,000', '0.15₾', '0.22₾', '-'],
            ['10,000', '0.14₾', '0.20₾', '-']
        ]
    },
    '8oz': {
        headers: ['Quantity', 'Single (White)', 'Double (White)', 'Double (Kraft)'],
        withoutLogo: [
            ['∞', '0.10₾', '0.21₾', '0.22₾']
        ],
        withLogo: [
            ['500', '0.65₾', '1.00₾', '-'],
            ['1,000', '0.40₾', '0.60₾', '-'],
            ['2,000', '0.30₾', '0.40₾', '-'],
            ['3,000', '0.22₾', '0.26₾', '-'],
            ['10,000', '0.21₾', '0.25₾', '-']
        ]
    },
    '12oz': {
        headers: ['Quantity', 'Single (White)', 'Double (White)', 'Double (Kraft)'],
        withoutLogo: [
            ['∞', '0.18₾', '0.26₾', '0.27₾']
        ],
        withLogo: [
            ['500', '0.70₾', '1.10₾', '-'],
            ['1,000', '0.45₾', '0.65₾', '-'],
            ['2,000', '0.35₾', '0.45₾', '-'],
            ['3,000', '0.26₾', '0.32₾', '-'],
            ['10,000', '0.24₾', '0.30₾', '-']
        ]
    }
};

function updatePricingTable(size) {
    const data = pricingData[size];
    const tbody = document.querySelector('#pricing-table tbody');

    if (!tbody || !data) return;

    tbody.innerHTML = '';

    // Without logo section
    const withoutLogoHeader = document.createElement('tr');
    withoutLogoHeader.innerHTML = `<td colspan="4" style="background: rgba(90, 122, 61, 0.2); color: #5A7A3D; font-weight: 600; text-align: left;">Without Logo</td>`;
    tbody.appendChild(withoutLogoHeader);

    data.withoutLogo.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = row.map((cell, i) => `<td${i === 0 ? '' : ''}>${cell}</td>`).join('');
        tbody.appendChild(tr);
    });

    // With logo section
    const withLogoHeader = document.createElement('tr');
    withLogoHeader.innerHTML = `<td colspan="4" style="background: rgba(196, 167, 125, 0.2); color: #C4A77D; font-weight: 600; text-align: left;">With Custom Logo</td>`;
    tbody.appendChild(withLogoHeader);

    data.withLogo.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = row.map(cell => `<td>${cell}</td>`).join('');
        tbody.appendChild(tr);
    });
}


// ============================================
// UI INTERACTIONS
// ============================================

function initUI() {
    // Pricing tabs
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    pricingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            pricingTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updatePricingTable(tab.dataset.tab);
        });
    });

    // Initial pricing table
    updatePricingTable('8oz');

    // Navbar scroll effect
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            console.log('Form submitted:', data);

            // Show success message (in production, send to server)
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const cup = card.querySelector('.cup-illustration');
            if (cup) {
                cup.style.animation = 'none';
                cup.offsetHeight; // Trigger reflow
                cup.style.animation = 'cupFloat 2s ease-in-out infinite';
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll('.section-header, .product-card, .value-item, .contact-method').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animate-in styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}


// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js cup scene
    new CupScene();

    // Initialize UI
    initUI();

    console.log('ecoform website initialized');
});
