# The News
## Description
  This is a social media website. A user can create a post and also make likes, and comments on other's posts. Users can also filter out the posts within a certain distance.
So, a user can also validate the other user's post by commenting or giving a dislike to that post.

## Installation

```bash
git clone https://github.com/saroyar123/THE_NEWS_backend.git
cd the_news_backend
npm install

```

## Usage

```
Setup env file

PORT=XXXX
DatabaseUrl=<your-mongodb-uri>
jwtPrivateKey=<your-jwt-secret>

cloudinar_CloudNamne=""
cloudinar_ApiKey=""
cloudinar_ApiSecret=""

```

## Api Endpoints

```javascript
User Api Endpoints
 post('/login',userLogin) //User login API
 post("/register",register) // create user API
 get("/getUser",auth,getAllUser) // get user info
 delete('/deleteUser',auth,deleteUser) // delete the user from database
 get('/logout',auth,logout) // Logout

Posts Pi Endpoints
 post('/post',auth,createPost) // create a post
 get('/like/:id/:lu',auth,likePost) // Api for like and dislike a post
 delete('/post/:id',auth,deletePost) // delete the post from database
 post('/comment/:id',auth,commentOnPost) // Comments on a posts
 delete('/comment/:id',auth,deleteComment) // Delete the comments
```



## Deploy

```
Link: https://thenews-backend.onrender.com/

```
## Frontend

```
Github: https://github.com/saroyar123/The_news_Frontend
Live: https://the-news.onrender.com/
```
