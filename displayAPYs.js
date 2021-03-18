// Declare variables
var x = document.getElementsByClassName("sc-kkGfuU WmMZl css-8626y4");
var p = document.getElementsByClassName("sc-gVLVqr iSoxiC");
var i;
var a;
var tvl = [];
var quickday = [];
var apy;

// Get QUICK price from CoinGecko API
var quick_request = new XMLHttpRequest();
quick_request.open(
  "GET",
  "https://api.coingecko.com/api/v3/simple/price?ids=quick&vs_currencies=usd",
  false
);
quick_request.send(null);
var quick_price = JSON.parse(quick_request.responseText)["quick"]["usd"];

// Get ETH price from CoinGecko API
var eth_request = new XMLHttpRequest();
eth_request.open(
  "GET",
  "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
  false
);
eth_request.send(null);
var eth_price = JSON.parse(eth_request.responseText)["ethereum"]["usd"];

// Loop through elements to get total value locked and QUICK per day
for (i = 1; i < x.length - 2; i++) {
  // Get the text of each element in the class
  a = x[i].textContent;
  // Remove commas from text
  a = a.replace(",", "");
  a = a.replace(",", "");

  // Remove any text from QUICK/day
  a = a.replace(" QUICK / day", "");

  // Check if the previous element was total deposits or pool rate
  // If total deposits then this element is the total value locked
  // Otherwise if pool rate then this element is the QUICK per day
  // Then add that value to the corresponding array
  if (x[i - 1].textContent == " Total deposits") {
    // Check if dollars or ETH
    // If ETH multiply by ETH price

    if (a[0] == "$") {
      a = a.replace("$", "");
      a = parseFloat(a);
    } else {
      a = a.replace("ETH", "");
      a = parseFloat(a);
      a *= eth_price;
    }
    // Append to the total value locked array
    tvl.push(a);
  } else if (x[i - 1].textContent == " Pool rate ") {
    // Convert from string to float
    a = parseFloat(a);
    // Append to the total value locked array
    quickday.push(a);
  }
}

// Display the APY on the screen
for (i = 0; i < tvl.length; i++) {
  // Calculate the APY
  apy = (365 * 100 * quickday[i] * quick_price) / tvl[i];
  apy = Math.round(apy * 100) / 100;
  apy = apy.toString().concat("%");

  // Creates a new element with Current APY
  var node = document.createElement("div");
  node.className = "sc-gqjmRU sc-jTzLTM sc-fjdhpX hwjYkd";

  var textnode = document.createElement("div");
  textnode.className = "sc-kkGfuU WmMZl css-8626y4";
  textnode.append("Current APY: ");

  var apynode = document.createElement("div");
  apynode.className = "sc-kkGfuU WmMZl css-8626y4";
  apynode.append(apy);

  node.appendChild(textnode);
  node.appendChild(apynode);

  // Checks if element has been appended before
  // If so delete that element
  if (p[i].lastChild.firstChild.textContent == "Current APY: ") {
    p[i].removeChild(p[i].lastChild);
  }
  // Append the element with APY
  p[i].append(node);
}
