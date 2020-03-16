/* GUIEasy  Copyright (C) 2019-2020  Jimmy "Grovkillen" Westberg */
// ONLY PATH'S OF SVGs ARE USED
guiEasy.curly.logo = function(arg) {
    let xml = " xmlns='http://www.w3.org/2000/svg'";
    let size = arg[0];
    if (size === undefined) {
        size = 'normal';
    }
    return ` 
        <svg class="logo-` + size + `"
        viewBox="0 0 113.392 113.392"
        ` + xml + `>
        <path
            class="fill-main-inverted"
                d="M 0,93.462 V 19.926 C 0,8.921 8.921,0 19.926,0 h 73.536 c 11,0 19.93,8.921 19.93,19.926 v 73.536 c 0,11 -8.93,19.93 -19.93,19.93 H 19.926 C 8.921,113.392 0,104.462 0,93.462 Z M 113.392,0"
                name="logo-background"
        ></path>
        <path
            class="main-success line-path"
                d="M 14.174,42.521 42.521,14.174"
                name="logo-line0"
        ></path>
        <path
            class="main-sunny line-path"
                d="M 14.174,70.867 70.867,14.174"
                name="logo-line1"
        ></path>
        <path
            class="main-info line-path"
                d="M 14.174,99.212 99.212,14.174"
                name="logo-line2"
        ></path>
        <path
            class="main-warning line-path"
                d="M 42.521,99.212 99.212,42.521"
                name="logo-line3"
        ></path>
        <path
            class="fill-main-font"
                d="m 103.462,92.132 c 0,-6.267 -5.07,-11.343 -11.33,-11.343 -6.267,0 -11.343,5.076 -11.343,11.343 0,6.26 5.076,11.33 11.343,11.33 6.26,0 11.33,-5.07 11.33,-11.33 z m -11.33,0"
                name="logo-dot"
        ></path>
        </svg>
      `;
};

