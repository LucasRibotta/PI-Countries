const axios = require('axios');
const { Country, Activity } = require('../db');
const { Op } = require('sequelize');
require('dotenv').config();
const {DB_URL} = process.env;


const getAllCountries = async (req, res) => {
    const { name } = req.query;
    const dBCountry = await Country.count();

    try {
       
        if (!dBCountry) {
            const countriesApiGet = await axios.get(DB_URL)
            const apiCountries =  countriesApiGet.data.map(pais => {
                return {
                     id: pais.cca3,
                     name: pais.name.common,
                     flags: pais.flags[1],
                     continents: pais.continents[0],
                     capital: pais.capital || "Sin Datos",
                     area: pais.area,
                     population: pais.population,
                     maps: pais.maps?.googleMaps || null,
                }
            })
            await Country.bulkCreate(apiCountries); 
        } else if (name) {
            const countryName = await Country.findAll({
                where: {
                     name:  { [Op.iLike]: `%${name}%` },
                    },
                    include:{
                     model: Activity,
                     attributes: ['names', 'season'],
                     through: {attributes: []}
                }
            })
            countryName ?
                res.status(200).json(countryName) :
                res.status(404).json(`El pais con el nombre:${name} no se encontro`);
        } else {
            const allCountrys = await Country.findAll({include: {
              model: Activity,
              attributes: ['names', 'season'],
              through: {attributes: []}
            }})
            res.status(200).json(allCountrys);
        };
           
    } catch (error) {
        return res.status(500).json(error)
    }  
}


const getCountriesId = async (req, res) => {
    const { id } = req.params;
    try {
      const country = await Country.findByPk(id.toUpperCase(), {
        include: {
          model: Activity,
          through: { attributes: [] },
        },
      });
  
      if (country) return res.status(200).json(country);
      return res.status(404).json({
        error: {
          message: "Country doesn't exist",
          values: { ...req.params },
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: {
          message: "Server error",
        },
      });
    }
  };


module.exports = {
    getAllCountries,
    getCountriesId
}