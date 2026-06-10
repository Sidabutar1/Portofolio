/**
 * Sistem Sintesis Suara UI Cyber menggunakan Web Audio API
 */
let audioCtx;
function playUISound(type = 'click') {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        
        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
            gainNode.gain.setValueAtTime(0.05, now); // Volume halus (5%)
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now); osc.stop(now + 0.05);
        } else if (type === 'open' || type === 'close') {
            osc.type = 'triangle';
            const startFreq = type === 'open' ? 300 : 600;
            const endFreq = type === 'open' ? 600 : 300;
            osc.frequency.setValueAtTime(startFreq, now);
            osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.1);
            gainNode.gain.setValueAtTime(0.02, now); // Volume sangat halus (2%)
            gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
        }
    } catch (e) { /* Abaikan jika browser tidak mendukung audio (Silent fail) */ }
}

/**
 * Fungsi untuk Membuka Modal
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        playUISound('open');
        modal.style.display = "block";
        // Mencegah body di background bisa di-scroll saat modal terbuka
        document.body.style.overflow = "hidden"; 
    }
}

/**
 * Fungsi untuk Menutup Modal
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        playUISound('close');
        modal.style.display = "none";
        document.body.style.overflow = "auto"; 
    }
}

/**
 * Fungsi untuk membuka modal gambar sertifikat
 * @param {string} imgUrl - URL gambar sertifikat
 */
function openCert(imgUrl) {
    document.getElementById('cert-full-img').src = imgUrl;
    openModal('cert-image-modal');
}

/**
 * Menutup modal jika area di luar konten modal (overlay gelap) di-klik
 */
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        playUISound('close');
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

/**
 * Fungsi untuk mengganti gambar utama di galeri Modal
 * @param {string} imageSrc - URL/Source gambar
 * @param {HTMLElement} thumbnailElement - Element gambar kecil yang diklik
 * @param {string} mainImgId - ID gambar utama yang akan diganti (default: 'main-img')
 */
function changeImage(imageSrc, thumbnailElement, mainImgId = 'main-img') {
    // Mengubah sumber gambar utama
    document.getElementById(mainImgId).src = imageSrc;
    
    // Mengelola status 'active' (border nyala) pada thumbnail
    const gallery = thumbnailElement.closest('.modal-gallery');
    if (gallery) {
        const thumbs = gallery.querySelectorAll('.thumb');
        thumbs.forEach(thumb => thumb.classList.remove('active'));
    }
    thumbnailElement.classList.add('active');
}

/**
 * Efek Parallax pada Latar Belakang & Elemen Glow
 */
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const blobs = document.querySelectorAll('.glow-blob');
    
    // Menggerakkan blobs dengan kecepatan berbeda (Parallax)
    if (blobs.length >= 2) {
        blobs[0].style.transform = `translateY(${scrolled * 0.3}px)`; // Bergerak lambat ke bawah
        blobs[1].style.transform = `translateY(${scrolled * -0.2}px)`; // Bergerak perlahan ke atas
    }
    
    // Menggerakkan Indikator Scroll Progress Bar
    const scrollBar = document.getElementById('scrollBar');
    if (scrollBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolledPercentage = (winScroll / height) * 100;
        scrollBar.style.width = scrolledPercentage + "%";
    }
    
    // Menampilkan Tombol Scroll to Top jika sudah di-scroll ke bawah > 400px
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrolled > 400) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

/**
 * Intersection Observer untuk Scroll Reveal (Animasi Muncul Section)
 */
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Section akan muncul saat 15% bagiannya terlihat di layar
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Berhenti mengamati setelah elemen muncul agar animasinya tidak berulang
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Menerapkan observer ke semua elemen dengan class .scroll-reveal
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => sectionObserver.observe(el));
    
    updateFavicon(); // Jalankan script pembuat favicon modern
});

/**
 * Animasi Glitch Teks Hero (Acak)
 */
document.addEventListener('DOMContentLoaded', () => {
    const heroName = document.getElementById('hero-name');
    if (heroName) {
        function triggerGlitch() {
            heroName.classList.add('glitch-active');
            setTimeout(() => {
                heroName.classList.remove('glitch-active');
            }, 300); // Durasi efek glitch 300ms

            // Jadwalkan glitch berikutnya secara acak (antara 3 hingga 8 detik)
            const nextGlitch = Math.random() * 5000 + 3000;
            setTimeout(triggerGlitch, nextGlitch);
        }
        setTimeout(triggerGlitch, 2000); // Glitch pertama setelah 2 detik
    }
});

