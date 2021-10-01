const jwt = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const registrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    phone: {
        type:Number,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    cpassword: {
        type:String,
        required:true
    },
    tokens: [
        {
            token: {
                type:String,
                required:true
            }
        }
    ]
}, {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
})


//we are hashing the password
registrationSchema.pre('save', async function(next) {
    // console.log("hi from inside");
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});

//we are genarting token
registrationSchema.methods.generateAuthToken = async function() {
    try {
           let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY);
           this.tokens = this.tokens.concat({token: token});
           await this.save();
           return token;
    } catch(err) {
        console.log(err);
    }
}


//collection creation
const Registration  = mongoose.model('REGISTRATION',registrationSchema);

module.exports = Registration;