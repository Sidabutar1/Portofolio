/**
 * Fungsi untuk Membuka Modal
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
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
    
    const name = document.getElementById('sender-name').value;
    const message = document.getElementById('sender-message').value;
    const phoneNumber = "6281375200897"; // Format internasional tanpa '+'
    
    // Encode teks agar format enter dan spasi rapi di URL
    const text = encodeURIComponent(`Halo Pino, saya ${name}.\n\n${message}`);
    const waUrl = `https://wa.me/${phoneNumber}?text=${text}`;
    
    window.open(waUrl, '_blank');
}
