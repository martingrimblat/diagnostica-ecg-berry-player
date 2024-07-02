import { DeviceReadError } from 'errors/DeviceReadError'
import {useState, useEffect, useRef} from 'react'
import events from '../events/EventHub'
import types from '../events/types/devices'

const typesMultiparametricMonitor = {
  ECG_WAVE: 'ECG_WAVE',
  ECG_PARAM: 'ECG_PARAM',
  NIBP: 'NIBP',
  SPO2_PARAM: 'SPO2_PARAM',
  TEMP: 'TEMP',
  SW_VER: 'SW_VER',
  HW_VER: 'HW_VER',
  SPO2_WAVE: 'SPO2_WAVE',
  RESP_WAVE: 'RESP_WAVE',
}

// Este hook se va a encargar de obtener valores del monitoreo cardiaco
// Este hook va a manejar suscripcion a eventos

function useEcgBerryDevice(
  setIsWithoutData,
  datasetRef,
  setOnData
) {
  const onValuesSubscription = useRef()
  const onErrorSubscription = useRef()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  function readValues() {
    onValuesSubscription.current = events.on(types.DEVICE_VALUES, (result) => {
      if (result && result.valuesBack) {
        for (let data of result.valuesBack){
          let {type, values} = data

          let uint8Values
          if (type != 'PACKET_TIMESTAMP') {
            uint8Values = new Uint8Array(values)
          } else {
            uint8Values = values
          }
          // console.log({type, uint8Values})
          acqDataHandlerPacket({type, uint8Values})
        }
      }
      // console.log('Dataset actual:', datasetRef.current)
    })

    onErrorSubscription.current = events.on(types.DEVICE_ERROR, (error) => {
      console.log('error', error)
      if (error.withoutData) {
        setIsWithoutData(true)
        setError(new DeviceReadError(error?.message))
      }
    })
  }

  const acqDataHandlerPacket = ({type, uint8Values}) => {
    let arrayValues = []
    switch (type) {
      case typesMultiparametricMonitor.ECG_WAVE:
        for (const value of uint8Values) {
          arrayValues.push(value)
        }
        if (!datasetRef?.current[type]) {
          datasetRef.current[type] = []
        }
        datasetRef.current[type].push(...arrayValues)
        setOnData(true)
        break
      case 'PACKET_TIMESTAMP':
        break
      default:
        break
    }
  }

  function startAcq() {
    try {
      events.emitOrThrow(types.START_DEVICE, {
        deviceName: 'electrocardiogram_berry',
      })
      setLoading(true)
    } catch (err) {
      setLoading(false)
      setError(err)
    }
  }

  function retry() {
    // console.log("retry")
    // datasetRef.current = {}
    setIsWithoutData(false)
    clearSubscriptions()
    startAcq()
    readValues()
  }

  function pauseAcq() {
    try {
      events.emitOrThrow(types.STOP_DEVICE, {
        deviceName: 'multiparametric_monitor', //TODO cambiar por ecg
      })
      clearSubscriptions()
      setLoading(true)
    } catch (err) {
      setLoading(false)
      setError(err)
    }
  }

  function clearSubscriptions() {
    events.emitOrThrow(types.STOP_DEVICE, {
      deviceName: 'multiparametric_monitor', //TODO cambiar por ecg
    })
    onValuesSubscription.current && onValuesSubscription.current.off()
    onErrorSubscription.current && onErrorSubscription.current.off()
  }

  useEffect(() => {
    return () => {
      clearSubscriptions()
    }
  }, [])

  useEffect(() => {
    events.emit('kiosk://capture-loading', {loading})
  }, [loading])

  useEffect(() => {
    if (error) {
      events.emit('kiosk://capture-error', {error})
    }
  }, [error])

  return {
    readValues,
    loading,
    error,
    startAcq,
    pauseAcq,
    retry,
  }
}

export default useEcgBerryDevice
