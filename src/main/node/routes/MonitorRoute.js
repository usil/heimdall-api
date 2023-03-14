@Route
function MonitorRoute(){

  @Autowire(name = "websiteService")
  this.websiteService;

  @Protected(permission="monitor:read")
  @Get(path = "/v1/monitor")
  this.findAllDataMonitors = async(req, res) => {
    return res.json(await this.websiteService.getResultsWeb(req.query.daysAgo));
  }  
  
  @Protected(permission="monitor-website:read")
  @Get(path = "/v1/monitor/website")
  this.findMonitorsByWebsiteAndStartDate = async(req, res) => {
    try{
      return res.json(await this.websiteService.getResultWeb(req.query.webBaseUrl, req.query.daysAgo));
    }catch(err){
      return res.status(500).json({code:500, message: err.toString()});
    }
  }
}

module.exports = MonitorRoute;