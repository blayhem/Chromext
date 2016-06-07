// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    /*chrome.tabs.query invokes the callback with a list of tabs that match the
    query. When the popup is opened, there is certainly a window and at least
    one tab, so we can safely assume that |tabs| is a non-empty array.
    A window can only have one active tab at a time, so the array consists of
    exactly one tab.*/
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  /* Most methods of the Chrome extension APIs are asynchronous. This means that
  you CANNOT do something like this:
  
  var url;
  chrome.tabs.query(queryInfo, function(tabs) {
    url = tabs[0].url;
  });
  alert(url); // Shows "undefined", because chrome.tabs.query is async.*/
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    // Put the image URL in Google search.
    //renderStatus('Performing Google Image search for ' + url);
    s = url.split("/");
    doms=['twitter.com', 'github.com', 'www.facebook.com']
    if (doms.indexOf(s[2]) != -1 && s[3] != '') {

      //AVATAR PIC SCRAPPER
      chrome.tabs.executeScript(null, {
        code: "var avatar =  document.getElementsByClassName('ProfileAvatar-image ')[0].src; avatar"
      },
        function (avatar) {
          var img = document.createElement("img");
          img.src = avatar;
          img.style = 'left: 0; right: 0; position: absolute; z-index: 1; margin: auto; margin-top: 10px; margin-bottom: 10px; height: 150px; width: 150px; border-radius: 100px;'
          var container = document.getElementById("container");
          container.appendChild(img);
        }
      );

      chrome.tabs.executeScript(null, {
        code: "var header =  document.getElementsByClassName('ProfileCanopy-headerBg')[0].getElementsByTagName('img')[0].src; header"
      },
        function (header) {
          var bg = document.createElement("img");
          bg.src = header;
          bg.style = 'margin-left: -100px; height: 180px;'+
          '-webkit-filter: blur(5px);'

          var bgcontainer = document.createElement("div");
          bgcontainer.style = 'height: 170px; overflow: hidden;';
          bgcontainer.appendChild(bg);

          var container = document.getElementById("container");
          container.style = 'height = 170px; overflow: hidden;'
          container.appendChild(bgcontainer);
        }
      );
      renderStatus('@' + s[3]);
    }

    // DINOSAUR
    else {
      var text = document.createElement("div");
      text.id = 'status';
      document.body.appendChild(text);
      renderStatus('Crap! No user found');

      var img = document.createElement("img");
      img.src = '/trex.png';
      img.style = 'margin-left: 40px; margin-bottom: 10px;'
      document.body.appendChild(img);
    }

  });
});
