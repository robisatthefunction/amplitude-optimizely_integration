function getCampaignInfo() {
  return window.optimizely.get('state').getDecisionObject({campaignId: campaignId });
}

function logEvent() {
  var campaignInfo = getCampaignInfo();

  if (campaignInfo) {
    var eventProperties = {
      '[Optimizely Campaign]': campaignInfo.campaign,
      '[Optimizely Experiment]': campaignInfo.experiment,
      '[Optimizely Variation]': campaignInfo.variation,
      '[Optimizely Holdback]': campaignInfo.holdback
    };
    amplitude.getInstance().logEvent(extension.event_name, eventProperties);
  }
}

function identifyCall() {
  var campaignInfo = getCampaignInfo();

  if (campaignInfo) {
    var identify = new amplitude.Identify().set(
      extension.property_prefix + ' ' + campaignInfo.experiment,
      campaignInfo.variation
    );
    amplitude.getInstance().identify(identify);
  }
}

var MAX_ATTEMPTS = 9;

function sendToAmplitude(call) {
  if (call >= MAX_ATTEMPTS) {
    return;
  }

  if (
    window.amplitude &&
    window.amplitude._instances &&
    window.amplitude._instances['$default_instance'] &&
    window.amplitude._instances['$default_instance'].options &&
    window.amplitude._instances['$default_instance'].options.apiKey
  ) {
    identifyCall();
    if (extension.sendevent === 'y') {
      logEvent();
    }
  } else {
    return setTimeout(function () {
      sendToAmplitude(call + 1);
    },
    1000);
  }
}

sendToAmplitude(0);

//what is the extension object?
//why do we need to do identify call and log event?
//what is sendToAmplitude doing?
