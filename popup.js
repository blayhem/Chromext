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
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    s = url.split("/");
    doms=['twitter.com', 'github.com', 'www.facebook.com']
    if (doms.indexOf(s[2]) != -1 && s[3] != '') {
      // FRAME CREATION
      var avatar = document.createElement("img");
      avatar.style = 'left: 0; right: 0; position: absolute; z-index: 1; margin: auto; margin-top: 10px; margin-bottom: 10px; height: 150px; width: 150px; border-radius: 100px;'
      var container = document.getElementById("container");
      container.appendChild(avatar);

      var header = document.createElement("img");
      header.style = 'margin-left: -100px; height: 180px;' +
      '-webkit-filter: blur(5px);'
      
      var bgcontainer = document.createElement("div");
      bgcontainer.style = 'height: 170px; overflow: hidden;';
      bgcontainer.appendChild(header);
      container.appendChild(bgcontainer);

      var text = document.createElement("div");
      document.body.appendChild(text);
      var alias = document.createElement("h2");
      text.appendChild(alias);

      var id = document.createElement("p");
      text.appendChild(id)

      if (s[2] == 'twitter.com') {
        chrome.tabs.executeScript(null, {
          code: "var alias = document.getElementsByClassName('ProfileHeaderCard-nameLink')[0].innerHTML;" +
          "var header = document.getElementsByClassName('ProfileCanopy-headerBg')[0].getElementsByTagName('img')[0].src; " +
          "var id = document.getElementsByClassName('u-linkComplex-target')[0].innerHTML;" +
          "var avatar =  document.getElementsByClassName('ProfileAvatar-image ')[0].src;" +
          "var arrayobj = [avatar, header, alias, id]; arrayobj"
        },
          function (arrayobj) {
            avatar.src = arrayobj[0][0];
            header.src = arrayobj[0][1];
            alias.innerHTML = arrayobj[0][2];
            id.innerHTML = '@' + arrayobj[0][3];
          }
        );
      }

      else if (s[2] == 'github.com') {
        chrome.tabs.executeScript(null, {
          code: "var alias = document.getElementsByClassName('vcard-fullname')[0].innerHTML;" +
          "var header = 'http://werehumans.com/wp-content/uploads/2016/04/CodingSnippet.jpg'; " +
          "var id = document.getElementsByClassName('vcard-username')[0].innerHTML;" +
          "var avatar =  document.getElementsByClassName('rounded-2')[0].src;" +
          //"alert(header);" +
          "var arrayobj = [avatar, header, alias, id]; arrayobj"
        },
          function (arrayobj) {
            avatar.src = arrayobj[0][0];
            header.src = arrayobj[0][1];
            header.style = 'width: 400px; -webkit-filter: blur(5px);'
            alias.innerHTML = arrayobj[0][2];
            alias.style = 'max-height: 1.5em; overflow: hidden;'
            id.innerHTML = '@' + arrayobj[0][3];
          }
        );
      }

      else if (s[2] == 'www.facebook.com') {
        chrome.tabs.executeScript(null, {
          code: "var alias = document.getElementById('fb-timeline-cover-name').innerHTML;" +
          "var header = document.getElementsByClassName('coverPhotoImg')[0].src; " +
          "var avatar =  document.getElementsByClassName('profilePic')[0].src;" +
          //"alert(avatar);" +
          "var arrayobj = [avatar, header, alias]; arrayobj"
        },
          function (arrayobj) {
            avatar.src = arrayobj[0][0];
            header.src = arrayobj[0][1];
            header.style = 'margin-left: -100px; width: 400px; -webkit-filter: blur(5px);'
            alias.innerHTML = arrayobj[0][2];

          }
        );
      }
    }
    // DINOSAUR
    else {
      var text = document.createElement("div");
      text.id = 'status';
      document.body.appendChild(text);
      document.getElementById('status').textContent = ('Crap! No user found');

      var img = document.createElement("img");
      img.src = '/trex.png';
      img.style = 'margin-bottom: 10px;'
      document.body.appendChild(img);
    }

  });
});
