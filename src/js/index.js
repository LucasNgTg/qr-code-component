const scroller = document.getElementById("scroller");
const scrollerInner = document.getElementById("scroller-inner");

const scrollValues = ["first", "second__transition", "second", "third", "fourth"];
const actualScrollValues = ["first", "second", "third", "fourth"];

let scrollValue = 0;

duplicateItems();

const cards = document.querySelectorAll(".container");

centralizeScroller();

// Setting up the loop
// 3650 = 4 seconds - 350 ms (timeout)
let infiniteLoop = cycleCards(3650);

// Setting hover Event Listeners to every card to stop the loop
cards.forEach(card => {
    card.addEventListener("mouseover", () => {
        clearInterval(infiniteLoop);
    });
    card.addEventListener("mouseleave", () => {
        infiniteLoop = cycleCards(3650);
    });
});

// Setting click Event Listeners to every card
// 1. Clicking on each card should lead to itself
// 2. The original and the cloned cards should lead to the same respective card
// 3. When clicking on the second card, the clone is selected, then is seamlessly switched with the original
// 4. When clicking on the first card while the second card is selected, seamlessly switch to the second card's clone, then transition to the first card
for (let i = 0; i < cards.length; i++) {
    if (i === 0) {
        cards[i].addEventListener("click", () => {
            scrollerInner.setAttribute("data-transition", false);
            scrollValue = 1;
            scrollerInner.setAttribute("data-selected", scrollValues[1]);
            setTimeout(() => {
                scrollerInner.setAttribute("data-transition", true);
                scrollValue--;
                scrollerInner.setAttribute("data-selected", scrollValues[scrollValue]);
            }, 1);
        });
    } else if (i > 0 && i < cards.length / 2) {
        cards[i].addEventListener("click", () => {
            scrollValue = i;
            scrollerInner.setAttribute("data-selected", actualScrollValues[i]);
        });
    } else if (i === cards.length / 2 + 1) {
        cards[i].addEventListener("click", () => {
            scrollValue = 1;
            scrollerInner.setAttribute("data-selected", scrollValues[1]);
            setTimeout(() => {
                scrollerInner.setAttribute("data-transition", false);
                scrollValue++;
                scrollerInner.setAttribute("data-selected", scrollValues[scrollValue]);
            }, 300);
            setTimeout(() => {
                scrollerInner.setAttribute("data-transition", true);
            }, 350);
        });
    } else {
        cards[i].addEventListener("click", () => {
            scrollValue = i - cards.length / 2;
            scrollerInner.setAttribute("data-selected", actualScrollValues[i - cards.length / 2]);
        });
    }
}

// Create copies of the cards
function duplicateItems() {
    scrollableItems = Array.from(scrollerInner.children);

    scrollableItems.forEach((item) => {
        let cloned = item.cloneNode(true);
        scrollerInner.appendChild(cloned);
    })
}

// Position the scrollable items such that one card is always on the center
function centralizeScroller() {
    let outerCoords = scroller.getBoundingClientRect();

    let cardCoords = cards[0].getBoundingClientRect();

    let correctionValue = cardCoords.width / 2;

    scrollerInner.style.left = window.scrollX + outerCoords.width / 2 - correctionValue + "px";
}

// 1. Go to next card
// 2. If the last card is selected, go to first card
// 3. If the first card is selected, go to the cloned version of the second card, then seamlessly switch to the original second card
async function standardBehaviour() {
    switch (scrollValue) {
        case 0:
            scrollValue++;
            scrollerInner.setAttribute("data-selected", scrollValues[scrollValue]);
            scrollerInner.setAttribute("data-selected", scrollValues[1]);
            setTimeout(() => {
                scrollerInner.setAttribute("data-transition", false);
                scrollValue++;
                scrollerInner.setAttribute("data-selected", scrollValues[scrollValue]);
            }, 300);
            setTimeout(() => {
                scrollerInner.setAttribute("data-transition", true);
            }, 350);
            break;
        case scrollerInner.children.length / 2:
            scrollValue = 0;
            scrollerInner.setAttribute("data-selected", scrollValues[scrollValue]);
            await sleep(350);
            break;
        default:
            scrollValue++;
            scrollerInner.setAttribute("data-selected", scrollValues[scrollValue]);
            await sleep(350);
    }
}

// Go to next card every X seconds
function cycleCards(time) {
    return setInterval(() => {
        standardBehaviour();
    }, time);
}

// Makeshift sleep function (use with async/await)
// Necessary to compensate for the Timeout in "case 0" of "standardBehaviour"
function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}