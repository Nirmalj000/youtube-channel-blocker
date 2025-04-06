function extractChannelID(url) {
    let match = url.match(/(channel\/[a-zA-Z0-9_-]+|@[^/]+)/);
    return match ? match[0] : "";
  }
  
  function blockChannels() {
    chrome.storage.sync.get("blockedChannels", function (data) {
      let blocked = data.blockedChannels || [];
  
      document.querySelectorAll("ytd-channel-name a, ytd-video-owner-renderer a").forEach(channel => {
        let channelID = extractChannelID(channel.href);
        
        if (blocked.some(blockedURL => channelID.includes(blockedURL))) {
          let videoContainer = channel.closest("ytd-grid-video-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-reel-item-renderer, ytd-rich-item-renderer, ytd-reel-shelf-renderer, ytd-video-renderer");
          if (videoContainer) {
            videoContainer.style.display = "none";
          }
        }
      });
    });
  }
  
  // Run once and also observe for dynamic changes
  blockChannels();
  new MutationObserver(blockChannels).observe(document.body, { childList: true, subtree: true });
  