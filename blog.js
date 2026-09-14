/* =====================================================
   BLOG.JS
   New Primagama Sunter Indah
===================================================== */


/* =====================================================
   HAMBURGER MENU
===================================================== */

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

if (hamburger && navMenu) {

    hamburger.addEventListener("click", function () {

        navMenu.classList.toggle("show");

    });


    /* Tutup menu setelah memilih link */

    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navMenu.classList.remove("show");

        });

    });

}


/* =====================================================
   DATA ARTIKEL
===================================================== */

const articles = [

    {
        title:
            "Belajar Lama Belum Tentu Efektif, Ini Cara Biar Belajarmu Plus Nempel!",

        category:
            "Tips Belajar",

        description:
            "Kenali cara belajar yang lebih efektif agar waktu belajar kamu benar-benar menghasilkan.",

        date:
            "2026-08-20",

        author:
            "New Primagama",

        image:
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80",

        url:
            "cara-belajar-efektif.html"
    },


    {
        title:
            "Sekolah, Tugas, Ekskul, Main, Tidur… Emang Bisa Kebagian Semua?",

        category:
            "Edukasi & Sekolah",

        description:
            "Cara mengatur waktu antara sekolah, tugas, ekskul, istirahat, dan bermain.",

        date:
            "2026-08-18",

        author:
            "New Primagama",

        image:
            "https://www.kemendikdasmen.go.id/mendikbud/image/14495",

        url:
            "sekolah-tugas-eskul-main.html"
    },


    {
        title:
            "TKA Makin Dekat? Jangan Panik, Ini yang Harus Kamu Siapin",

        category:
            "TKA",

        description:
            "Persiapan penting yang bisa dilakukan sebelum menghadapi TKA agar lebih siap.",

        date:
            "2026-08-15",

        author:
            "New Primagama",

        image:
            "https://www.kemendikdasmen.go.id/mendikbud/image/15891",

        url:
            "arti-tka-makin-dekat.html"
    },


    {
        title:
            "Tips & Trik Gaskeun Hadapi Ujian Tanpa Beban Mental!",

        category:
            "Ujian & Persiapan",

        description:
            "Strategi menghadapi ujian supaya lebih tenang dan percaya diri.",

        date:
            "2026-08-12",

        author:
            "New Primagama",

        image:
            "https://images.unsplash.com/photo-1453738773917-9c3eff1db985?auto=format&fit=crop&w=900&q=80",

        url:
            "tips-menghadapi-ujian.html"
    },


    {
        title:
            "Pendidikan: Investasi Masa Depan Biar Gak Kena Mental & Gagal Paham!",

        category:
            "Edukasi & Sekolah",

        description:
            "Pendidikan bukan hanya tentang nilai, tetapi juga bagian penting dari masa depan.",

        date:
            "2026-08-10",

        author:
            "New Primagama",

        image:
            "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",

        url:
            "arti-penting-pendidikan.html"
    }

];


/* =====================================================
   FORMAT TANGGAL INDONESIA
===================================================== */

function formatDate(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("id-ID", {

        day: "numeric",

        month: "long",

        year: "numeric"

    });

}


/* =====================================================
   BUAT CARD ARTIKEL
===================================================== */

function createArticleCard(article) {

    return `

        <article class="article-card">

            <a href="${article.url}">

                <div class="article-image">

                    <img
                        src="${article.image}"
                        alt="${article.title}"
                        loading="lazy"
                    >

                </div>

            </a>


            <div class="article-content">

                <span class="article-category">
                    ${article.category}
                </span>


                <h3 class="article-title">
                    ${article.title}
                </h3>


                <p class="article-description">
                    ${article.description}
                </p>


                <div class="article-meta">

                    <span>
                        ${article.author}
                    </span>

                    <span class="meta-dot"></span>

                    <span>
                        ${formatDate(article.date)}
                    </span>

                </div>


                <a
                    href="${article.url}"
                    class="read-more"
                >
                    Baca selengkapnya →
                </a>

            </div>

        </article>

    `;

}


/* =====================================================
   SORT ARTIKEL TERBARU
===================================================== */

const latestArticles = [...articles].sort(function (a, b) {

    return new Date(b.date) - new Date(a.date);

});


/* =====================================================
   RENDER LATEST
===================================================== */

