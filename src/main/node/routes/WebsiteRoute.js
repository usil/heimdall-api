@Route
function WebsiteRoute(){

  @Autowire(name = "websiteService")
  this.websiteService;
  
  @Get(path = "/v1/website")
  this.findAll = async(req, res) => {
    return res.json(await this.websiteService.getWebs());
  }
}

module.exports = WebsiteRoute;