require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const db = require('./user/userDb')
const scrapers = require('./user/scrapers.js');

console.log("twilio.js running")
db.getAllProducts()
.then(products =>{
    products.forEach(el =>{
    const getInfo2 = async () => {
        var result = await scrapers.scrapeProduct(el.url)
        db.updateProducts(el.id, result)
        .then(res => {
            db.getAllProducts()
            .then(products =>{
                products.forEach(el => {
                    if(el.notifications){
                    const price = parseFloat(el.price.split(/[$]/).join(""))
                    const target_price = parseFloat(el.target_price.split(/[$]/).join(""))
                    const user_id = el.user_id
                    const product_url = el.url
        
                    //scrape price only for all products 
                    //insert price into db
                    //check if price is less than or equal to target_price
                    //if so send sms with message and url
                    //console.log(user_id,price, target_price, el.url)
                    db.getById(user_id)
                    .then(user =>{
                        // console.log("Current Price",price, "Target Price", target_price)
                        
                        if(price <= target_price){
                            user_phone = user.phone.toString()
                            // console.log(user_phone)
                            client.messages
                            .create({
                                body: `Great news! The price of the product you were watching has dropped ${product_url}`,
                                from: '+13163304040',
                                to: `+1${user.phone}`
                            })
                            .then(message => console.log(message.sid));
                        }
                    })
        }})
               
            })
            })
       
        }
        getInfo2()
        
    })
    })

    