const express = require('express');
const db = require('../user/userDb')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const restricted = require('../auth/auth-middleware');
const router = express.Router();
const puppeteer = require('puppeteer');
const scrapers = require('./scrapers');

router.get('/', (req,res) =>{
    db.get().then(users => {
        res.status(200).json(users);
    }).catch(err => {
        res.status(500).json({ error: "The user information could not be retrieved." })
    })
})
router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
    user.password = hash;
    db.insert(user)
      .then(saved => {
        const token = genToken(user)
        res.status(201).json({...saved, token:token});
      })
      .catch(error => {
        res.status(500).json(error);
        console.log(error)
      });
  });
  router.post('/login', (req, res) => {
    let { phone, password } = req.body;
  
    db.getBy({ phone })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = genToken(user)
          res.status(200).json({
            message: `Welcome ${user.name}!`, token: token 
          });
        } else {
          res.status(401).json({ message: 'Invalid Credentials'});
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

router.get('/:id/products', (req, res) =>{
    const {id} = req.params;

    db.getUserProducts(id)
    .then(products => {
        if(products){
        res.status(200).json(products)
        } else{
            res.status(404).json({ message: "The product(s) with the specified ID does not exist." })
        }
    })
    .catch(err =>{
        res.status(500).json({ error: "The product information could not be retrieved." })
    })
})
router.post ('/addProduct', (req, res) => {
    const user_id = req.body;
    const {url} = req.body
    user_id && url ?  db.insertUserProducts(user_id, url)
    .then(hello =>{
      const getInfo = async () => {
        const result = await scrapeProduct(url)
        res.send(result)
       }
       getInfo();
        
    }) : res.status(400).json({ errorMessage: "Please provide a user Id and url for the product." })
   
    .catch(err =>{
        res.status(500).json({ error: err })
    })
});
router.delete('/product/:id', (req, res) => {
    const {id} = req.params;

    db.removeUserProducts(id)
    .then(hey =>{
        res.status(200).json(hey)
        
    })
    .catch(err =>{
        res.status(500).json({ error: "The user could not be removed" })
    })
});

router.get('/:id/products2', (req, res) =>{
  const {id} = req.params;

  db.getUserProducts(id)
  .then(products => {
      if(products){
        const getInfo2 = async () => {
          arr = []
          for (i = 0; i < products.length; i++){
            var result = await scrapers.scrapeProduct(products[i].url)
              arr.push(result)
            
          }
          res.send(arr)
          
         }
         getInfo2();


      } else{
          res.status(404).json({ message: "The product(s) with the specified ID does not exist." })
      }
  })
  .catch(err =>{
      res.status(500).json({ error: "The product information could not be retrieved." })
  })
})






function genToken(user){
  const payload ={
    subject: user.id,
    username: user.phone
  };
  const secret = "super secret";
  const opttions={
    expiresIn: '8h',
  }
  return token = jwt.sign(payload, secret, opttions)
}




module.exports = router;