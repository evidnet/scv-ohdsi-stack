define([], function () {
  var config = {}

  config.api = {
    name: 'Atlas WebAPI',
    url: '/WebAPI/'
  }

  config.cacheSources = true
  config.pollInterval = 60000
  config.useBundled3dPartyLibs = false
  config.cohortComparisonResultsEnabled = false
  config.userAuthenticationEnabled = false
  config.plpResultsEnabled = false
  config.useExecutionEngine = false
  config.viewProfileDates = false
  config.enableCosts = false

  config.supportUrl = 'https://github.com/ohdsi/atlas/issues'
  config.supportMail = 'hazelee@evidnet.co.kr'
  config.authProviders = []

  config.xssOptions = {
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

  config.cemOptions = {
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

  config.webAPIRoot = config.api.url
  return config
})
