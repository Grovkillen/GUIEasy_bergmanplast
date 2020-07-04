/* GUIEasy  Copyright (C) 2019-2020  Jimmy "Grovkillen" Westberg */
//HERE WE ADD REPEATING DATA FETCH FROM UNIT
guiEasy.tender = function (processID, processType) {
    if (guiEasy.tender.ids === undefined) {
        guiEasy.tender.ids = [];
    }
    let maxMissed = 1;
    let missedBuffer = 15;
    let timestampStart = Date.now();
    let jobsToUpdate = [];

    //data fetcher (fast lane)
    setInterval( function () {
        let jobs  = document.getElementsByClassName("post-it");
        if (jobs.length > 0) {
            Array.from(jobs).map(job => {
                if (job.dataset.clientTimestamp > job.dataset.serverTimestamp) {
                    job.classList.add("waiting-for-server-update");
                    if (helpEasy.findInArray(job.id, jobsToUpdate) === -1) {
                        jobsToUpdate.push(job.id);
                    }
                } else {
                    job.dataset.clientTimestamp = job.dataset.serverTimestamp;
                    job.classList.remove("waiting-for-server-update");
                }
            })
        }
        if (jobsToUpdate.length > 0) {
            let loopCount = 0;
            let fetchInterval = setInterval(function () {
                loopCount++;
                if (loopCount > 12) {
                    clearInterval(fetchInterval);
                } else if (jobsToUpdate.length < 1) {
                    clearInterval(fetchInterval);
                } else {
                    helpEasy.schedulerBump(guiEasy.nodes[helpEasy.getCurrentIndex()]["scheduler"], "jobb.ini");
                    helpEasy.schedulerBump(guiEasy.nodes[helpEasy.getCurrentIndex()]["scheduler"], "jobb/" + jobsToUpdate[0] + "/jobb.ini");
                    guiEasy.current.gui = helpEasy.getCurrentIndex();
                    let object = guiEasy.nodes[helpEasy.getCurrentIndex()]["live"];
                    let keys = Object.keys(object);
                    keys.map(key => {
                        if (key.includes("maskin.ini")) {
                            helpEasy.schedulerBump(guiEasy.nodes[helpEasy.getCurrentIndex()]["scheduler"], key);
                        }
                    });
                    //clean up
                    document.getElementById(jobsToUpdate[0]).dataset.addedTo = "";
                    document.getElementById(jobsToUpdate[0]).dataset.addedToGroup = "";
                    jobsToUpdate.shift();
                }
            }, 2500);
        }
    }, 1000);

    //data fetcher
    setInterval(function () {
        let timestampNow = Date.now();
        let x = guiEasy.nodes;
        let bufferTime = guiEasy.fetchSettings.intervalTimeKeeper;
        for (let i = 0; i < x.length; i++) {
            if (x[i].scheduler[0] === undefined) {
                return;
            }
            if (x[i].stats.lastCheck === undefined) {
                x[i].stats.lastCheck = timestampNow;
            }
            //If we have more than 1 missed fetch in a row...
            if (x[i].stats.error > maxMissed) {
                let delay = missedBuffer * guiEasy.fetchSettings.intervalTimeKeeper;
                helpEasy.addToLogDOM("@:" + new Date(timestampNow).toISOString() + ">>> We missed " + (maxMissed + 1) + " fetches in a row... will wait " + delay + " ms before retry.", 0, "warn");
                helpEasy.schedulerDelay(x, i, delay);
                continue;
            }
            if (
                x[i].stats.error < (maxMissed + 1) &&
                x[i].scheduler[0][0] < timestampNow &&
                bufferTime < (timestampNow - x[i].stats.lastRun)
            ) {
                x[i].stats.lastCheck = timestampNow;
                let endpoint = x[i].scheduler[0][1];
                helpEasy.scheduleFetch(guiEasy.nodes, i, endpoint);
                helpEasy.setCurrentOnline("online");
            }
            //trigger lost connection with unit?
            let sinceLastCheck = (Date.now() - x[i].stats.lastCheck);
            if (sinceLastCheck > (missedBuffer * guiEasy.fetchSettings.intervalTimeKeeper)) {
                helpEasy.setCurrentOnline();
            }
        }
    }, 10);

    //gui updater
    setInterval(function () {
        //Lookup if internet is found
        if (
            helpEasy.internet() === false
        ) {
            guiEasy.popper.topNotifier("internetDown","Internet är nere...", "warning");
        } else if (
            guiEasy.nodes[helpEasy.getCurrentIndex()].notifierID === "internetDown"
        ) {
            guiEasy.popper.topNotifier("internetUp","Internetuppkoppling åter igång.", "success", 5);
        }
        //is the unit reachable
        if (
            helpEasy.getCurrentIndex("online") === false &&
            helpEasy.internet() === true &&
            (Date.now() - timestampStart) > (missedBuffer * 2000)
        ) {
            guiEasy.popper.topNotifier("unitDown","Serverkontakt nere.", "warning");
        } else if (
            guiEasy.nodes[helpEasy.getCurrentIndex()].notifierID === "unitDown"
        ) {
            guiEasy.nodes[helpEasy.getCurrentIndex()].stats.lastCheck = Date.now();
            helpEasy.setCurrentOnline("online");
            guiEasy.popper.topNotifier("unitUp","Kontakt med servern är åter igång.", "success", 3);
        }
        helpEasy.updateGraphics();
    }, guiEasy.fetchSettings.intervalGUIupdater);

    helpEasy.processDone(processID, processType);

};
