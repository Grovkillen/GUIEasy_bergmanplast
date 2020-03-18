
helpEasy.getDataFromNode = function (array, index, endpoint, ttl_fallback) {
    array[index]["scheduler"].shift();
    let timeStart = Date.now();
    let path = "http://" + array[index].ip + "/" + endpoint + "?callback=" + timeStart;
    fetch(path)
        .then(res => res.json())
        .then((dataFromFile) => {
                array[index]["live"][endpoint] = dataFromFile;
                array[index]["live"][endpoint].timestamp = Date.now();
                if (dataFromFile.TTL !== undefined) {
                    //array[index]["live"][endpoint].TTL = dataFromFile.TTL;
                } else {
                    array[index]["live"][endpoint].TTL = ttl_fallback;
                }
                array[index]["live"][endpoint].TTL_fallback = ttl_fallback;
                let nextRun = Date.now() + array[index]["live"][endpoint].TTL;
                array[index]["scheduler"].push([nextRun, endpoint]);
                array[index]["scheduler"].sort();
                array[index].stats["lastRun"] = Date.now();
                array[index].stats[endpoint].run = Date.now() - timeStart;
                array[index].stats[endpoint].timestamp = Date.now();
                array[index].stats.error = 0;
            }
        )
        .catch(error => {
            helpEasy.addToLogDOM('Error fetching (' + endpoint + '): ' + error, 0, "error");
            array[index].stats.error++;
            let nextRun = Date.now() + array[index].stats[endpoint].TTL_fallback;
            array[index]["scheduler"].push([nextRun, endpoint]);
            array[index]["scheduler"].sort();
            array[index].stats["lastRun"] = Date.now();
            array[index].stats[endpoint].run = Date.now() - timeStart;
            array[index].stats[endpoint].timestamp = Date.now();
            guiEasy.fetchCount.error++;
        });
    guiEasy.fetchCount.current++;
    if (guiEasy.fetchCount.current === guiEasy.fetchCount.max) {
        guiEasy.current.live = index;
    }
};

helpEasy.updateGraphics = function () {

    guiEasy.current.gui = helpEasy.getCurrentIndex();
};