import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

export const initSwiper = () => {
    return new Swiper(".swiper", {
        slidesPerView: "auto",
        spaceBetween: 16,
    });
};

export const rutSwiper = () => {
    function updatePagination(swiper) {
        const pagination = swiper.el.querySelector(".pagination");
        const currentPage = swiper.el.querySelector(".current-page");
        const totalPage = swiper.el.querySelector(".total-page");

        if (!pagination || !currentPage || !totalPage) return;

        // progress가 1에 가까우면 마지막 페이지로 설정
        const isAtEnd = swiper.progress >= 0.99;
        const current = isAtEnd
            ? String(swiper.slides.length)
            : String(swiper.activeIndex + 1);
        const total = String(swiper.slides.length);

        currentPage.textContent = current;
        totalPage.textContent = total;
        pagination.style.display = "block";
    }

    return new Swiper(".rut-swiper", {
        slidesPerView: "auto",
        loop: false,
        spaceBetween: 10,
        on: {
            init: updatePagination,
            slideChange: updatePagination,
            progress: updatePagination, // 스크롤 진행도 감지
        },
    });
};

export const cardSwiper = () => {
    return new Swiper(".card-swiper", {
        slidesPerView: "auto",
        spaceBetween: 10,
    });
};

export const healthCardSwiper = () => {
    return new Swiper(".card-swiper", {
        slidesPerView: "auto",
        spaceBetween: 10,        // 카드 사이 간격
        centeredSlides: false,   // 왼쪽 정렬 시작
        slidesOffsetBefore: 16,
        slidesOffsetAfter: 16,
        loop: false,
        pagination: {
            el: ".swiper-pagination",
            type: "fraction",
        },
    });
};