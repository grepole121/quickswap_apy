var x = document.getElementsByClassName("sc-kkGfuU WmMZl css-8626y4");
var wallet = document.getElementsByClassName("sc-krvtoX iOfDQX");
var i;
var a;
var tvl = [];
var disconnected;
var quickday = [];
var apy = [];
var apy_positon = 0;

// Check if wallet is connected
if (
  wallet[0].textContent == "Switch to Matic" ||
  wallet[0].textContent == "Connect to a wallet"
) {
  disconnected = 1;
} else {
  disconnected = 0;
}

// Get price from CoinGecko API
var quick_request = new XMLHttpRequest();
quick_request.open(
  "GET",
  "https://api.coingecko.com/api/v3/simple/price?ids=quick&vs_currencies=usd",
  false
);
quick_request.send(null);
var quick_price = JSON.parse(quick_request.responseText)["quick"]["usd"];

var eth_request = new XMLHttpRequest();
eth_request.open(
  "GET",
  "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
  false
);
eth_request.send(null);
var eth_price = JSON.parse(eth_request.responseText)["ethereum"]["usd"];

for (i = 2 - disconnected; i < x.length - 2; i++) {
  // Get the text of each element in the class
  a = x[i].textContent;
  // Remove any text from TVL
  a = a.replace(",", "");
  a = a.replace(",", "");

  // Remove any text from QUICK/day
  a = a.replace(" QUICK / day", "");

  // Check if the previous element was total deposits or pool rate
  // If total deposits then this element is the total value locked
  // Otherwise if pool rate then this element is the QUICK per day
  // Then add that value to the corresponding array
  if (x[i - 1].textContent == " Total deposits") {
    //   Check if dollars or ETH
    if (a[0] == "$") {
      a = a.replace("$", "");
      a = parseFloat(a);
    } else {
      a = a.replace("ETH", "");
      a = parseFloat(a);
      a *= eth_price;
    }
    tvl.push(a);
  } else if (x[i - 1].textContent == " Pool rate ") {
    a = parseFloat(a);
    quickday.push(a);
  }
}

// Calculate the APY for each TVL and QUICK per day pair
for (i = 0; i < tvl.length; i++) {
  a = (365 * 100 * quickday[i] * quick_price) / tvl[i];
  a = Math.round(a * 100) / 100;
  a = a.toString().concat("%");
  apy.push(a);
}
// Display the APY on the screen overwriting the status as it isn't important data
for (i = 2; i < x.length; i++) {
  if (
    x[i - 1 - disconnected].textContent == " Status " ||
    x[i - 1 - disconnected].textContent == "Current APY: "
  ) {
    x[i - disconnected].textContent = apy[apy_positon];
    x[i - 1 - disconnected].textContent = "Current APY: ";
    apy_positon++;
  }
}
