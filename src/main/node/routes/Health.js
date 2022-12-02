@Route
function Health(expressInstance){
  
  @Get(path = "/v1/health")
  this.simpleHealth = (req, res) => {
    return res.send({
      code:200000,
      message:"success"
    });
  }
}

module.exports = Health;