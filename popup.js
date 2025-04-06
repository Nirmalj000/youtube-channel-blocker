document.addEventListener("DOMContentLoaded", function () {
    let channelList = document.getElementById("channelList");
    let channelInput = document.getElementById("channelInput");
    let addChannelBtn = document.getElementById("addChannel");
  
    function extractChannelID(url) {
      let match = url.match(/(channel\/[a-zA-Z0-9_-]+|@[^/]+)/);
      return match ? match[0] : "";
    }
  
    function updateList() {
      chrome.storage.sync.get("blockedChannels", function (data) {
        channelList.innerHTML = "";
        (data.blockedChannels || []).forEach(channel => {
          let li = document.createElement("li");
          li.textContent = channel;
          let removeBtn = document.createElement("button");
          removeBtn.textContent = "X";
          removeBtn.onclick = function () {
            chrome.storage.sync.set({
              "blockedChannels": data.blockedChannels.filter(c => c !== channel)
            }, updateList);
          };
          li.appendChild(removeBtn);
          channelList.appendChild(li);
        });
      });
    }
  
    addChannelBtn.onclick = function () {
      let newChannel = extractChannelID(channelInput.value.trim());
      if (newChannel) {
        chrome.storage.sync.get("blockedChannels", function (data) {
          let blocked = data.blockedChannels || [];
          if (!blocked.includes(newChannel)) {
            blocked.push(newChannel);
            chrome.storage.sync.set({ "blockedChannels": blocked }, updateList);
          }
        });
        channelInput.value = "";
      }
    };
  
    updateList();
  });
  