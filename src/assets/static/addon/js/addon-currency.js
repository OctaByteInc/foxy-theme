function saveOriginalValue(){
    var moneySpan = document.getElementsByClassName("money");
    for (money of moneySpan) {
        money.style.display = 'block';
        money.setAttribute('obc-money', money.innerText);
    }
}