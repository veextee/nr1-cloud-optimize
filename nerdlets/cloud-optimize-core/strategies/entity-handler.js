// massage the nrdb data
export const processEntitySamples = e => {
  if (e.systemSample) {
    e.coreCount = e.systemSample['latest.coreCount'];
    e.memoryGB = e.systemSample['latest.memoryTotalBytes'] * 1e-9;

    e.systemSample = (((e || {}).systemSample || {}).results || {})[0] || null;

    e.networkSamples = ((e || {}).networkSample || {}).results || [];
    e.networkSample = {
      'max.receiveBytesPerSecond': 0,
      'max.transmitBytesPerSecond': 0
    };
    e.networkSamples.forEach(s => {
      e.networkSample['max.receiveBytesPerSecond'] +=
        s['max.receiveBytesPerSecond'];
      e.networkSample['max.transmitBytesPerSecond'] +=
        s['max.transmitBytesPerSecond'];
    });

    if (e.systemSample['provider.instanceLifecycle'] === 'spot') {
      e.isSpot = true;
    }

    if (e.systemSample['latest.awsRegion']) {
      e.cloud = 'amazon';
      e.cloudRegion = e.systemSample['latest.awsRegion'];
    } else if (e.systemSample['latest.regionName']) {
      e.cloud = 'azure';
      e.cloudRegion = e.systemSample['latest.regionName'];
    } else if (e.systemSample['latest.zone']) {
      e.cloud = 'gcp';
      e.cloudRegion = e.systemSample['latest.zone'];
    } else if (e.systemSample['latest.regionId']) {
      e.cloud = 'alibaba';
      e.cloudRegion = e.systemSample['latest.regionId'];
    }
  } else if (e.vsphereHostSample || e.vsphereVmSample) {
    e.vsphereHostSample =
      (((e || {}).vsphereHostSample || {}).results || {})[0] || null;

    if (!e.vsphereHostSample['latest.entityGuid']) {
      delete e.vsphereHostSample;
    }

    e.vsphereVmSample =
      (((e || {}).vsphereVmSample || {}).results || {})[0] || null;
    if (!e.vsphereVmSample['latest.entityGuid']) {
      delete e.vsphereVmSample;
    }

    if (e.vsphereHostSample) {
      e.coreCount = e.vsphereHostSample['latest.coreCount'];
      e.memoryGB = e.vsphereHostSample['latest.memoryTotalBytes'] * 1e-9;
    } else if (e.vsphereVmSample) {
      e.coreCount = e.vsphereVmSample['latest.coreCount'];
      e.memoryGB = e.vsphereVmSample['latest.memoryTotalBytes'] * 1e-9;
    }
  } else if (e.apmInfraData || e.apmDatabaseSlowQueryData) {
    e.apmInfraData =
      (((e || {}).apmDatabaseSlowQueryData || {}).results || {})[0] || null;

    e.apmDatabaseSlowQueryData =
      (((e || {}).apmDatabaseSlowQueryData || {}).results || {})[0] || null;
  }
};