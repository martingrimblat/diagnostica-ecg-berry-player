  export const stages = {
    INITIAL: 'INITIAL',
    PAUSED: 'PAUSED',
    RECORDING: 'RECORDING',
    PROCESSING: 'PROCESSING',
    FINISH: 'FINISH',
    UPLOADING: 'UPLOADING',
  }
  
  export const typesGrid = {
    ECGWave: 'ECG',
    HeartRate: 'HeartRate',
    SPO2Wave: 'SPO2Wave',
    SPO2Saturation: 'SPO2Saturation',
    RespirationWave: 'RespirationWave',
    RespirationRate: 'RespirationRate',
    NIBP: 'NIBP',
    Temperature: 'Temperature',
  }
  
  export const typesLimitsMultiparametricMonitor = {
    ECGMAX: 'ECGMAX',
    ECGMIN: 'ECGMIN',
    NIBPMAXSYS: 'NIBPMAXSYS',
    NIBPMINSYS: 'NIBPMINSYS',
    NIBPMAXDIA: 'NIBPMAXDIA',
    NIBPMINDIA: 'NIBPMINDIA',
    NIBPTIME: 'NIBPTIME',
    SPO2MAX: 'SPO2MAX',
    SPO2MIN: 'SPO2MIN',
    TEMPMAX: 'TEMPMAX',
    TEMPMIN: 'TEMPMIN',
    RESPMAX: 'RESPMAX',
    RESPMIN: 'RESPMIN',
  }
  
  export const typesMultiparametricMonitor = {
    ECG: 'ECG',
    NIBP: 'NIBP',
    SPO2: 'SPO2',
    TEMP: 'TEMP',
    RESP: 'RESP',
  }

  export const mmScales = [
    {
      name: "6.25mm/sec",
      factor: 6.25/1000
    },
    {
      name: "12.5mm/sec",
      factor: 12.5/1000
    },
    {
      name: "25mm/sec",
      factor: 25/1000
    },
    {
      name: "50mm/sec",
      factor: 50/1000
    },
    {
      name: "100mm/sec",
      factor: 100/1000
    }
  ]

  export const mvScales = [
    {
      name: "2.5mm/mv",
      factor: 2.5
    },
    {
      name: "5mm/mv",
      factor: 5
    },
    {
      name: "10mm/mv",
      factor: 10
    },
    {
      name: "20mm/mv",
      factor: 20
    },
    {
      name: "40mm/mv",
      factor: 40
    }
  ]