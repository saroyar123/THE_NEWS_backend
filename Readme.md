

```bash
This is a news-sharing web application where you can share the news. 
``` 

```
Routes:
Users Routes:-
router.post('/login',userLogin);
router.post("/register",register);
router.get("/getUser",auth,getAllUser);
router.delete('/deleteUser',auth,deleteUser);
router.get('/logout',auth,logout);

Posts Routes:-
router.post('/post',auth,createPost);
router.get('/like/:id/:lu',auth,likePost);
router.delete('/post/:id',auth,deletePost);
router.post('/comment/:id',auth,commentOnPost);
router.delete('/comment/:id',auth,deleteComment)

```
```
working on the frontend
Frontend:-https://github.com/saroyar123/The_news_Frontend
```

