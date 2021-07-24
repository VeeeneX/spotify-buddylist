const fetch = require('node-fetch')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs/promises');

const getWebAccessToken = async function getWebAccessToken (spDcCookie) {
  const res = await fetch('https://open.spotify.com/get_access_token?reason=transport&productType=web_player', {
    headers: {
      Cookie: `sp_dc=${spDcCookie}`
    }
  })

  return res.json()
};

const getFriendActivity = async function getFriendActivity (webAccessToken) {
  const res = await fetch('https://guc-spclient.spotify.com/presence-view/v1/buddylist', {
    headers: {
      Authorization: `Bearer ${webAccessToken}`
    }
  })

  return res.json()
};

const getNewSong = async () => {
  const { accessToken } = await getWebAccessToken("AQB5GD9siGDdMqcrEsmXtYwGmucIPu7g9n_Ed24rwnRu1cCFfZDArALpmgOGlkfhxxN8ZtLNZi0LIiV907xFQ5BOaC6JHXWX1wefILmILS4r")
  const { friends } = await getFriendActivity(accessToken)
  return friends[0].track;
}

const playSong = async (uri, track) => {
  let { stdout, stderr } = [null, null];

  ({ stdout, stderr } = await exec(`playerctl -p spotify open "${uri}"`));
  console.log('playing:', track);
  
  ({ stdout, stderr } = await exec(`playerctl -p spotify metadata`));
  return (+stdout.match(/mpris:length\s+(\d+)/)[1]) / 1000
}

const pauseSong = async (uri, track) => {
  let { stdout, stderr } = [null, null];
  ({ stdout, stderr } = await exec(`playerctl -p spotify pause`));
  console.log('paused');
}

const play = async (lastUri = null) => {
  let { uri, name } = await getNewSong();
  const songLength = await playSong(uri, name);

  setTimeout(async () => {
    if (lastUri === uri) {
      await pauseSong();

      do {
         ({ uri, name } = await getNewSong());
      } while (uri === lastUri);
      
      return play(uri);
    }

    return play(uri);
  }, songLength)
}

(async () => play())();

