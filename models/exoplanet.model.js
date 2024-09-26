const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const exoplanetSchema = new Schema(
  {
    planetName: { type: String }, // Planet name
    planetImage: { type: String }, // Planet name
    hostName: { type: String }, // Host star name
    numberOfStars: { type: Number }, // Number of stars in the system
    discoveryMethod: { type: String }, // Discovery method
    discoveryYear: { type: Number }, // Year of discovery
    discoveryFacility: { type: String }, // Facility used for discovery
    solutionType: { type: String }, // Solar system type
    planetaryParameterReference: { type: String }, // Reference name for the planet
    orbitalPeriodDays: { type: String }, // Orbital period (days)
    planetMassOrMassSinIEarthMass: { type: String }, // Mass of the planet (Earth masses)
    stellarParameterReference: { type: String }, // Reference name for the star
    stellarEffectiveTemperatureK: { type: String }, // Effective temperature of the star (Kelvin)
    stellarSurfaceGravityLog10Cms2: { type: String }, // Surface gravity of the star (log10(cm/s²))
    systemParameterReference: { type: String }, // Reference name for the system
    raSexagesimal: { type: String }, // Right Ascension (RA) as a string
    raDeg: { type: String }, // Right Ascension (RA) in degrees
    decSexagesimal: { type: String }, // Declination as a string
    decDeg: { type: String }, // Declination in degrees
    distancePc: { type: String }, // Distance from Earth (parsecs)
    vJohnsonMagnitude: { type: String }, // Visual magnitude
    ks2MASSMagnitude: { type: String }, // K-band magnitude
    gaiaMagnitude: { type: String }, // Gaia magnitude
    isDeleted: { type: Boolean, default: false }, //
  },
  { timestamps: true }
);

const ExoplanetModel = mongoose.model("exoplanet", exoplanetSchema);
module.exports = ExoplanetModel;
