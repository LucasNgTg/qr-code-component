const scroller = document.getElementById("scroller");
const scrollerInner = document.getElementById("scroller-inner");
const cards = document.querySelectorAll(".container");

const scrollValues = ["first", "second__transition", "second", "third", "fourth"];

let scrollValue = 0;
let shouldBreak = false;

duplicateItems();
centralizeScroller();

let infiniteLoop = setInterval(() => {
    standardBehaviour();
}, 4000);

function cardCycle() {
    clearInterval(infiniteLoop);
    incrementOnDemand();

    setTimeout(() => {
        scrollerInner.setAttribute("data-transition", false);
        incrementOnDemand();
    }, 3800);

    setTimeout(() => {
        scrollerInner.setAttribute("data-transition", true);
        incrementOnDemand();

        infiniteLoop = setInterval(() => {
            standardBehaviour();
        }, 4000);
    }, 4000);
}

function duplicateItems() {
    scrollableItems = Array.from(scrollerInner.children);

    scrollableItems.forEach((item) => {
        let cloned = item.cloneNode(true);
        scrollerInner.appendChild(cloned);
    })
}

function centralizeScroller() {
    let outerCoords = scroller.getBoundingClientRect();

    let cardCoords = cards[0].getBoundingClientRect();

    let correctionValue = cardCoords.width / 2;

    scrollerInner.style.left = window.scrollX + outerCoords.width / 2 - correctionValue + "px";
}

function standardBehaviour() {
    switch (scrollValue) {
        case 0:
            cardCycle();
            break;
        case scrollerInner.children.length / 2:
            scrollValue = 0;
            scrollerInner.setAttribute("data-selected", scrollValues[scrollValue]);
            break;
        default:
            scrollValue++;
            scrollerInner.setAttribute("data-selected", scrollValues[scrollValue]);
    }
}

function incrementOnDemand() {
    if (scrollValue === scrollerInner.children.length / 2) {
        scrollValue = 0;
    } else {
        scrollValue++;
    }
    scrollerInner.setAttribute("data-selected", scrollValues[scrollValue]);
}