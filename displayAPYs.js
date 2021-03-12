var x = document.getElementsByClassName("sc-kkGfuU WmMZl css-8626y4")
var wallet = document.getElementsByClassName("sc-krvtoX iOfDQX")
var i;
var a;
var tvl = [];
var disconnected;
var quickday = [];
var apy = [];
var apy_positon = 0;

//Check if wallet is connected
if (wallet[0].textContent == "Switch to Matic"){
	disconnected = 1;
}else{
	disconnected = 0;
}

var Httpreq = new XMLHttpRequest();
Httpreq.open("GET","https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0x6c28aef8977c9b773996d0e8376d2ee379446f2f&vs_currencies=usd",false);
Httpreq.send(null);
var price = Httpreq.responseText;          
price = price.replace("{\"0x6c28aef8977c9b773996d0e8376d2ee379446f2f\":{\"usd\":", "")
price = price.replace("}}","")

var values = price.split(".")
var v1 = parseFloat(values[0])
var v2 = parseFloat(values[1])
price =  v1 + (v2/100)

for (i = 2-disconnected; i < (x.length)-2; i++) {
	a = x[i].textContent
	// Remove any text from TVL
	a = a.replace(",","")
	a = a.replace(",","")
	a = a.replace("$","")
	// Remove any text from QUICK/day
	a = a.replace(" QUICK / day", "")
	
	a = parseFloat(a)
	
	if (x[i-1].textContent == " Total deposits"){
		tvl.push(a);
	}else if (x[i-1].textContent == " Pool rate "){
		quickday.push(a)
	}
}


for (i=0; i < tvl.length; i++){
	a = (365 * 100 * quickday[i]*price) / tvl[i]
	a = Math.round(a*100)/100
	a = a.toString().concat("%")
	apy.push(a)
}

for (i=2; i < x.length; i++){
	if (x[i-1-disconnected].textContent == " Status "){
		x[i-disconnected].textContent = apy[apy_positon]
		x[i-1-disconnected].textContent = "Current APY: "
		apy_positon++
	}
}
