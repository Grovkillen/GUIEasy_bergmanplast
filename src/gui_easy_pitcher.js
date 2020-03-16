/* GUIEasy  Copyright (C) 2019-2020  Jimmy "Grovkillen" Westberg */
//HERE WE ADD THINGS THAT THE CLIENT WANTS TO DO
guiEasy.pitcher = async function (processID, processType) {
    let maxTimeout = 20 * 1000;
    let urlParams = helpEasy.urlParams();
    helpEasy.getGuiInFields();
    //TODO: remove this part when doing a build release (saves almost 1kB)
    if (window.location.hostname === "localhost") {
        let path = window.location.origin + window.location.pathname;
        path = path.replace("index.html", "custom.json");
        await fetch(path)
            .then(res => res.json())
            .then((jsonData) => {
                //guiEasy.nodes.push(jsonData);  //THIS ONE IS USED TO RUN THE GUI FROM LOCALHOST
            })
            .catch(error => {
                helpEasy.addToLogDOM('Error fetching (custom.json): ' + error, 0, "error");
                helpEasy.addToLogDOM('You should create a "custom.json", please refer to the "custom-template.json".', 0, "warn");
                helpEasy.addToLogDOM('With this file you can specify what unit you want to connect to during development...', 0, "info");
            });
    } else {
        //guiEasy.nodes.push({"ip": window.location.hostname, "type":"queen"});
    }

    //and we're live and kicking!
};