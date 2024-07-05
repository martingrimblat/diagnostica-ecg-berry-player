export const formatDate = (date) => {
  const dd = date.getDate().toString().padStart(2, '0')
  const mm = (date.getMonth() + 1).toString().padStart(2, '0')
  const yy = date.getFullYear().toString().substr(2, 2)

  return `${dd}/${mm}/${yy}`
}

export const formatTime = (date) => {
  const hh = date.getHours().toString().padStart(2, '0')
  const mm = date.getMinutes().toString().padStart(2, '0')

  return `${hh}:${mm}`
}

//Only for dd/mm/yyyy
export const fromDateString = (dateStr) => {
  if (typeof dateStr === Date) {
    return dateStr
  }
  if (!dateStr || dateStr.trim().length === 0) {
    return null
  }
  const [dd, mm, yyyy] = dateStr.split('/')

  return new Date(yyyy, mm - 1, dd)
}

export const formatDateTime = (date) => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return `${formatDate(date)} - ${date.toLocaleTimeString().split(':').slice(0, 2).join('.')} h`
}

export function msToMMSS(ms) {
  const seconds = Math.round(ms / 1000)
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${mm}:${ss}`
}

export function sToMMSS(seconds) {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${mm}:${ss}`
}

export function calcularEdad(fecha) {
  var hoy = new Date()
  var cumpleanos = new Date(fecha)
  var edad = hoy.getFullYear() - cumpleanos.getFullYear()
  var m = hoy.getMonth() - cumpleanos.getMonth()

  if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
    edad--
  }

  return edad
}

export const getPixelsFromViewerToPlayer = (leftpxviewer, rightpxviewer, widthViewer = 204.4, widthPlayer = 80) => {
  let leftPixelsPlayer = Math.round((leftpxviewer * widthPlayer) / widthViewer)
  let rightPixelsPlayer = leftPixelsPlayer + 80

  return {
    leftPixelsPlayer,
    rightPixelsPlayer,
  }
}
export const getRightPixelsFromViewerToPlayer = (rightpxviewer, widthViewer = 204.4, widthPlayer = 80) => {
  let rightPixelsPlayer = Math.round((rightpxviewer * widthPlayer) / widthViewer)

  return {
    rightPixelsPlayer,
  }
}

export const getSecondsFromPixels = (leftpx, widthpx = 255, totalSeconds = 5.6, isPinReview = false, positionrightLiveToReviewRef) => {
  let leftSecondsTotal = Math.round((leftpx * totalSeconds) / widthpx)

  let leftSeconds = sToMMSS(leftSecondsTotal)

  let rightpxFromleft

  if (isPinReview) {
    rightpxFromleft = leftpx + 580
  } else {
    rightpxFromleft = leftpx + 255
  }

  // ver si rightPx es mayor al ultimo margen derecho
  if (positionrightLiveToReviewRef && positionrightLiveToReviewRef.current > 0 && rightpxFromleft > positionrightLiveToReviewRef.current) {
    rightpxFromleft = positionrightLiveToReviewRef.current
  }

  let rightSecondsTotal = Math.round((rightpxFromleft * totalSeconds) / widthpx)
  let rightSeconds = sToMMSS(rightSecondsTotal)

  return {
    leftSeconds,
    rightSeconds,
  }
}