function renderLatest() {

    const latestGrid = document.querySelector(
        ".latest-section .article-grid"
    );

    if (!latestGrid) return;


    latestGrid.innerHTML = "";


    /*
       Ambil maksimal 4 artikel terbaru
    */

    latestArticles
        .slice(0, 4)
        .forEach(function (article) {

            latestGrid.insertAdjacentHTML(
                "beforeend",
                createArticleCard(article)
            );

        });

}


/* =====================================================
   RENDER KATEGORI
===================================================== */

function renderCategory(categoryName) {

    const sections = document.querySelectorAll(
        ".blog-section"
    );


    sections.forEach(function (section) {

        const title = section.querySelector(
            ".section-title"
        );

        if (!title) return;


        const sectionTitle =
            title.textContent.trim();


        /*
           Jangan render bagian LATEST
        */

        if (section.classList.contains("latest-section")) {
            return;
        }


        /*
           Cek apakah section cocok dengan kategori
        */

        if (
            sectionTitle.toLowerCase() !==
            categoryName.toUpperCase()
        ) {
            return;
        }


        const grid = section.querySelector(
            ".article-grid"
        );

        if (!grid) return;


        const categoryArticles =
            latestArticles.filter(function (article) {

                return article.category === categoryName;

            });


        grid.innerHTML = "";


        categoryArticles.forEach(function (article) {

            grid.insertAdjacentHTML(
                "beforeend",
                createArticleCard(article)
            );

        });

    });

}


/* =====================================================
   RENDER SEMUA KATEGORI
===================================================== */

function renderAllCategories() {

    const categories = [

        "TKA",

        "Tips Belajar",

        "Edukasi & Sekolah",

        "Ujian & Persiapan"

    ];


    categories.forEach(function (category) {

        renderCategory(category);

    });

}


/* =====================================================
   TOMBOL "LIHAT SEMUA"
===================================================== */

function setupSeeAllButtons() {

    const buttons = document.querySelectorAll(
        ".see-all"
    );


    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                /*
                   Kalau href masih #
                   jangan pindah ke atas halaman
                */

                if (
                    button.getAttribute("href") === "#"
                ) {

                    event.preventDefault();

                }


                const category =
                    button.dataset.category;


                /*
                   Kalau tombol memiliki data-category,
                   tampilkan semua artikel kategori tersebut.
                */

                if (category) {

                    showAllCategoryArticles(category);

                }

            }
        );

    });

}


/* =====================================================
   TAMPILKAN SEMUA ARTIKEL KATEGORI
===================================================== */

function showAllCategoryArticles(categoryName) {

    const sections =
        document.querySelectorAll(".blog-section");


    sections.forEach(function (section) {

        const title =
            section.querySelector(".section-title");


        if (!title) return;


        const sectionTitle =
            title.textContent.trim();


        if (
            sectionTitle.toLowerCase() !==
            categoryName.toUpperCase()
        ) {
            return;
        }


        const grid =
            section.querySelector(".article-grid");


        if (!grid) return;


        const categoryArticles =
            latestArticles.filter(function (article) {

                return article.category === categoryName;

            });


        grid.innerHTML = "";


        categoryArticles.forEach(function (article) {

            grid.insertAdjacentHTML(
                "beforeend",
                createArticleCard(article)
            );

        });


        /*
           Scroll ke bagian kategori
        */

        section.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    });

}


/* =====================================================
   ANIMASI CARD SAAT MUNCUL
===================================================== */

function setupCardAnimation() {

    const cards =
        document.querySelectorAll(".article-card");


    if (!("IntersectionObserver" in window)) {
        return;
    }


    const observer =
        new IntersectionObserver(

            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity = "1";

                        entry.target.style.transform =
                            "translateY(0)";

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.08
            }

        );


    cards.forEach(function (card) {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(15px)";

        card.style.transition =
            "opacity 0.5s ease, transform 0.5s ease";


        observer.observe(card);

    });

}


/* =====================================================
   UPDATE TAHUN FOOTER
===================================================== */

function updateFooterYear() {

    const footerBottom =
        document.querySelector(".footer-bottom");


    if (!footerBottom) return;


    footerBottom.innerHTML =
        `© ${new Date().getFullYear()} New Primagama Sunter Indah. All Rights Reserved.`;

}


/* =====================================================
   JALANKAN BLOG
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
           Render artikel terbaru
        */

        renderLatest();


        /*
           Render semua kategori
        */

        renderAllCategories();


        /*
           Aktifkan tombol LIHAT SEMUA
        */

        setupSeeAllButtons();


        /*
           Update tahun footer
        */

        updateFooterYear();


        /*
           Animasi artikel
        */

        setupCardAnimation();

    }
);
