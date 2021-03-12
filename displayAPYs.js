var x = document.getElementsByClassName("sc-kkGfuU WmMZl css-8626y4")
var i;
var a;
var tvl = [];
var quickday = [];
var apy = [];

//Change disconnected from 0 to 1 if runnning the script when disconnected
var disconnected = 0;

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

for (i = 2-disconnected; i < (x.length)-2; i+=6) {
	a = x[i].textContent
	a = a.replace(",","")
	a = a.replace(",","")
	a = a.replace("$","")
	a = parseFloat(a)
  tvl.push(a);
}

for (i = 4-disconnected; i < (x.length)-2; i+=6) {
	a = x[i].textContent
	a = a.replace(" QUICK / day", "")
	a = parseFloat(a)
  quickday.push(a);
}

for (i=0; i < tvl.length; i++){
	a = (365 * 100 * quickday[i]*price) / tvl[i]
	a = Math.round(a*100)/100
	a = a.toString().concat("%")
	apy.push(a)
}

for (i=6; i < x.length; i+=6){
	x[i-disconnected].textContent = apy[(i-6)/6]
	x[i-1-disconnected].textContent = "Current APY: "
}
