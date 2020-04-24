/* GUIEasy  Copyright (C) 2019-2020  Jimmy "Grovkillen" Westberg */

helpEasy.getDataFromNode = function (array, index, endpoint, ttl_fallback) {
    array[index]["scheduler"].shift();
    let timeStart = Date.now();
    let path = "http://" + array[index].ip + "/" + endpoint + "?callback=" + timeStart;
    let nextRun = Date.now() + array[index].stats[endpoint].TTL_fallback;
    fetch(path)
        .then(res => res.text())
        .then((dataFromFile) => {
            array[index]["live"][endpoint] = {};
            array[index]["live"][endpoint].raw = dataFromFile;
                array[index]["live"][endpoint].timestamp = Date.now();
                let iniData = helpEasy.iniFileToObject(dataFromFile);
                if (iniData.info.TTL !== undefined) {
                    array[index]["live"][endpoint].TTL = iniData.info.TTL;
                } else {
                    array[index]["live"][endpoint].TTL = ttl_fallback;
                }
                array[index]["live"][endpoint].TTL_fallback = ttl_fallback;
                nextRun = Date.now() + array[index]["live"][endpoint].TTL;
                array[index].stats.error = 0;
            }
        )
        .catch(error => {
            helpEasy.addToLogDOM('Error fetching (' + endpoint + '): ' + error, 0, "error");
            array[index].stats.error++;
            guiEasy.fetchCount.error++;
        });
    array[index]["scheduler"].push([nextRun, endpoint]);
    array[index]["scheduler"].sort();
    array[index].stats["lastRun"] = Date.now();
    array[index].stats[endpoint].run = Date.now() - timeStart;
    array[index].stats[endpoint].timestamp = Date.now();
    guiEasy.fetchCount.current++;
    if (guiEasy.fetchCount.current === guiEasy.fetchCount.max) {
        guiEasy.current.live = index;
    }
};

helpEasy.updateGraphics = function () {
    guiEasy.current.gui = helpEasy.getCurrentIndex();
    let object = guiEasy.nodes[guiEasy.current.gui]["live"];
    let keys = Object.keys(object);
    keys.map(key => {
        if (key.includes(".ini")) {
            object[key].data = helpEasy.iniFileToObject(object[key].raw, true);
            //update with new jobs
            helpEasy.updateGraphics[key](object[key].data);
        }
    });
};

helpEasy.updateGraphics["jobb.ini"] = function (object) {
    if (object["ej planerade"]["antal"] > 0) {
        let jobContainer = document.getElementById("unplanned-jobs");
        let jobs = object["ej planerade"]["jobb"];
        jobs.map(job => {
            let element = document.getElementById(job);
            if (helpEasy.findInArray(job, guiEasy.tender.ids) > -1) {    //filter away possible duplicates since we map the array we might get duplicates...
                fetch("/data/jobb/" + job + "/jobb.ini?callback=" + Date.now())
                    .then(res => res.text())
                    .then((dataFromFile) => {
                        let jobData = helpEasy.iniFileToObject(dataFromFile);
                            //we should update the existing element if needed
                            if (typeof(element) !== "undefined" && element !== null) {
                                document.getElementById("job-" + job).innerText = job;
                                document.getElementById("job-beskrivning-" + job).innerText = jobData.info.beskrivning;
                                document.getElementById("job-antal-" + job).innerText = jobData.jobb.antal + " " + jobData.jobb.enhet;
                            }
                        }
                    );
            } else {
                guiEasy.tender.ids.push(job);
                fetch("/data/jobb/" + job + "/jobb.ini?callback=" + Date.now())
                    .then(res => res.text())
                    .then((dataFromFile) => {
                            let jobData = helpEasy.iniFileToObject(dataFromFile);
                                //no element exist, create it
                                element = document.createElement("div");
                                element.id = job;
                                element.innerHTML = `
                                    <div class="job" id="job-` + job + `">` + job + `</div>
                                    <div class="beskrivning" id="job-beskrivning-` + job + `">` + jobData.info.beskrivning + `</div>
                                    <div class="antal" id="job-antal-` + job + `">` + jobData.jobb.antal + ` ` + jobData.jobb.enhet + `</div>
                                `;
                                element.dataset.length = "100";
                                element.className = "post-it";
                                element.draggable = true;
                                element.setAttribute("ondragstart", "helpEasy.drag(event)");
                                jobContainer.appendChild(element);
                            }
                        );
            }
        })
    }
};

helpEasy.updateGraphics["maskin.ini"] = function (object) {
    if (object["info"]["antal maskiner"] > 0) {
        let machineContainer = document.getElementById("planering-container");
        for (let i = 1; i < (object["info"]["antal maskiner"] + 1); i++) {
            let machine = object["maskin " + i];
            let element = document.getElementById(machine.id);
            if (typeof(element) !== "undefined" && element !== null) {
                //we should update the existing element if needed

            } else {
                //no element exist, create it
                element = document.createElement("div");
                element.id = machine.id;
                element.innerHTML = `
                                    <div class="name" id="machine-place-` + machine.id + `">`  + machine.namn + ": " + machine.namn + `</div>
                                    <div class="planner" id="planner-` + machine.id + `"></div>
                                `;
                element.className = "machine";
                element.setAttribute("ondrop", "helpEasy.drop(event)");
                element.setAttribute("ondragover", "helpEasy.allowDrop(event)");
                machineContainer.appendChild(element);
            }
        }
    }
};

helpEasy.allowDrop = function(event) {
    event.preventDefault();
};

helpEasy.drop = function(event) {
    let id = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(id));
};

helpEasy.drag = function(event) {
    event.dataTransfer.setData("text", event.target.id);
};