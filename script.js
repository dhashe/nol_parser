// Cite: https://stackoverflow.com/a/18324384
function callAjax(url, callback){
    var xmlhttp;
    // compatible with IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            callback(xmlhttp.responseText);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

// Cite: https://stackoverflow.com/a/3855394
var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

// We use AWS Lambda for actual processing.
var base_url = "https://64zej0ymo1.execute-api.us-east-2.amazonaws.com/prod";
var url = base_url + "/nol_parser" +
        "?sentence=" + qs["sentence"] +
        "&annotations=" + qs["annotations"];

function include_results(response_text) {

    parsed = JSON.parse(response_text);

    // Cite: https://www.w3schools.com/js/js_htmldom_nodes.asp
    var text = JSON.stringify(parsed['parts-of-speech'], null, 2);
    var para = document.createElement("p");
    var node = document.createTextNode(text);
    para.appendChild(node);
    var token_div = document.getElementById("div-token");
    token_div.appendChild(para);

    for (i in parsed['trees']) {
        var div = document.createElement("div");
        var tree_div = document.getElementById("div-tree");
        div.innerHTML = parsed['trees'][i];
        tree_div.appendChild(div);
    }
};

callAjax(url, include_results);
