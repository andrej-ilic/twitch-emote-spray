const params = new URLSearchParams(location.search);
const channel = params.get("channel");
const emotes = {};

const fetchEmotes = () => {
  fetch("https://api.betterttv.net/2/emotes")
    .then(res => res.json())
    .then(res => {
      res.emotes.forEach(emote => {
        emotes[emote.code] = res.urlTemplate
          .replace("{{id}}", emote.id)
          .replace("{{image}}", "3x");
      });
    })
    .catch(err => console.error(err));

  fetch(`https://api.betterttv.net/2/channels/${channel}`)
    .then(res => res.json())
    .then(res => {
      res.emotes.forEach(emote => {
        emotes[emote.code] = res.urlTemplate
          .replace("{{id}}", emote.id)
          .replace("{{image}}", "3x");
      });
    })
    .catch(err => console.error(err));

  fetch(`https://api.frankerfacez.com/v1/room/${channel}`)
    .then(res => res.json())
    .then(res => {
      res.sets[res.room.set].emoticons.forEach(emote => {
        emotes[emote.name] = emote.urls[Object.keys(emote.urls).pop()];
      });
    })
    .catch(err => console.error(err));
};

const init = () => {
  fetchEmotes();

  const client = new window.tmi.Client({
    channels: [channel]
  });

  client.connect();

  client.on("message", (channel, tags, message, self) => {
    if (tags.emotes) {
      Object.keys(tags.emotes).forEach(emoteId => {
        showEmote(`https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/3.0`);
      });
    }

    message.split(" ").forEach(word => {
      if (emotes[word]) {
        showEmote(emotes[word]);
      }
    });
  });
};

init();
