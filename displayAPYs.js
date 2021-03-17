// Declare variables
var x = document.getElementsByClassName("sc-kkGfuU WmMZl css-8626y4");
var i;
var a;
var tvl = [];
var quickday = [];
var apy = [];
var apy_positon = 0;


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

// Calculate the APY for each TVL and QUICK per day pair
for (i = 0; i < tvl.length; i++) {
  a = (365 * 100 * quickday[i] * quick_price) / tvl[i];
  a = Math.round(a * 100) / 100;
  a = a.toString().concat("%");
  apy.push(a);
}
// Display the APY on the screen overwriting the status as it isn't important data
for (i = 2; i < x.length; i++) {
	// Check if the previous element has the text "Status" or "Current APY:" so it knows to overwrite
  if (
    x[i - 1].textContent == " Status " ||
    x[i - 1].textContent == "Current APY: "
  ) {
	  // Replace the text with the current APY
    x[i].textContent = apy[apy_positon];
    x[i - 1].textContent = "Current APY: ";
    apy_positon++;
  }
}
