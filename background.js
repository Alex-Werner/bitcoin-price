window.addEventListener("load", loadBackground());
var fetchInterval;
function loadBackground() {
    var valid = store.validateIntegrity();
    if(valid){
        prepareBadge();
        prepareListener();
    
    
        BitcoinPrice
            .fetch
            .currencyList()
            .then(function () {
                BitcoinPrice
                    .fetch
                    .bitcoinPrice()
                    .then(function () {
                        setTitle();
                        if(shouldMonitorWealth()===true){
                            var wealth = BitcoinPrice.getWealth()
                            setBadge(wealth);
                        }else{
                            setBadge();
                        }
                        launchInterval();
                    })
            })
    }else{
        loadBackground();
    }
}

function prepareListener() {
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log('Received');
            
            if (sender.tab) {
                //RECEIVED FROM A CONTENT SCRIPT : Options ?
            } else {
                //RECEIVED FROM THE EXTENSION (POPUP)
                if (request && request.hasOwnProperty('type')) {
                    switch (request.type) {
                        case "priceHistory":
                            sendResponse(BitcoinPrice.getPriceHistory());
                            break;
                    }
                }
                
            }
        }
    )
}