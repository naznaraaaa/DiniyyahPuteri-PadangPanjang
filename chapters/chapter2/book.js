
document.addEventListener("DOMContentLoaded", function () {
    const bookElement = document.getElementById("book");
    const openButton = document.getElementById("openBookButton");
    const bookStart = document.getElementById("bookStart");
    const bookControls = document.getElementById("bookControls");
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
    const pageNumber = document.getElementById("pageNumber");

    // Pastikan elemen buku dan library tersedia
    if (!bookElement || typeof St === "undefined" || !St.PageFlip) {
        console.error("Library PageFlip atau elemen buku tidak ditemukan.");
        return;
    }

    // Ambil seluruh halaman buku dari HTML
    const pages = bookElement.querySelectorAll(".book-page");

    // Buat efek buku dan animasi membalik halaman
    const pageFlip = new St.PageFlip(bookElement, {
       width: 400,
       height: 550,
       size: "stretch",
 

        minWidth: 150,
        maxWidth: 400,
        minHeight: 300,
        maxHeight: 550,

        showCover: true,
        usePortrait: true,
        startPage: 0,
        flippingTime: 900,
        drawShadow: true,
        maxShadowOpacity: 0.45,
        mobileScrollSupport: false,
        clickEventForward: true,
        useMouseEvents: true,
        autoSize: true
    });

    pageFlip.loadFromHTML(pages);

    // Perbarui tulisan nomor halaman 
function updatePageNumber(index) {
    if (index === 0) {
        pageNumber.textContent = "Sampul Depan";
    } else if (index >= pages.length - 1) {
        pageNumber.textContent = "Sampul Belakang";
    } else {
        pageNumber.textContent =
            "Halaman " + index + " dari " + (pages.length - 2);
    }
}

    // Saat halaman berubah
    pageFlip.on("flip", function (event) {
        updatePageNumber(event.data);
    });

    // Buka buku ketika tombol ditekan
    openButton.addEventListener("click", function () {
        pageFlip.flipNext();

        bookStart.hidden = true;
        bookControls.hidden = false;
    });

    // Halaman sebelumnya
    prevButton.addEventListener("click", function () {
        pageFlip.flipPrev();
    });

    // Halaman berikutnya
    nextButton.addEventListener("click", function () {
        pageFlip.flipNext();
    });

    updatePageNumber(0);
});
