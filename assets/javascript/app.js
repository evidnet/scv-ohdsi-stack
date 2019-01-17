define(function() {
  var appConfig = {}

  appConfig.api = {
    name: 'Atlas WebAPI',
    url: '/WebAPI/'
  }

  appConfig.cacheSources = true
  appConfig.pollInterval = 60000
  appConfig.useBundled3dPartyLibs = false
  appConfig.cohortComparisonResultsEnabled = false
  appConfig.userAuthenticationEnabled = false
  appConfig.plpResultsEnabled = false
  appConfig.useExecutionEngine = false
  appConfig.viewProfileDates = false
  appConfig.enableCosts = false
  appConfig.supportUrl = 'https://github.com/ohdsi/atlas/issues'
  appConfig.supportMail = 'hazelee@evidnet.co.kr'
  appConfig.authProviders = []

  appConfig.xssOptions = {
    whiteList: {
      a: ['href', 'class', 'data-bind'],
      button: ['class', 'type'],
      span: ['class', 'data-bind'],
      i: ['class', 'id', 'aria-hidden'],
      div: ['class', 'style', 'id'],
      option: ['value'],
      input: ['type', 'class'],
      ui: ['class'],
      path: ['d', 'class'],
      br: ''
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script']
  }
  appConfig.cemOptions = {
    evidenceLinkoutSources: ['medline_winnenburg', 'splicer'],
    sourceRestEndpoints: {
      medline_winnenburg:
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id={@ids}&retmode=json&tool=ohdsi_atlas&email=admin@ohdsi.org'
    },
    externalLinks: {
      medline_winnenburg: 'https://www.ncbi.nlm.nih.gov/pubmed/{@id}',
      splicer: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid={@id}'
    }
  }

  appConfig.enableTermsAndConditions = true
  appConfig.webAPIRoot = appConfig.api.url

  return appConfig
})
