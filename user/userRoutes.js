const express = require('express');
const db = require('../user/userDb')
const bcrypt = require('bcryptjs');
const restricted = require('../auth/auth-middleware');
const router = express.Router();
const scrapers = require('./scrapers');
const createToken = require('./token')

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
        const token = createToken.genToken(user)
        res.status(201).json({id:saved.id, name:saved.name, token:token});
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
          const token = createToken.genToken(user)
          res.status(200).json({ id:user.id, name:user.name, token: token 
          });
        } else {
          res.status(401).json({ message: 'Invalid Credentials'});
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

//Get info of product stored in the database
//returns id of product and url

//Could update database to take url from user -> 
//run it through the scraper -> 
//store results (url, image_url, description/name, and price) in database -> 
//return entire entry as response
router.get('/:id/products', (req, res) =>{
    const {id} = req.params;
    db.getUserProducts(id)
    .then(products => {
        res.status(200).json(products)
        })
    .catch(err =>{
        res.status(500).json({ error: err })
    })
})
//inserts url and user ID directly to database
// router.post ('/addProduct', (req, res) => {
//     const {user_id} = req.body;
//     const {url} = req.body
//     user_id && url ? db.insertUserProducts(user_id, url)
//     .then(result =>{
//         res.send(result)
        
//     }) : res.status(400).json({ errorMessage: "Please provide a user Id and url for the product." })
   
//     .catch(err =>{
//         res.status(500).json({ error: err })
//     })
// });

router.post ('/scrapeAndAdd', (req, res) => {
  const {user_id} = req.body;
  const {url} = req.body
  const getInfo2 = async () => {
    var result = await scrapers.scrapeProduct(url)
    result = {user_id:user_id, url:url,...result}
    db.insertUserProducts(result)
    .then(response =>
      res.send(response)
    )}
   getInfo2();
})

//deletes product in database by product ID
router.delete('/product/:id', (req, res) => {
    const {id} = req.params;
    db.removeUserProducts(id)
    .then(response =>{
        res.status(200).json(response)
    })
    .catch(err =>{
        res.status(500).json({ error: "The user could not be removed" })
    })
});


//queries database for product and runs url through scraper => returns img_url, description, and price of product. 
//NO info returned is stored in database
// may be useful for running cron jobs

// router.get('/:id/products2', (req, res) =>{
//   const {id} = req.params;
//   db.getUserProducts(id)
//   .then(products => {
//       if(products){
//         const getInfo2 = async () => {
//           arr = []
//           for (i = 0; i < products.length; i++){
//             var result = await scrapers.scrapeProduct(products[i].url)
//               arr.push(result)
//           }
//           res.send(arr)
//          }
//          getInfo2();
//       } else{
//           res.status(404).json({ message: "The product(s) with the specified ID does not exist." })
//       }
//   })
//   .catch(err =>{
//       res.status(500).json({ error: "The product information could not be retrieved." })
//   })
// })


module.exports = router;