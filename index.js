let books = Array.from(document.getElementsByClassName("book-rack__book-cover"));
let bookstand = document.querySelector(".book-rack");
const header = document.querySelector(".header");
let overlay = document.querySelector(".overlay");
let popup = document.querySelector(".popup");
const popupText = document.querySelector(".popup__text");
const popupFormClose = document.querySelector(".popup__close_type_form");
const popupGreetingClose = document.querySelector(".popup__close_type_greeting");

function enableAnimation() {
    document.addEventListener("scroll", function () {
        let scrollY = window.pageYOffset;
        if (scrollY < 100) {
            books[0].classList.remove("animation");
        } else if (scrollY >= 100 && scrollY < 600) {
            books[0].classList.add("animation");
            books[1].classList.remove("animation");
        } else if (scrollY >= 600 && scrollY < 1100) {
            books[0].classList.remove("animation");
            books[1].classList.add("animation");
            books[2].classList.remove("animation");
        } else if (scrollY >= 1100 && scrollY < 1600) {
            books[1].classList.remove("animation");
            books[2].classList.add("animation");
            bookstand.classList.remove("book-rack_absolute-position")
            header.classList.remove("header_absolute-position");
        } else if (scrollY >= 1600 && scrollY < 2550) {
            books[2].classList.remove("animation");
            header.classList.remove("header_sticky");
            header.classList.add("header_absolute-position");
            bookstand.classList.add("book-rack_absolute-position");
        } else if (scrollY >= 2550) {
            header.classList.remove("header_absolute-position");
            header.classList.add("header_sticky");
        }
    });
}

enableAnimation();

function disableAnimation() {
    books.forEach(book => {
        book.classList.remove("animation");
    })
}

document.addEventListener("mouseover", (e) => {
    if (e.target.classList.contains("book-rack__book-cover")) {
        disableAnimation();
    }
});

const formElement = document.querySelector('.popup__form');
const formInput = Array.from(formElement.querySelectorAll('.popup__form__input'));
const buttonElement = formElement.querySelector(`.popup__form__submit`);
const formSendText = formElement.querySelector('.popup__form__send-text');

function openForm() {
    overlay.classList.add("overlay_show");
    popup.classList.add("popup_show");
    formElement.classList.add("popup__form_show");
    document.body.style.overflowY = "hidden";
    popupFormClose.classList.add("popup__close_type_form_show");
    popupGreetingClose.classList.remove("popup__close_type_greeting_show");
}

function closeForm() {
    overlay.classList.remove("overlay_show");
    popup.classList.remove("popup_show");
    formElement.classList.remove("popup__form_show");
    document.body.style.overflowY = "";
    popupFormClose.classList.remove("popup__close_type_form_show");
}

const showInputError = (element, span, id) => {
    element.classList.add("popup__form__input_type_error");

    if (id === "email") {
        span.textContent = "Почта должна содержать @, а также символы до и после неё";
    } else if (id === "telephone") {
        span.textContent = "Телефон должен начинаться с 7, а также содержать 10 цифр после неё";
    } else {
        span.textContent = "Вводите текст только кириллицей";
    }

    span.classList.add("popup__form__input-error_show");
};

const hideInputError = (element, formError) => {
    element.classList.remove("popup__form__input_type_error");
    formError.classList.remove("popup__form__input-error_show");
};

const validatePhone = (e) => {
    const phoneRegex = /^7\d{10}$/;
    return phoneRegex.test(e.value);
};

const cleanPhone = (value) => {
    return value.replace(/\D/g, '');
};

const isValid = (e) => {
    if (e.type === 'tel') {
        e.value = cleanPhone(e.value);
        if (!validatePhone(e)) {
            let formError = formElement.querySelector(`.${e.id}-error`);
            showInputError(e, formError, e.id);
            return;
        }
    }

    if (e.id === 'message') {
        const pattern = /^[А-Яа-яЁё\s]+$/;
        const formError = formElement.querySelector(`.${e.id}-error`);

        if (e.value.trim() !== "" && !pattern.test(e.value.trim())) {
            showInputError(e, formError, 'message');
            return;
        } else {
            hideInputError(e, formError);
        }
    }

    let formError = formElement.querySelector(`.${e.id}-error`);
    if (!e.validity.valid) {
        showInputError(e, formError, e.id);
    } else {
        hideInputError(e, formError);
    }
};

const hasInvalidInput = (inputList) => {
    return inputList.some((e) => {
        if (e.id === "message") {
            const pattern = /^[А-Яа-яЁё\s]+$/;
            return e.value.trim() !== "" && !pattern.test(e.value.trim());
        }

        return !e.validity.valid;
    });
};

const toggleButtonState = (inputList, buttonElement) => {
    if (hasInvalidInput(inputList)) {
        buttonElement.disabled = true;
    } else {
        buttonElement.disabled = false;
    }
};

formInput.forEach((e) => {
    toggleButtonState(formInput, buttonElement);

    e.addEventListener("input", function () {
        isValid(e);
        toggleButtonState(formInput, buttonElement);
    });
});

