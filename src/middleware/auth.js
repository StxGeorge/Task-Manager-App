const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const userP = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        
        if(!userP){
            throw new Error();
        } else{
            req.token = token;
            req.user = userP;
        next();
        }
        
    } catch (e) {
        res.status(401).send({ error: 'Please Authenticate'})
    }
   
};

module.exports = auth;