@Route
function WebsiteRoute(){

  @Autowire(name = "websiteService")
  this.websiteService;
  
  @Protected(permission="website:read")
  @Get(path = "/v1/website")
  this.findAll = async(req, res) => {
    return res.json(await this.websiteService.getWebs());
  }
}

module.exports = WebsiteRoute;