const enableValidation = () => {
    formElement.addEventListener('submit', function (evt) {
        evt.preventDefault();

        if (!hasInvalidInput(formInput)) {
            formSendText.classList.add("popup__form__send-text_show");
            formSendText.textContent = "Отправляем...";

            setTimeout(() => {
                const formData = new FormData(formElement);
                fetch(formElement.action, {
                    method: 'POST', body: formData
                }).then((response) => {
                    if (response.ok) {
                        formSendText.classList.remove("popup__form__send-text_show");
                        setTimeout(() => {
                            formSendText.classList.add("popup__form__send-text_show");
                            formSendText.textContent = "Ваша заявка отправлена!";
                            formElement.reset();
                            toggleButtonState(formInput, buttonElement)
                            setTimeout(() => {
                                formSendText.classList.remove("popup__form__send-text_show");
                                setTimeout(() => {
                                    formSendText.textContent = "";
                                }, 1000);
                            }, 3000);
                        }, 1000);
                    } else {
                        alert("Ошибка при отправке формы");
                    }
                })
            }, 1000);
        }
    });
};

enableValidation();

let background = document.querySelector(".stamps");

document.addEventListener("mousemove", function (evt) {
    let centerX = window.innerWidth / 2;
    let offsetX = (evt.clientX - centerX) / 15;
    background.setAttribute("transform", `translate(${offsetX}, 0)`);
});

const book = document.querySelector(".book");
const stampImageContainers = Array.from(document.querySelectorAll(".book__page__stamp__image"));

function handleClick(bookCover) {
    const computedStyle = getComputedStyle(bookCover);
    const bgColor = computedStyle.backgroundColor;

    window.location.href = "#book";
    book.style.backgroundColor = bgColor;
    book.classList.add("book_show");
    if (bookCover.classList.contains("book-rack__book-cover_third")) {
        stampImageContainers.forEach((image, index) => {
            image.style.backgroundImage = `url('img/cosmos_${index + 1}.webp')`;
        });
    } else if (bookCover.classList.contains("book-rack__book-cover_first")) {
        stampImageContainers.forEach((image, index) => {
            image.style.backgroundImage = `url('img/nature_${index + 1}.webp')`;
        });
    } else if (bookCover.classList.contains("book-rack__book-cover_second")) {
        stampImageContainers.forEach((image, index) => {
            image.style.backgroundImage = `url('img/sport_${index + 1}.webp')`;
        });
    }
}

const slider = document.querySelector(".slider");
const sliderImage = document.querySelector(".slider__image");
const leftSlider = document.querySelector(".slider__left");
const rightSlider = document.querySelector(".slider__right");

function openSlider(element) {
    const computedStyle = getComputedStyle(element);
    const bgImage = computedStyle.backgroundImage;


    const currIndex = stampImageContainers.findIndex(elem => getComputedStyle(elem).backgroundImage === bgImage);
    if (currIndex === 0) {
        console.log("true");
        leftSlider.disabled = true;
    } else if (currIndex === stampImageContainers.length - 1) {
        rightSlider.disabled = true;
    }

    overlay.classList.add("overlay_show");
    slider.classList.add("slider_show");
    document.body.style.overflowY = "hidden";
    sliderImage.style.backgroundImage = bgImage;
}

function closeSlider() {
    overlay.classList.remove("overlay_show");
    slider.classList.remove("slider_show");
    document.body.style.overflowY = "";
    leftSlider.disabled = false;
    rightSlider.disabled = false;
}

function slideLeft() {
    const image = document.querySelector(".slider__image");
    const currIndex = stampImageContainers.findIndex(elem => getComputedStyle(elem).backgroundImage === getComputedStyle(image).backgroundImage);
    image.style.backgroundImage = getComputedStyle(stampImageContainers[currIndex - 1]).backgroundImage;
    if (currIndex - 1 === 0) {
        leftSlider.disabled = true;
    }
    rightSlider.disabled = false;
}

function slideRight() {
    const image = document.querySelector(".slider__image");
    const currIndex = stampImageContainers.findIndex(elem => getComputedStyle(elem).backgroundImage === getComputedStyle(image).backgroundImage);
    image.style.backgroundImage = getComputedStyle(stampImageContainers[currIndex + 1]).backgroundImage;
    if (currIndex + 1 === stampImageContainers.length - 1) {
        rightSlider.disabled = true;
    }
    leftSlider.disabled = false;
}

const date = new Date('2025-07-21T23:59:59');

setInterval(() => {
    const now = new Date();
    const diff = Math.max(date - now, 0);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);


    const formattedTime = `${days} дн. ${hours} ч. ${minutes} мин. ${seconds} сек.`;

    const footerTimer = document.querySelector(".footer__timer");
    footerTimer.textContent = formattedTime;
}, 1000);



function showGreetingPopup() {
    overlay.classList.add("overlay_show");
    popup.classList.add("popup_show");
    popupText.classList.add("popup__text_show");
    popupGreetingClose.classList.add("popup__close_type_greeting_show");
}

function closeGreetingPopup() {
    overlay.classList.remove("overlay_show");
    popup.classList.remove("popup_show");
    popupText.classList.remove("popup__text_show");
    popupGreetingClose.classList.remove("popup__close_type_greeting_show");
    localStorage.setItem('popupClosed', 'true');
}

const isPopupClosed = localStorage.getItem('popupClosed');

if (!isPopupClosed) {
    setTimeout(showGreetingPopup, 10000);
}