/**
 * Logic untuk Filter Kategori Portofolio
 */
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playUISound('click'); // Mainkan efek suara siber
            
            // Hapus class active dari semua tombol dan pindahkan ke tombol yang diklik
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hide');
                    // Memicu ulang reflow DOM agar animasi dapat di-reset
                    item.classList.remove('show-filtered');
                    void item.offsetWidth; 
                    item.classList.add('show-filtered');
                } else {
                    item.classList.add('hide');
                    item.classList.remove('show-filtered');
                }
            });
        });
    });
});

/**
 * Custom Cursor Logic (Gaya Neon Cyber)
 */
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('customCursor');
    const follower = document.getElementById('customCursorFollower');
    let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        // Dot mengikuti mouse secara real-time
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    // Follower (cincin) mengikuti dengan efek delay halus menggunakan requestAnimationFrame
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15; // Kecepatan / Kehalusan mengikuti
        followerY += (mouseY - followerY) * 0.15;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Deteksi hover pada elemen yang bisa diklik untuk mengubah kursor menjadi cincin menyala
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .clickable, .portfolio-item, .thumb, .close-modal, .filter-btn')) {
            follower.classList.add('cursor-hover');
        }
    });
    document.body.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, .clickable, .portfolio-item, .thumb, .close-modal, .filter-btn')) {
            follower.classList.remove('cursor-hover');
        }
    });
});

/**
 * Fungsi untuk scroll ke posisi paling atas secara mulus (smooth)
 */
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Fungsi ajaib untuk memodifikasi Favicon secara dinamis menjadi melingkar 
 * dan menambahkan border neon (Cyber style) menggunakan HTML5 Canvas.
 */
function updateFavicon() {
    const canvas = document.createElement('canvas');
    canvas.width = 128; // Resolusi tinggi agar tajam di layar tab
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Mengizinkan manipulasi gambar dari URL luar
    img.src = 'https://lh3.googleusercontent.com/d/1UWJludC5R-71q4dz_C6QtCPUqQg43fhU';
    
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 1. Memotong gambar asli menjadi bentuk lingkaran
        ctx.save();
        ctx.beginPath();
        ctx.arc(64, 64, 56, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, 128, 128);
        ctx.restore();
        
        // 2. Menambahkan efek cincin luar (Cyan Accent)
        ctx.beginPath();
        ctx.arc(64, 64, 60, 0, Math.PI * 2);
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#00F0FF';
        ctx.stroke();
        
        // 3. Menambahkan efek cincin tipis dalam (Purple)
        ctx.beginPath();
        ctx.arc(64, 64, 54, 0, Math.PI * 2);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#9333ea';
        ctx.stroke();
        
        // Terapkan hasil render canvas sebagai Favicon di browser
        try {
            const iconURL = canvas.toDataURL('image/png');
            const link = document.querySelector("link[rel*='icon']");
            if (link) link.href = iconURL;
        } catch (e) {
            console.log("Canvas Favicon terhalang oleh pengaturan keamanan browser.");
        }
    };
}

/**
 * Fungsi untuk mengirim pesan dari form langsung ke WhatsApp
 */
function sendToWhatsApp(event) {
    event.preventDefault(); // Mencegah reload halaman
    
    const nameInput = document.getElementById('sender-name');
    const messageInput = document.getElementById('sender-message');
    
    // Menggunakan trim() untuk memastikan input bukan sekadar spasi kosong
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    
    // Validasi ekstra: hentikan eksekusi jika input kosong
    if (!name || !message) {
        alert("Mohon lengkapi nama dan pesan Anda sebelum mengirim.");
        if (!name) nameInput.focus();
        else messageInput.focus();
        return;
    }
    
    const phoneNumber = "6281375200897"; // Format internasional tanpa '+'
    
    // Encode teks agar format enter dan spasi rapi di URL
    const text = encodeURIComponent(`Halo Pino, saya ${name}.\n\n${message}`);
    const waUrl = `https://wa.me/${phoneNumber}?text=${text}`;
    
    window.open(waUrl, '_blank');
}

// Variabel global untuk menyimpan URL sementara
let pendingNgrokUrl = "";

/**
 * Fungsi untuk membuka modal peringatan Custom Ngrok
 */
function openNgrokLink(url) {
    pendingNgrokUrl = url;
    openModal('ngrok-confirm-modal');
}

/**
 * Fungsi untuk memproses pembukaan link setelah dikonfirmasi via Modal
 */
function proceedNgrokLink() {
    if (pendingNgrokUrl) {
        window.open(pendingNgrokUrl, '_blank');
        closeModal('ngrok-confirm-modal');
        pendingNgrokUrl = ""; // Reset URL
    }
}
