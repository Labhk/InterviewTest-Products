let express = require('express');
let app = express();
let dotenv = require('dotenv');
let morgan = require('morgan');
dotenv.config();
let port = process.env.PORT || 9870;
let mongo = require('mongodb');
let cors = require('cors')
let MongoClient = mongo.MongoClient;
let bodyParsel = require('body-parser')
const mongoUrl = 'mongodb+srv://trial321:trial321@atlascluster.kpsc2.mongodb.net/ProductData?retryWrites=true&w=majority';
let db;

app.use(morgan('common'))
app.use(bodyParsel.urlencoded({extended:true}));
app.use(bodyParsel.json());
app.use(cors());



app.get('/list', (req, res) => {
    db.collection('products').find().toArray((err, result) => {
      if (err) {
        console.error('Error retrieving product list:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.send(result);
      }
    });
});
  
  app.get('/details/:id', (req, res) => {
    let id = Number(req.params.id);
    db.collection('products').find({ id: id }).toArray((err, result) => {
      if (err) {
        console.error('Error retrieving product details:', err);
        res.status(500).send('Internal Server Error');
      } else if (result.length === 0) {
        res.status(404).send('Product not found');
      } else {
        res.send(result);
      }
    });
});
  
app.post('/add', (req, res) => {
    const product = req.body;

    if (!product.title || !product.description || !product.category) {
        res.status(400).send({auth:false,token:'Missing required fields'});
    } else {
        db.collection('products').insertOne(product, (err, result) => {
        if (err) {
            console.error('Error adding new product:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send({auth:true,token:'New Product added successfully'});
        }
        });
    }
});
  
  
app.patch('/edit/:id', (req, res) => {
    const id = Number(req.params.id);
    const updatedProduct = req.body;
  
    // Perform server-side validation
    if (!updatedProduct.title || !updatedProduct.description || !updatedProduct.category) {
      res.status(400).send({auth:false,token:'Missing required fields'});
    } else {
      db.collection('products').updateOne({ id: id }, { $set: updatedProduct }, (err, result) => {
        if (err) {
          console.error('Error updating product:', err);
          res.status(500).send('Internal Server Error');
        } else if (result.matchedCount === 0) {
          res.status(404).send('Product not found');
        } else {
          res.send({auth:true,token:'New Product Edited successfully'});
        }
      });
    }
});
  

// app.delete('/deleteOrder/:id',(req,res) => {
//     let _id = mongo.ObjectId(req.params.id);
//     db.collection('products').remove({_id},(err,result) => {
//         if(err) throw err;
//         res.send('Product Deleted')
//     })
// })


MongoClient.connect(mongoUrl,(err,client) => {
    if(err) console.log(`Error While Connecting`);
    db = client.db('ProductData')
    app.listen(port,() => {
        console.log(`listening on port ${port}`);
    })
})

