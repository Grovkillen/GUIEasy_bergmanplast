/* GUIEasy  Copyright (C) 2019-2020  Jimmy "Grovkillen" Westberg */
//HERE WE ADD THINGS THAT THE CLIENT WANTS TO DO
guiEasy.pitcher = async function (processID, processType) {
    let maxTimeout = 20 * 1000;
    let urlParams = helpEasy.urlParams();
    helpEasy.getGuiInFields();
    //TODO: remove this part when doing a build release (saves almost 1kB)
    if (window.location.hostname === "localhost") {
        let path = window.location.origin;
        if (window.location.pathname === "/") {
            path += "/src/custom.json";
        } else {
            path += window.location.pathname;
            path = path.replace("index.html", "custom.json");
        }
        await fetch(path)
            .then(res => res.json())
            .then((jsonData) => {
                jsonData.ip = eval(jsonData.ip); //WE CAN DO THIS IN DEV MODE...
                guiEasy.nodes.push(jsonData);
            })
            .catch(error => {
                helpEasy.addToLogDOM('Error fetching (custom.json): ' + error, 0, "error");
                helpEasy.addToLogDOM('You should create a "custom.json", please refer to the "custom-template.json".', 0, "warn");
                helpEasy.addToLogDOM('With this file you can specify what unit you want to connect to during development...', 0, "info");
            });
    } else {
        guiEasy.nodes.push({"ip": window.location.hostname, "type":"server"});
    }
    helpEasy.scheduleFetch(guiEasy.nodes, 0);
    //first make sure the "live" json is populated with data
    let timeoutX = guiEasy.fetchSettings.intervalTimeKeeper;
    let maxLoopsX = Math.floor(maxTimeout / timeoutX);
    let LCX = 0;
    let x = setInterval(function () {
        LCX++;
        if (LCX > maxLoopsX) {
            helpEasy.addToLogDOM("'live' not working!", 0, "warn");
            helpEasy.processDone(processID, processType);
            return;
        }
        if (guiEasy.current.live !== undefined) {
            clearInterval(x);
            helpEasy.setCurrentIndex(0);
            guiEasy.current.live = helpEasy.getCurrentIndex();
            //update graphics
            helpEasy.updateGraphics();
            helpEasy.addToLogDOM("pageSize", 1);
        }
    }, timeoutX);
    //now make sure that the data is injected into page before continue
    let timeoutY = 50;
    let maxLoopsY = Math.floor(maxTimeout / timeoutY);
    let LCY = 0;
    let y = setInterval(function () {
        LCY++;
        if (LCY > maxLoopsY) {
            helpEasy.addToLogDOM("'gui' not working!", 0, "warn");
            helpEasy.processDone(processID, processType);
            return;
        }
        if (guiEasy.current.gui !== undefined) {
            clearInterval(y);
            //TODO: should this be here?
            guiEasy.popper.tryCallEvent({"type":"tab","args":["tab","start"]});
            helpEasy.addToLogDOM("pageSize", 1);
            helpEasy.processDone(processID, processType);
        }
    }, timeoutY);
    //and we're live and kicking!
};