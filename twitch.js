const params = new URLSearchParams(location.search);
const channel = params.get("channel");
const emotes = {};

const fetchEmotes = () => {
  fetch("https://api.betterttv.net/3/cached/emotes/global")
    .then((res) => res.json())
    .then((res) => {
      res.forEach((emote) => {
        emotes[emote.code] = `https://cdn.betterttv.net/emote/${emote.id}/3x`;
      });
    })
    .catch((err) => console.error(err));

  fetch(`https://api.frankerfacez.com/v1/room/${channel}`)
    .then((res) => res.json())
    .then((res) => {
      res.sets[res.room.set].emoticons.forEach((emote) => {
        emotes[emote.name] = emote.urls[Object.keys(emote.urls).pop()];
      });
    })
    .catch((err) => console.error(err));
};

const init = () => {
  fetchEmotes();

  ComfyJS.onChat = (user, message, flags, self, extra) => {
    if (extra.messageEmotes) {
      Object.keys(extra.messageEmotes).forEach((emoteId) => {
        showEmote(`https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/3.0`);
      });
    }

    message.split(" ").forEach((word) => {
      if (emotes[word]) {
        showEmote(emotes[word]);
      }
    });
  };

  ComfyJS.Init(channel);
};

init();
