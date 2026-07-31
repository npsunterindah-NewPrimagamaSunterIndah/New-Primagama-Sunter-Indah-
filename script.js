/*=========================================
            HAMBURGER MENU
=========================================*/

const hamburger =
document.getElementById("hamburger");

const navMenu =
document.querySelector(".nav-menu");


if(hamburger && navMenu){

    hamburger.addEventListener("click",()=>{

        navMenu.classList.toggle("active");

    });

}




/*=========================================
          CLOSE MENU MOBILE
=========================================*/

const menuLinks =
document.querySelectorAll(".nav-menu a");


menuLinks.forEach(link=>{

    link.addEventListener("click",()=>{

        if(navMenu){

            navMenu.classList.remove("active");

        }

    });

});




/*=========================================
            SMOOTH SCROLL
=========================================*/

document
.querySelectorAll('a[href^="#"]')

.forEach(anchor=>{

    anchor.addEventListener("click",function(e){

        const target =
        document.querySelector(
        this.getAttribute("href")
        );

        if(target){

            e.preventDefault();

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});





/*=========================================
            NAVBAR SCROLL
=========================================*/

const navbar =
document.querySelector(".navbar");


window.addEventListener("scroll",()=>{

    if(!navbar) return;

    if(window.scrollY > 50){

        navbar.classList.add("scroll");

    }

    else{

        navbar.classList.remove("scroll");

    }

});

/*=========================================
          PROGRAM BELAJAR TAB
=========================================*/

const tabButtons =
document.querySelectorAll(".tab-button");

const tabContents =
document.querySelectorAll(".program-content");


tabButtons.forEach(button=>{

    button.addEventListener("click",()=>{


        /* HAPUS ACTIVE */

        tabButtons.forEach(btn=>{

            btn.classList.remove("active");

        });


        tabContents.forEach(content=>{

            content.classList.remove("active");

        });


        /* TAMBAH ACTIVE */

        button.classList.add("active");


        const target =
        button.getAttribute("data-tab");


        const content =
        document.getElementById(target);


        if(content){

            content.classList.add("active");

        }


    });

});

/*=========================================
                FAQ
=========================================*/

const faqItems =
document.querySelectorAll(".faq-item");


faqItems.forEach(item=>{

    const question =
    item.querySelector(".faq-question");


    question.addEventListener("click",()=>{


        item.classList.toggle("active");


    });


});

/*=========================================
            FASILITAS
=========================================*/

const facilityButtons =
document.querySelectorAll(".facility-btn");

const facilityImage =
document.getElementById("facility-image");

const facilityTitle =
document.getElementById("facility-title");

const facilityText =
document.getElementById("facility-text");


facilityButtons.forEach(button=>{


    button.addEventListener("click",()=>{


        facilityButtons.forEach(btn=>{

            btn.classList.remove("active");

        });


        button.classList.add("active");


        const image =
        button.dataset.image;

        const title =
        button.dataset.title;

        const description =
        button.dataset.description;



        if(facilityImage){

            facilityImage.src = image;

        }


        if(facilityTitle){

            facilityTitle.textContent =
            title;

        }


        if(facilityText){

            facilityText.textContent =
            description;

        }


    });


});

/*=========================================
                WHATSAPP
=========================================*/

const nomorWA =
"6285285705335";


function bukaWhatsApp(){


    const pesan =

    "Halo New Primagama Sunter Indah, saya ingin berkonsultasi mengenai program belajar.";


    const url =

    `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;


    window.open(url,"_blank");

}



/* BUTTON WEBSITE */

const waButtons =

document.querySelectorAll(

".btn-navbar, .btn-secondary, .btn-program"

);


waButtons.forEach(button=>{

    button.addEventListener("click",(e)=>{

        e.preventDefault();

        bukaWhatsApp();

    });

});



/* FLOATING WA */

const floatingWA =

document.getElementById("floating-whatsapp");


if(floatingWA){

    floatingWA.addEventListener("click",()=>{

        bukaWhatsApp();

    });

}

/*=========================================
            BACK TO TOP
=========================================*/

const backToTop =
document.getElementById("backToTop");


window.addEventListener("scroll",()=>{


    if(!backToTop) return;


    if(window.scrollY > 400){

        backToTop.style.display =

        "block";

    }

    else{

        backToTop.style.display =

        "none";

    }


});


if(backToTop){

    backToTop.addEventListener("click",()=>{


        window.scrollTo({

            top:0,
            behavior:"smooth"

        });


    });

}




/*=========================================
            SCROLL ANIMATION
=========================================*/

const hiddenElements =

document.querySelectorAll(

".section-title, .tentang-wrapper, .program-content, .mengapa-card, .fasilitas-preview, .faq-item, .kontak-card"

);



const observer =

new IntersectionObserver((entries)=>{


    entries.forEach(entry=>{


        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }


    });


},{
    threshold:0.15
});



hiddenElements.forEach(element=>{

    element.classList.add("hidden");

    observer.observe(element);

});

