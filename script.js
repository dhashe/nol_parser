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

// We use AWS Lambda for actual processing.
var base_url = "https://64zej0ymo1.execute-api.us-east-2.amazonaws.com/prod";
var url = base_url + "/nol_parser" + window.location.search;

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

// Cite: https://stackoverflow.com/a/14853880
var counter = 0;
function add_annotation_field() {
    var container = document.getElementById("container");

    function add_input(label, name) {
        container.appendChild(document.createTextNode(label));
        var input = document.createElement("input");
        input.type = "text";
        input.name = name;
        container.appendChild(input);
    }

    add_input("Index: ", "index" + counter);
    add_input("Value: ", "value" + counter);

    container.appendChild(document.createElement("br"));
    counter += 1;
}

if (window.location.search) {
    callAjax(url, include_results);
}