guiEasy.curly.icon = function(arg) {
    let icon = arg[0];
    let xml = " xmlns='http://www.w3.org/2000/svg'";
    let color = "class='fill-main-font'";
    let viewbox = " viewBox='0 0 24 24'";
    if (icon === "wifi") {
        let name;
        if (arg[1] === "self") {
            name = "name='unit-wifi-rssi-icon'";
        } else {
            name = "signal='" + arg[1] + "'";
        }
        return `
           <svg ` + name + xml + ` viewBox="0 0 14 10" class="inline-icon wifi">
                <rect name="level-1" x='0' y='8' width='2' height='2'></rect>
                <rect name="level-2" x='3' y='6' width='2' height='4'></rect>
                <rect name="level-3" x='6' y='4' width='2' height='6'></rect>
                <rect name="level-4" x='9' y='2' width='2' height='8'></rect>
                <rect name="level-5" x='12' y='0' width='2' height='10'></rect>
           </svg>
           `;
    }
    //BELOW, ICONS (SVG PATH's) ON COURTESY OF https://www.ICONS8.com
    if (icon === "action") {
        return `
            <svg class="` + icon + `" ` + xml + viewbox + `>
                <path ` + color + `
                d="M20,11h-7V4c0-0.552-0.448-1-1-1s-1,0.448-1,1v7H4c-0.552,0-1,0.448-1,1s0.448,1,1,1h7v7c0,0.552,0.448,1,1,1s1-0.448,1-1 v-7h7c0.552,0,1-0.448,1-1S20.552,11,20,11z"/>
            </svg>
           `;
    }
    if (icon === "orders") {
        return `
            <svg class="` + icon + `" ` + xml + viewbox + `>
                <path ` + color + `
                d="M12.714,2.025C6.629,1.603,1.603,6.628,2.025,12.713C2.392,18.002,7.006,22,12.307,22H13c1.105,0,2-0.895,2-2v-3 c0-1.105,0.895-2,2-2h3c1.105,0,2-0.895,2-2v-0.693C22,7.006,18.002,2.392,12.714,2.025z M10.5,4C11.328,4,12,4.672,12,5.5 S11.328,7,10.5,7S9,6.328,9,5.5S9.672,4,10.5,4z M5.5,15C4.672,15,4,14.328,4,13.5S4.672,12,5.5,12S7,12.672,7,13.5 S6.328,15,5.5,15z M6.5,10C5.672,10,5,9.328,5,8.5S5.672,7,6.5,7S8,7.672,8,8.5S7.328,10,6.5,10z M11,20c-1.105,0-2-0.895-2-2 c0-1.105,0.895-2,2-2s2,0.895,2,2C13,19.105,12.105,20,11,20z M15.5,8C14.672,8,14,7.328,14,6.5S14.672,5,15.5,5S17,5.672,17,6.5 S16.328,8,15.5,8z M18.5,13c-0.828,0-1.5-0.672-1.5-1.5s0.672-1.5,1.5-1.5s1.5,0.672,1.5,1.5S19.328,13,18.5,13z"/>
            </svg>
           `;
    }
    if (icon === "spara") {
        return `
            <svg class="` + icon + `" ` + xml + viewbox + `>
                <path ` + color + `
                d="M17.586,3.586C17.211,3.211,16.702,3,16.172,3H5C3.89,3,3,3.9,3,5v14c0,1.105,0.895,2,2,2h14c1.1,0,2-0.9,2-2V7.828 c0-0.53-0.211-1.039-0.586-1.414L17.586,3.586z M12,19c-1.66,0-3-1.34-3-3s1.34-3,3-3s3,1.34,3,3S13.66,19,12,19z M14,9H6 C5.448,9,5,8.552,5,8V6c0-0.552,0.448-1,1-1h8c0.552,0,1,0.448,1,1v2C15,8.552,14.552,9,14,9z"/>
            </svg>
           `;
    }
    if (icon === "avbryt") {
        return `
            <svg class="` + icon + `" ` + xml + viewbox + `>
                <path ` + color + `
                d="M 6 2 C 4.9 2 4 2.9 4 4 L 4 20 C 4 21.1 4.9 22 6 22 L 11.078125 22 C 10.419125 20.863 10.027953 19.551437 10.001953 18.148438 C 9.9369531 14.659437 12.170172 11.641125 15.451172 10.453125 C 17.076172 9.865125 18.603 9.9017188 20 10.261719 L 20 8.4140625 C 20 8.1490625 19.895031 7.8940313 19.707031 7.7070312 L 14.292969 2.2929688 C 14.104969 2.1049687 13.850937 2 13.585938 2 L 6 2 z M 13 3.5 L 18.5 9 L 13 9 L 13 3.5 z M 18.001953 12 C 14.700328 12 12.001953 14.698375 12.001953 18 C 12.001953 19.24748 12.38752 20.410166 13.042969 21.373047 L 12.121094 22.294922 C 11.861094 22.554922 12.046062 23 12.414062 23 L 14.824219 23 A 1.0001 1.0001 0 0 0 15.732422 22.732422 A 1.0001 1.0001 0 0 0 16.001953 21.787109 L 16.001953 19.414062 C 16.001953 19.046062 15.556875 18.862094 15.296875 19.121094 L 14.496094 19.921875 C 14.183492 19.352587 14.001953 18.700274 14.001953 18 C 14.001953 15.779625 15.781579 14 18.001953 14 C 20.222328 14 22.001953 15.779625 22.001953 18 C 22.001953 19.945526 20.625661 21.550064 18.802734 21.919922 A 1.0003092 1.0003092 0 1 0 19.199219 23.880859 C 21.940292 23.324717 24.001953 20.892474 24.001953 18 C 24.001953 14.698375 21.303579 12 18.001953 12 z"/>
            </svg>
           `;
    }
    if (icon === "ghost") {
        return `
            <svg class="` + icon + `" ` + xml + viewbox + `>
                <path ` + color + `
                d="M19,9c-0.324-0.066-1,0.082-1-1c0-2.914-2-6-6-6C7.98,2,6,5.086,6,8c0,1.188-0.676,0.934-1,1\tc-1.954,0.398-2.762,2.009-2.953,3.983c-0.053,0.546,0.367,1.019,0.912,1.079C4.296,14.209,5,14.645,5,16c0,2.125,1.906,3,3,3\tc0,1.656,2.344,3,4,3s4-1.344,4-3c1.094,0,3-0.813,3-3c0-1.344,0.719-1.826,2.025-1.958c0.552-0.056,0.981-0.528,0.927-1.08\tC21.756,10.998,20.947,9.397,19,9z M10,8C9.449,8,9,7.551,9,7s0.449-1,1-1s1,0.449,1,1S10.551,8,10,8z M13,8c-0.551,0-1-0.449-1-1\ts0.449-1,1-1s1,0.449,1,1S13.551,8,13,8z"/>
            </svg>
           `;
    }
    if (icon === "start") {
        return `
            <svg class="` + icon + `" ` + xml + viewbox + `>
                <path ` + color + `
                d="M 12 2 A 1 1 0 0 0 11.289062 2.296875 L 1.203125 11.097656 A 0.5 0.5 0 0 0 1 11.5 A 0.5 0.5 0 0 0 1.5 12 L 4 12 L 4 20 C 4 20.552 4.448 21 5 21 L 9 21 C 9.552 21 10 20.552 10 20 L 10 14 L 14 14 L 14 20 C 14 20.552 14.448 21 15 21 L 19 21 C 19.552 21 20 20.552 20 20 L 20 12 L 22.5 12 A 0.5 0.5 0 0 0 23 11.5 A 0.5 0.5 0 0 0 22.796875 11.097656 L 12.716797 2.3027344 A 1 1 0 0 0 12.710938 2.296875 A 1 1 0 0 0 12 2 z"/> />
            </svg>
           `;
    }
    if (icon === "minimize") {
        return `
           <svg class="` + icon + `" ` + xml + viewbox + `>
                <path ` + color + `
                d="M20.26,12.948l-7.15-4.766c-0.672-0.448-1.547-0.448-2.219,0l-7.15,4.766C3.278,13.257,3,13.777,3,14.333l0,0 c0,1.329,1.481,2.121,2.587,1.384L12,11.442l6.413,4.276C19.519,16.455,21,15.662,21,14.333l0,0 C21,13.776,20.722,13.257,20.26,12.948z"/>
            </svg>
       `;
    }
    if (icon === "maximize") {
        return `
           <svg class="` + icon + `" ` + xml + viewbox + `>
                <path ` + color + `
                d="M21,11.109L21,11.109c0-1.329-1.481-2.122-2.587-1.385L12,14L5.587,9.725C4.481,8.988,3,9.78,3,11.109v0 c0,0.556,0.278,1.076,0.741,1.385l7.15,4.766c0.672,0.448,1.547,0.448,2.219,0l7.15-4.766C20.722,12.185,21,11.666,21,11.109z"/>
            </svg>
       `;
    }
    if (icon === "close") {
        return `
           <svg class="` + icon + `" ` + xml + viewbox + `>
                <path ` + color + `
                d="M 5.9902344 4.9902344 A 1.0001 1.0001 0 0 0 5.2929688 6.7070312 L 10.585938 12 L 5.2929688 17.292969 A 1.0001 1.0001 0 1 0 6.7070312 18.707031 L 12 13.414062 L 17.292969 18.707031 A 1.0001 1.0001 0 1 0 18.707031 17.292969 L 13.414062 12 L 18.707031 6.7070312 A 1.0001 1.0001 0 0 0 17.980469 4.9902344 A 1.0001 1.0001 0 0 0 17.292969 5.2929688 L 12 10.585938 L 6.7070312 5.2929688 A 1.0001 1.0001 0 0 0 5.9902344 4.9902344 z"/>
            </svg>
       `;
    }
    if (icon === "trash") {
        return `
           <svg class="` + icon + `" ` + xml + viewbox + `>
                <path ` + color + `
                d="M 10 2 L 9 3 L 4 3 L 4 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.1 5.9 22 7 22 L 17 22 C 18.1 22 19 21.1 19 20 L 19 7 L 5 7 z M 8 9 L 10 9 L 10 20 L 8 20 L 8 9 z M 14 9 L 16 9 L 16 20 L 14 20 L 14 9 z"/>
            </svg>
       `;
    }
    if (icon === "copy") {
        return `
           <svg class="` + icon + `" ` + xml + viewbox + `>
                <path ` + color + `
                d="M 4 2 C 2.895 2 2 2.895 2 4 L 2 17 C 2 17.552 2.448 18 3 18 C 3.552 18 4 17.552 4 17 L 4 4 L 17 4 C 17.552 4 18 3.552 18 3 C 18 2.448 17.552 2 17 2 L 4 2 z M 8 6 C 6.895 6 6 6.895 6 8 L 6 20 C 6 21.105 6.895 22 8 22 L 20 22 C 21.105 22 22 21.105 22 20 L 22 8 C 22 6.895 21.105 6 20 6 L 8 6 z M 8 8 L 20 8 L 20 20 L 8 20 L 8 8 z"/>
            </svg>
       `;
    }
    if (icon === "screenshot") {
        return `
           <svg class="` + icon + `" ` + xml + viewbox + `>
                <path ` + color + `
                d="M 14.119141 1.9980469 L 9.8769531 2.0019531 C 9.3179531 2.0019531 8.7832969 2.2364375 8.4042969 2.6484375 L 7.1640625 4 L 4 4 C 2.9 4 2 4.9 2 6 L 2 18 C 2 19.1 2.9 20 4 20 L 20 20 C 21.1 20 22 19.1 22 18 L 22 6 C 22 4.9 21.1 4 20 4 L 16.841797 4 L 15.59375 2.6445312 C 15.21475 2.2325313 14.679141 1.9980469 14.119141 1.9980469 z M 12 7 C 14.8 7 17 9.2 17 12 C 17 14.8 14.8 17 12 17 C 9.2 17 7 14.8 7 12 C 7 9.2 9.2 7 12 7 z M 12 9 A 3 3 0 0 0 9 12 A 3 3 0 0 0 12 15 A 3 3 0 0 0 15 12 A 3 3 0 0 0 12 9 z"/>
            </svg>
       `;
    }
    if (icon === "location") {
        return `
           <svg class="` + icon + `" ` + xml + viewbox + `>
                <path ` + color + `
                d="M 20 0 C 17.791 0 16 1.791 16 4 C 16 6.062 18.082188 8.7932969 19.242188 10.154297 C 19.641188 10.622297 20.358812 10.622297 20.757812 10.154297 C 21.916813 8.7932969 24 6.062 24 4 C 24 1.791 22.209 0 20 0 z M 12 2 C 8.739 2 5.8465312 3.577 4.0195312 6 L 4 6 L 4 6.0253906 C 2.429 8.1233906 1.6473438 10.844812 2.1523438 13.757812 C 2.8553437 17.812812 6.0867187 21.094078 10.136719 21.830078 C 16.465719 22.979078 22 18.124 22 12 C 22 11.93 21.991234 11.861969 21.990234 11.792969 C 21.753234 12.058969 21.557453 12.267672 21.439453 12.388672 L 19.681641 14.216797 C 19.335641 15.413797 18.712531 16.491672 17.894531 17.388672 C 17.635531 16.584672 16.89 16 16 16 L 15 16 L 15 14 C 15 12.895 14.105 12 13 12 L 10 12 C 9.448 12 9 11.552 9 11 C 9 10.448 9.448 10 10 10 C 10.552 10 11 9.552 11 9 L 11 8 C 11 7.448 11.448 7 12 7 L 13 7 C 13.589 7 14.114469 6.7409375 14.480469 6.3359375 C 14.188469 5.5549375 14 4.762 14 4 C 14 3.397 14.090812 2.8165781 14.257812 2.2675781 C 13.530813 2.0985781 12.777 2 12 2 z M 20 2.5703125 C 20.789 2.5703125 21.429688 3.211 21.429688 4 C 21.429688 4.789 20.789 5.4296875 20 5.4296875 C 19.211 5.4296875 18.570312 4.789 18.570312 4 C 18.570312 3.211 19.211 2.5703125 20 2.5703125 z M 4.2109375 10.210938 L 6 12 L 9 15 L 9 16 C 9 17.105 9.895 18 11 18 L 11 19.931641 C 7.06 19.436641 4 16.072 4 12 C 4 11.384 4.0779375 10.786937 4.2109375 10.210938 z"/>
            </svg>
       `;
    }
    if (icon === "locked") {
        return `
           <svg class="` + icon + `" ` + xml + viewbox + `>
                <path ` + color + `
                d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 12 13 C 13.1 13 14 13.9 14 15 C 14 16.1 13.1 17 12 17 C 10.9 17 10 16.1 10 15 C 10 13.9 10.9 13 12 13 z"/>
            </svg>
       `;
    }
    //If no icon found, leave blank
    return "";
};
