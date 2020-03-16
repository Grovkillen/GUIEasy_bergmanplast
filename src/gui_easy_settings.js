/* GUIEasy  Copyright (C) 2019-2020  Jimmy "Grovkillen" Westberg */
//HERE'S THE SETTINGS USED FOR THE SPA ENGINE = TRANSLATIONS ARE PUT IN ANOTHER FILE
/*
    V.R.M.build.state
    x.y.odd.odd = test builds
    x.y.odd.even = beta builds
    x.y.even.odd = RC build
    x.y.even.even = released build
*/
const guiEasy = {
    'logLevel': 0,
    'name': 'GUI Easy BP',
    'version': {
        //--GRUNT-START--
        'major': 0,
        'minor': 0,
        'revision': 1,
        'development': true,
        'releaseCandidate': 0
        //--GRUNT-END--
        ,
        'test': null,    //this one should always be "null", we set it to a timestamp if a test build is made
        'full': function () {
            let x = guiEasy.version;
            let testBuild = "";
            if (x.test !== null) {
                testBuild = "-test-" + x.test;
            }
            if (x.development === true && x.releaseCandidate > 0) {
                return x.major + '.' + x.minor + '.rc' + x.releaseCandidate + '.' + x.revision + testBuild;
            } else if (x.development === true) {
                return x.major + '.' + x.minor + '.nightly.' + x.revision + testBuild;
            } else {
                return x.major + '.' + x.minor + '.' + x.revision + testBuild;
            }
        }
    },
    'geekName': function () {
        return guiEasy.name.replace(' ', '-').toLowerCase();
    },
    'geekNameFull': function () {
        return guiEasy.geekName() + '-' + guiEasy.version.full()
    },
    'current': {},
    'fetchSettings':{                                           //to store in memory, DOM stuff will grow eternally
        'maxToKeep': 5,                                         //Minutes...
        'minToKeep': 1,
        'intervalGUIupdater': 1000,                             //ms
        'intervalTimeKeeper': 700,                              //min period in-between fetches
        'maxToKeepMs': function () {
            return guiEasy.maxToKeep * 60 * 1000;
        },
        'minToKeepMs': function () {
            return guiEasy.minToKeep * 60 * 1000;
        },
    },
    'nodes': [],
    'loops': {},
    'startup': [
        {
            'id': 'curly',
            'logText': 'HTML byggs upp'
        },
        {
            'id': 'scrubber',
            'logText': 'HTML tvättas'
        },
        {
            'id': 'popper',
            'logText': 'Skapar eventhanterare'
        },
        {
            'id': 'pitcher',
            'logText': 'Hämtar data från servern'
        }
    ],
    'silentStartup': [
        {
            'id': 'butler',
            'logText': 'Hämtar data från internet'
        },
        {
            'id': 'tender',
            'logText': 'Springaren initieras'
        }
    ],
    'endpoints':{
        'defaultTTL': function () {
            return 60000        //Once a minute
        },
        'get':[
            {'endpoint':'jobs',                 'ttl_fallback':2000},
            {'endpoint':'active',            'ttl_fallback':99999999},       //will not update very often...
            {'endpoint':'data'},             //Fallback of 29999 will not be part of first boot fetch
        ],
        'post':[
            {'endpoint':'webhook'}
        ]
    },
    'fetchingWait': "Hämtning ej klar, var god vänta...",
    'tabs': {
        'left': ['start', 'planering', 'körning', 'historik'],
        'right': ['info', 'kvalitét', 'tools', 'rules']
    },
    'guiStats': {           //Not to be mistaken for the unit's stats, this is the queen bee gui buildup stats
        'pageSize': 0,      //the other is how the unit themselves are doing fetch-wise
        'bootTime': 0,
        'eventCalls': 0,
        'eventCallsTotal': 0
    },
    'syntax': {
        'curlyLC': 0,  //USED TO SEE HOW MANY LOOPS ARE NEEDED TO REPLACE ALL CURLY
        'curly': [
            // PUT CURLY's WITH NO SUB-CURLY's FIRST FOR OPTIMIZATION
            // FIRST LEVEL ONLY, the rest will dig down automatically
            // We create this array manually for optimization purpose
            'fetching',
            'input',
            'goto',
            'button',
            'version',
            'notifier',
            'drawer',
            'navbar',
            'modal',
            'menu',
            'wave',
            'page',
            'logo',
            'icon'
        ]
    }
};