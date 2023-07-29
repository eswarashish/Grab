const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose= require("mongoose");
var md5 = require("md5");
const { log } = require("console");
const session = require("express-session");
const passport = require("passport");
const passportlocalmongoose = require("passport-local-mongoose");
const localstrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const findOrCreate = require("mongoose-find-or-create");
mongoose.connect("mongodb+srv://20bec023:family321@cluster0.czvv3ra.mongodb.net/", {useNewUrlParser: true},{useUnifiedTopology: true})

let vari = false;
var Email ="";



app.use(session({
    secret: "Our little secret",
    resave: false,
    saveUninitialized: true

}))

app.use(passport.initialize());
app.use(passport.session());


app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));

app.use('/public',express.static("public"));
//data schema
const itemSchema= new mongoose.Schema({
    name: String,
    price: Number,
    email: String
    
})
const cartSchema= new mongoose.Schema({
    name: String,
    price: Number,
    email: String
})
const Item = mongoose.model("Item", itemSchema);
const Cart = mongoose.model("Cart", cartSchema);
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    
});
userSchema.plugin(passportlocalmongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
    done(null, user.id);
    
});//check these for errors
passport.deserializeUser(function (id, done) {
User.findById(id, function(err, user){
    done(err, user);
})    
});
// passport.use(new localstrategy(User.authenticate()));
// passport.serializeUser(function(user, cb) {
//     process.nextTick(function() {
//       cb(null, { id: user.id, username: user.username });
//     });
//   });
  
//   passport.deserializeUser(function(user, cb) {
//     process.nextTick(function() {
//       return cb(null, user);
//     });
//   });

passport.use(new GoogleStrategy({
    clientID: "280233833254-sf9glr70cnflj2pks4ved6tm1kdna0uc.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/auth/google/main",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    
    User.findOrCreate({ email: profile.email }, function (err, user) {
        
      return done(err, user);
    });
  }
));

app.get("/", function (req,res) {
  if (vari==false) {
    res.render("index");
  } else {
    res.redirect("/main")
  }
    
  
  
    
    
})
app.post("/register", function (req,res) {
    
       
    
    
   
   Email = req.body.email;
    var Pswd = req.body.pswd;
    var Rntr = req.body.renter;
    if (Pswd === Rntr) {
        vari = true;
    //     User.register(new User({ username: Email}), Pswd, function (err, user) {
    //         if (err) {
    //             res.json({ success: false, message: "Your account could not be saved. Error: " + err });
    //         }
    //         else {
    //             req.login(user, function(err){
    //                 if (err) {
    //                  res.redirect("/")
    //                 } else {
                     
    //                      res.redirect("/")
                     
    //                 }
    //              });
    //         }
        
    // });




    //    const register = await User.register({username: Email}, Pswd);
    //    if (register) {
       
            
    //         passport.authenticate("local")(req, res, function() {
    //             res.redirect("/main")
    //         })
        
    
    //    } else {
        
    //    }
        const user = new User({
email: Email,
password: md5(Pswd)
        });
    user.save();
    res.redirect("/main")
    } else {
        
        res.redirect("/")
        
    }
})
// const user = new User({
//     username: Email,
//     password: Pswd
// });
app.post("/login", function (req, res) {
     Email = req.body.email1;
    var Pswd =req.body.pswd1;

//  const user = new User({
//      username: Email,
//      password: Pswd
// });
// req.login(user, function(err){
//    if (err) {
//     res.redirect("/")
//    } else {
//     passport.authenticate("local")(req, res, function() {
//         res.redirect("/main")
//     })
//    }
// })


// passport.authenticate("local", function (err, user, info) {
//     if (user) {
//         res.redirect("/main")
//     }
//     else {
        
//             // const token = jwt.sign({ userId: user._id, username: user.username }, secretkey, { expiresIn: "24h" });
//             res.redirect("/");
//         }
//     }
// )(req, res);
User.findOne({email: Email}).then(foundUser=>{
    if (foundUser.password === md5(Pswd)) {
        vari = true;
        // req.isAuthenticated() = true;
        res.redirect("/main")
    }
})

    
})
app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));
app.get("/auth/google/main", passport.authenticate("google",{failureRedirect: "/"}),function (req, res) {
    Email=req.user.email;
vari=true;
res.redirect("/main");
})
app.get("/main", function (req, res) {
 if (vari) {
    Item.find({email: Email}).then(foundItems => {

        res.render("main",{newitems: foundItems});
    
            
        })

    
 }
  else{
    res.redirect("/")
  }
   
})

 app.listen(3000, function(){
 console.log("server started");
 })

app.get("/men", function (req,res) {
if (vari) {
    

    Item.find({email: Email}).then(foundItems => {

        res.render("men",{newitems: foundItems});
    
            
        })
}else{
    res.redirect("/")
  }
   
})
app.post("/men", function (req, res) {
    
    var itemName = req.body.itemname;
    var itmprice = req.body.itemprice;
    const item1 = new Item({
        name: itemName,
        price: itmprice,
        email: Email,
        
    })
    

 

    
 item1.save()
 User.updateMany({email: Email}, {$push: {cart: {item1}}})
 
    res.redirect("/men")
   
})
app.get("/women", function (req,res) {
    if (vari) {
        
   
    
        Item.find({email: Email}).then(foundItems => {

            res.render("women",{newitems: foundItems});
        
                
            })
    } else{
        res.redirect("/")
      }
   
})
app.post("/women", function (req, res) {
    var itemName = req.body.itemname;
    var itmprice = req.body.itemprice;
    const item2 = new Item({
        name: itemName,
        price: itmprice,
        email: Email,
        
    })
    

 

    
 item2.save()

 
    res.redirect("/women")
   
})
   
app.post("/delete", function (req, res) {
    const removeitemId = req.body.removebtn
    
   
Item.findByIdAndRemove(removeitemId).then(function(err){
   if (err) {
 res.redirect("/main");
   }
})

})
app.get("/signout", function (req,res) {
Email="";
vari =false;   
res.redirect("/");
})
app.post("/checkout", function (req, res) {


Item.find({email: Email}).then(foundItems =>{
    foundItems.forEach(function(item){
        const cart = new Cart({
            id: item.id,
            name: item.name,
            price: item.price,
            email: item.email
        })
        cart.save();

    });
Item.deleteMany({email: Email}).then(res.redirect("/checkout"))
    
})

})
app.get("/checkout", function(req, res) {
    if (vari) {
          
            // ethereum.request({method: 'eth_sendTransaction', params: [transactionParam]}).then(txhash =>{
                res.render("success")
            //     console.log(txhash);
            //     checkTrans(txhash).then(r => alert(r));
            // })
        
    }
    else{
        res.redirect("/")
    }
})
// function checkTrans(txhash) {
//     let checktransloop = () => {
//         return ethereum.request({method: 'eth_getTransactionReceipt', params: [txhash]}).then(r => {
//             if(r!= null) return 'confirmed';
//             else return checktransloop();
//         });

//     }

//     return checktransloop();
// }
