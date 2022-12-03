@Route
function MonitorRoute(){

  @Autowire(name = "websiteService")
  this.websiteService;
  
  @Get(path = "/v1/monitor/website")
  this.findWebsiteDataMonitor = async(req, res) => {
    return res.json(await this.websiteService.getResultWeb(req.query.website, req.query.sinceDay));
  }
}

module.exports = MonitorRoute;