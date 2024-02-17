const print = console.log;
const express=require('express')
const app=express()
const mongoose = require('mongoose');
const msal = require('@azure/msal-node');
const session=require('express-session');
const MongoStore = require('connect-mongo');





document.querySelector("#outlook").addEventListener('click', function() {
    window.location.href = '/auth';
    console.log("Hi");
});







mongoose.connect("mongodb://localhost/msAuthDB")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Connection error:", error);
  })


// const axios = require('axios');
const userSchema = new mongoose.Schema({
    userId: String, 
    email: String, //username
    displayName: String,//name
});

const User = mongoose.model('User', userSchema);



app.use(session({
    secret:'tanmaysushant@room',
    resave:false,
    saveUninitialized:false,
    cookie: { secure: 'auto', maxAge: 3600000 },
    store:MongoStore.create({
        mongoUrl:'mongodb://localhost/msAuthDB',
    }),

}))



app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs") // dyanmic content render hoga all keep in views folder
app.use(express.json())// parse json information from body 

const msalConfig = {
    auth: {
        clientId: 'f33b06ab-53bf-49cf-b257-dc1188511391',
        authority: 'https://login.microsoftonline.com/850aa78d-94e1-4bc6-9cf3-8c11b530701c',
        clientSecret: 'F6J8Q~tSsV4.LyzpsYOUnf2-WDwenXqkDFq6NcPY'
    }
};
const msalClient = new msal.ConfidentialClientApplication(msalConfig);

const tokenSchema = new mongoose.Schema({
  userId: String,
  accessToken: String,
  name:String,
  username:String,// username:email
});


const Token = mongoose.model('Token', tokenSchema);

const SCOPES = ['user.read', 'contacts.read', 'mail.read','openid','profile','offline_access'];





app.get('/auth', (req, res) => {
    print(88);
    const authUrlParameters = {
        scopes: SCOPES,
        redirectUri: 'http://localhost:3000/after',
    };
    print(1)
    msalClient.getAuthCodeUrl(authUrlParameters)
        .then((authUrl) => {
            print(11)
            print(authUrl)
            res.redirect(authUrl);
        })
        .catch((error) => {
            print(10)
            res.status(500).send(error);
        });
});



app.get('/',(req,res)=>{
    print(2)
    res.render("new",{title:'Sushant protoype'})   
})
app.get('/redirect',(req,res)=>{ 
    res.render("redirect") 
})
app.get('/new-page',(req,res)=>{ 

    res.render("new-page") 
})
app.get('/bb', (req, res) => {
    res.render('bb');
  });
app.get('/bbi', async(req, res) => {
    // print(req)
    const user=await Token.findOne({userId:req.session.userId});
    print(user)
    if(!user){
        print(71);
        res.redirect('/auth');
    }
    else{
        print(72);
        res.render("bb");
    }









    // res.render('bb');
  });




app.get('/after',async (req, res) => {
    print(33)
    const tokenRequest = {
        code: req.query.code,
        scopes: SCOPES,
        redirectUri: 'http://localhost:3000/after',
    };
    print(3)
    try {
    const response = await msalClient.acquireTokenByCode(tokenRequest);
    try {
        print(4)
        await saveTokenToDatabase(response);
        req.session.accessToken = response.accessToken;
        req.session.userId = response.account.homeAccountId;
        res.redirect('redirect');
    } catch (error) {
        print(5)
        console.log(error);
        res.status(500).send('Failed : ' + error);
        // res.redirect('/redirect'); // Redirect to login on token refresh failure
    }

} catch (error) {
    res.status(500).send(`Authentication failed: ${error}`);
}

});



async function saveTokenToDatabase(tokenResponse) {
    print(6)
    try {
        let existingToken = await Token.findOne({ userId: tokenResponse.account.homeAccountId });
        if (existingToken) {
            existingToken.accessToken = tokenResponse.accessToken;

        } else {
            existingToken = new Token({

                userId: tokenResponse.account.homeAccountId,
                accessToken: tokenResponse.accessToken,
                username:tokenResponse.account.username,
                name:tokenResponse.account.name,
            });
        }
        await existingToken.save();
    } catch (err) {
        console.error(err);
        throw err;
    }
}





















 // to check on clicking button this get was excuted 
// app.use((req,res,next)=>{
//     res.status(404).render('404',{title:'404'});
//     next();
//     console.log(req.method)
// }
// );



app.get('/logout', async(req, res) => {
    const userIds = req.session.userId;
    // print(0)
    // print(req.session)
    if (!userIds) {
        print(userIds);
        // res.render("bb");
        console.log(66)
        
        res.redirect('auth'); // If not logged in, redirect to home
    }
    else{
    try {
        await Token.deleteOne({ userId:userIds });
        res.clearCookie('connect.sid');


        req.session.destroy((err) => {
        //     print(73)
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).send("Failed to logout");
            }

        // res.render("new",{title:'Sushant '}) 
        // res.render("bb")
        // res.clearCookie('connect.sid', { path: '/' });
        res.redirect('/');



        
        });
    } catch (error) {
        console.error("Error deleting user data:", error);
        res.status(500).send("Failed to delete user data");
    }
}
});




// app.use(async(req,res,next)=>{
//     try{
//         const user=await Token.findOne({userId:req.secure.userId});
//         if(!user||!user.accessToken){
//             res.redirect('/auth');
//         }
//         else{
//             const silentTokenRequest={
//                 scopes:SCOPES,
//                 account:user.userId,
//             };
//             try{
//                 const resonse=await msalClient.acquireTokenSilent(silentTokenRequest);
//                 user.accessToken=resonse.accessToken;
//                 req.session.accessToken=resonse.accessToken;
//                 await user.save();
//                 next();
//             }catch(error){
//                 console.error("Token refresh failed:", error);
//                 res.redirect('/new');
//             }
//         }
//     }catch (error){
//         console.error("Token refresh:" ,error);
//         res.redirect('/new');
//     }
// });






// const userRouter=require('./routes/users')
// const postRouter=require('./routes/post')


// app.use('/users',userRouter)// middlewear

app.listen(3000,()=>{
    console.log('BYE')
})