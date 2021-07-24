const {getWebAccessToken, getFriendActivity} = require('./index')

(async () => {
    const { accessToken } = await getWebAccessToken("AQB5GD9siGDdMqcrEsmXtYwGmucIPu7g9n_Ed24rwnRu1cCFfZDArALpmgOGlkfhxxN8ZtLNZi0LIiV907xFQ5BOaC6JHXWX1wefILmILS4r")
    const friendActivity = await getFriendActivity(accessToken)
    console.log(friendActivity)
})()