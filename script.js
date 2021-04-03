function prefillValues(valuesList) {
    let ids = ["name", "toner-price", "toner-pages", "drum-price",
    "drum-pages", "taxes", "pages-year", "printer-price",
    "startkit-pages"];

    for(let i=0 ; i<valuesList.length ; i++) {
        document.querySelector("#" + ids[i]).value = valuesList[i];
    }
}

function round(x, y) {
    if(y == undefined) {
        y = 2;
    }
    return Number.parseFloat(x).toFixed(y);
}

function updateTotal() {
    let name = document.querySelector("#name").value;
    let tonerPrice = document.querySelector("#toner-price").value;
    let tonerPages = document.querySelector("#toner-pages").value;
    let drumPrice = document.querySelector("#drum-price").value;
    let drumPages = document.querySelector("#drum-pages").value;
    let taxes = document.querySelector("#taxes").value;
    let pagesYear = document.querySelector("#pages-year").value;
    let printerPrice = document.querySelector("#printer-price").value;
    let startkitPages = document.querySelector("#startkit-pages").value;

    // Update share URL
    
    if(tonerPrice && tonerPages) {
        document.querySelector(".share").style.display = "initial";
        let url = "https://hyakosm.net/printcost/#";
        let params = name + ',' + tonerPrice + ',' + tonerPages + ',' + drumPrice + ',';
        params += drumPages + ',' + taxes + ',' + pagesYear + ',';
        params += printerPrice + ',' + startkitPages;
        params = btoa(unescape(encodeURIComponent(params)));
        document.querySelector(".share .url").innerHTML = url + params;
    }
    else {
        document.querySelector(".share").style.display = "none";
    }

    // Add taxes

    if(taxes) {
        taxes /= 100;
        taxes += 1;
        tonerPrice, drumPrice *= taxes;
    }

    // Page cost

    let pageCost = 0;
    if(tonerPrice && tonerPages) {
        pageCost += tonerPrice / tonerPages;
    }
    if(drumPrice && drumPages) {
        pageCost += drumPrice / drumPages;
    }

    document.querySelector("#total").value = round(pageCost, 3);

    // Page cost per year

    let pageCostYear = 0;
    if(pagesYear) {
        pageCostYear = pageCost * pagesYear;
    }

    document.querySelector("#total-year").value = round(pageCostYear);

    // Yearly global costs

    let totalYearFirst = 0;
    let totalYear5 = 0;
    if(!printerPrice) {
        printerPrice = 0;
    }
    else if(taxes) {
        printerPrice *= taxes;
    }
    totalYearFirst = pageCostYear + Number.parseFloat(printerPrice);
    totalYear5 = (pageCostYear*5) + Number.parseFloat(printerPrice);
    if(startkitPages) {
        let startkitPagesCost = startkitPages * pageCost;
        totalYearFirst = subStartkitToYearlyCost(totalYearFirst, startkitPagesCost, printerPrice);
        totalYear5 = subStartkitToYearlyCost(totalYear5, startkitPagesCost, printerPrice);
    }
    document.querySelector("#total-year-first").value = round(totalYearFirst);
    document.querySelector("#total-year-5").value = round(totalYear5);
    document.querySelector("#moy-year-5").value = round(totalYear5 / 5);
}

function subStartkitToYearlyCost(yearlyCost, startkitPagesCost, printerPrice) {
    if(yearlyCost - startkitPagesCost > printerPrice) {
        return yearlyCost - startkitPagesCost;
    }
    else {
        return printerPrice;
    }
}

function copyLink() {
    let urlTextareaForClipboard = document.createElement('textarea');
    urlTextareaForClipboard.value = document.querySelector(".share .url").innerHTML;
    document.body.appendChild(urlTextareaForClipboard);
    urlTextareaForClipboard.select();
    document.execCommand('copy');
    document.body.removeChild(urlTextareaForClipboard);
}
