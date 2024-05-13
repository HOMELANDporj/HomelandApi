const mongoose = require("mongoose");

const driverSchema = mongoose.Schema({
  
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: 3,
    maxlength: 50,
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true, // Ensures unique phone numbers
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  licenseNumber: {
    type: String,
   // required: true,
     // unique: true // This unique constraint should be removed
  },
  idPictureFront: {
    type:String,
    required: [true, "Id picture front is required"],
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Image',
  },
  idPictureBack: {
    type:String,
    required: [true, "Id picture back is required"],
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Image',
  },
  selfie: {
    type:String,
    required: [true, "Selfie is required"],
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Image',
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Image',
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  serviceRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceRequest'
  }],
  role: {
    type: String,
    enum: ['driver',],
    default: 'driver',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Remove the unique constraint from here
  }
}, { timestamps: true });
// Middleware to create profile for a new driver 
driverSchema.pre('save', async function(next) {
  try {
    // Only create profile if it doesn't already exist
    if (!this.profile) {
      // Create a new profile
      const newProfile = new Profile({
        user: this._id,
        fullName: this.name,
        address: this.address,
        ciy:this.city,
        country: this.country,
        idPictureFront: this.idPictureFront,
        idPictureBack: this.idPictureBack,
        selfie: this.selfie,
        licenseNumber: this.licenseNumber,
        // vehicle: this.vehicle,
        
       // organizationName: this.organizationName,
       // contactInformation: this.contactInformation,
       // emergencyContact: this.emergencyContact,
        phoneNumber: this.phoneNumber
        // Add other profile fields here
      });
      // Save the profile
      await newProfile.save();
      // Set the profile reference in the user document
      this.profile = newProfile._id;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Driver", driverSchema);




