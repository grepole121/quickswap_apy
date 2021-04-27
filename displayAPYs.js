// Run the next page function whenever the body is clicked
document.body.onclick = nextPage;

// Checks if it has been ran before and sets prevPageNum to the current page if running for the first time
// Gets the current page
// Checks if current page and previous page are the same
// If on a new page run main
function nextPage() {
  if (typeof prevPageNum == "undefined") {
    prevPageNum = parseInt(
      document.getElementsByClassName("sc-fnwBNb bXPTTJ")[0].textContent[6]
    );
  }
  var pageNum = parseInt(
    document.getElementsByClassName("sc-fnwBNb bXPTTJ")[0].textContent[6]
  );
  if (pageNum != prevPageNum) {
    main();
  }
  prevPageNum = pageNum;
}

main();
// Declare variables
function main() {
  var everyElement = document.getElementsByClassName(
    "sc-kkGfuU WmMZl css-8626y4"
  );
  var poolElements = document.getElementsByClassName("sc-gVLVqr iSoxiC");
  var personalDailyRate = document.getElementsByClassName("sc-ifAKCX hHNcCz");
  var poolsDepositedIn = document.getElementsByClassName(
    "sc-ifAKCX sc-cBdUnI gvnguD"
  );
  var dQuickPool = document.getElementsByClassName("sc-cmjSyW cCCZTi");
  var everyElementIterator;
  var tvl = [];
  var quickPerDay = [];
  var yourRate = [];
  var yourDeposits = [];
  var apy;
  var apr;
  var quickPrice = getQuickPrice();

  // Loop through elements to get total value locked and QUICK per day
  for (var i = 1; i < everyElement.length - 2; i++) {
    everyElementIterator = everyElement[i].textContent;
    everyElementIterator = everyElementIterator.replace(",", "");
    everyElementIterator = everyElementIterator.replace(",", "");
    everyElementIterator = everyElementIterator.replace("$", "");
    everyElementIterator = everyElementIterator.replace(" QUICK / day", "");

    if (everyElement[i - 1].textContent == " Total deposits") {
      everyElementIterator = parseFloat(everyElementIterator);
      tvl.push(everyElementIterator);
    } else if (everyElement[i - 1].textContent == " Pool rate ") {
      everyElementIterator = parseFloat(everyElementIterator);
      quickPerDay.push(everyElementIterator);
    } else if (everyElement[i - 1].textContent == "Your rate") {
      // Strip everything that isn't a number or decimal
      everyElementIterator = everyElementIterator.replace(/[^0-9.]/g, "");
      yourRate.push(parseFloat(everyElementIterator));
    } else if (everyElement[i - 1].textContent == " Total QUICK") {
      var totalQuick = parseFloat(everyElementIterator);
    }
  }
  displayDquickApr(totalQuick);
  // Calculate and display dQUICK APR
  function displayDquickApr(totalQuick) {
    aprRate =
      (100 * (getQuickVolume() * 0.0004 * 365)) /
      (getQuickPrice() * totalQuick);
    aprRate = Math.round(aprRate * 100) / 100;
    var node = document.createElement("div");
    node.className = "sc-gqjmRU sc-jTzLTM sc-fjdhpX hwjYkd";

    var textnode = document.createElement("div");
    textnode.className = "sc-kkGfuU WmMZl css-8626y4";
    textnode.append("dQUICK APR: ");

    var ratenode = document.createElement("div");
    ratenode.className = "sc-kkGfuU WmMZl css-8626y4";
    ratenode.append(aprRate + "%");

    node.appendChild(textnode);
    node.appendChild(ratenode);

    if (dQuickPool[0].lastChild.firstChild.textContent == "dQUICK APR: ") {
      dQuickPool[0].removeChild(dQuickPool[0].lastChild);
    }

    dQuickPool[0].append(node);
  }

  // Calculate and display the sum of your rate and
  function displayYourRateAndDeposits() {
    // Calculate your total LP deposited from your rate
    for (var i = 0; i < yourRate.length; i++) {
      yourDeposits.push((yourRate[i] * tvl[i]) / quickPerDay[i]);
      appendDeposits(i);
    }
    var sumDeposits = yourDeposits.reduce(
      (partial_sum, a) => partial_sum + a,
      0
    );
    sumDeposits = (Math.round(sumDeposits * 100) / 100).toString();

    var sumRate = yourRate.reduce((partial_sum, a) => partial_sum + a, 0);
    sumRate = (Math.round(sumRate * 100000) / 100000).toString();

    var usdSum = (Math.round(sumRate * quickPrice * 100) / 100).toString();
    var node = document.createElement("div");
    node.className = "sc-gqjmRU sc-jTzLTM sc-fjdhpX sc-cnTzU eIRsCj";
    node.style = "align-items: baseline;";

    var textnode = document.createElement("div");
    textnode.className = "sc-kkGfuU hyvXgi css-68pfx3";
    textnode.append("Total Deposits: $".concat(sumDeposits));
    textnode.style = "margin-top: 0.5rem;";

    var ratenode = document.createElement("div");
    ratenode.className = "sc-kkGfuU kuSmHG css-63v6lo";
    ratenode.append(
      "Earning: ".concat(sumRate, " QUICK / day ($", usdSum, ")")
    );

    node.appendChild(textnode);
    node.appendChild(ratenode);

    if (
      personalDailyRate[0].firstChild.firstChild.textContent.substring(0, 17) ==
      "Total Deposits: $"
    ) {
      personalDailyRate[0].removeChild(personalDailyRate[0].firstChild);
    }

    // Check options and only add total deposits if wanted in options
    chrome.storage.sync.get(
      {
        totalDepositsOn: true,
        individualDepositsOn: true,
      },
      function (items) {
        if (items.totalDepositsOn) {
          personalDailyRate[0].prepend(node);
        }
      }
    );
  }

  // Display the APY on the screen
  for (var i = 0; i < tvl.length; i++) {
    // Remove "Status" "Running" if in compact mode
    compact(i);

    // Calculate the APY
    apr = (365 * 100 * quickPerDay[i] * quickPrice) / tvl[i];
    apr = (Math.round(apr * 100) / 100).toString().concat("%");

    apy = (Math.pow(1 + (quickPerDay[i] * quickPrice) / tvl[i], 365) - 1) * 100;
    apy = (Math.round(apy * 100) / 100).toString().concat("%");

    // Creates a new element with Current APY
    var node = document.createElement("div");
    node.className = "sc-gqjmRU sc-jTzLTM sc-fjdhpX hwjYkd";

    var textnode = document.createElement("div");
    textnode.className = "sc-kkGfuU WmMZl css-8626y4";
    textnode.append("Current APR (APY if compounded daily): ");

    var apynode = document.createElement("div");
    apynode.className = "sc-kkGfuU WmMZl css-8626y4";
    apynode.append(apr.concat(" (", apy, ")"));

    node.appendChild(textnode);
    node.appendChild(apynode);

    // Checks if element has been appended before
    // If so delete that element
    if (
      poolElements[i].lastChild.firstChild.textContent ==
      "Current APR (APY if compounded daily): "
    ) {
      poolElements[i].removeChild(poolElements[i].lastChild);
    }
    // Append the element with APY
    poolElements[i].append(node);
  }

  // If pools have been deposited into then display the total deposits and rate (assuming checked in options)
  if (yourRate.length > 0) {
    displayYourRateAndDeposits();
  }

  // Get QUICK price from CoinGecko API
  function getQuickPrice() {
    var quick_request = new XMLHttpRequest();
    quick_request.open(
      "GET",
      "https://api.coingecko.com/api/v3/simple/price?ids=quick&vs_currencies=usd",
      false
    );
    quick_request.send(null);
    var quickPrice = JSON.parse(quick_request.responseText)["quick"]["usd"];
    return quickPrice;
  }

  // Get QuickSwap volume from CoinGecko API
  function getQuickVolume() {
    var request = new XMLHttpRequest();
    request.open(
      "GET",
      "https://api.coingecko.com/api/v3/exchanges/quickswap",
      false
    );
    request.send(null);
    var quickVolumeBtc = JSON.parse(request.responseText)[
      "trade_volume_24h_btc"
    ];
    var quickVolume = quickVolumeBtc * getBtcPrice();
    return quickVolume;
  }

  // Get BTC Price from CoinGecko API
  function getBtcPrice() {
    var request = new XMLHttpRequest();
    request.open(
      "GET",
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      false
    );
    request.send(null);
    var btcPrice = JSON.parse(request.responseText)["bitcoin"]["usd"];
    return btcPrice;
  }

  // Display the individual deposits for each pool (assuming checked in options)
  function appendDeposits(i) {
    var node = document.createElement("div");
    node.className = "sc-kcDeIU jIDzLD";

    var depositTextNode = document.createElement("div");
    depositTextNode.className = "sc-kkGfuU WmMZl css-8626y4";
    depositTextNode.append("Your deposits in this pool: ");

    var depositedNode = document.createElement("div");
    depositedNode.className = "sc-kkGfuU WmMZl css-8626y4";
    depositedNode.append(
      "$" + Math.round(((yourRate[i] * tvl[i]) / quickPerDay[i]) * 100) / 100
    );

    node.appendChild(depositTextNode);
    node.appendChild(depositedNode);

    if (
      poolsDepositedIn[i].lastElementChild.textContent.substring(0, 28) ==
      "Your deposits in this pool: "
    ) {
      poolsDepositedIn[i].removeChild(poolsDepositedIn[i].lastElementChild);
    }

    // Check options and only add individual deposits if wanted in options
    chrome.storage.sync.get(
      {
        totalDepositsOn: true,
        individualDepositsOn: true,
      },
      function (items) {
        if (items.individualDepositsOn) {
          poolsDepositedIn[i].append(node);
        }
      }
    );
  }

  // Checks options to see if compact mode is on. If it is then remove Status Running text from each pool
  function compact(i) {
    chrome.storage.sync.get(
      {
        compactModeOn: false,
      },
      function (items) {
        if (
          items.compactModeOn &&
          poolElements[i].childNodes[2].textContent == " Status Running"
        ) {
          poolElements[i].removeChild(poolElements[i].childNodes[2]);
        }
      }
    );
  }
}
