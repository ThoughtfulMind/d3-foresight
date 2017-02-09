// Utility functions for timechart family
// --------------------------------------

import tinycolor from 'tinycolor2'

/**
 * Return maximum value to be displayed (y axis) in the given subset
 */
export const getYMax = data => {
  // Max from actual data
  let maxValues = [Math.max(...data.actual.map(d => d.data))]

  // Max from observed data
  maxValues.push(Math.max(...data.observed.map(d => {
    return Math.max(...d.data.map(dl => dl.value))
  })))

  // Max from historical data
  data.history.forEach(h => {
    maxValues.push(Math.max(...h.actual.map(d => d.data)))
  })

  // Loop over all the models
  data.models.map(mdl => {
    maxValues.push(Math.max(...mdl.predictions.map(d => Math.max(...[
      Math.max(...d.oneWk.high),
      Math.max(...d.twoWk.high),
      Math.max(...d.threeWk.high),
      Math.max(...d.fourWk.high),
      Math.max(...d.peakPercent.high)
    ]))))
  })

  return 1.1 * Math.max(...maxValues)
}

/**
 * Return next four week numbers for given week
 */
export const getNextWeeks = (currentWeek, weeks) => {
  let current = weeks.indexOf(currentWeek % 100)
  let nextWeeks = []
  for (let i = 0; i < 4; i++) {
    current += 1
    if (current < weeks.length) nextWeeks.push(weeks[current])
  }
  return nextWeeks
}

/**
 * Template for main chart on hover tooltip
 */
export const chartTooltip = (object, idx, y) => {
  // Run queries on objects and return html
  let text = ''
  // Ask for observed value
  let observedValue = object.observed.query(idx)

  if (observedValue) {
    text += `<div class="observed">
               Observed
               <span class="bold">
                 ${observedValue.toFixed(2)}
               </span>
             </div>`
  }

  // Ask actual
  let actualValue = object.actual.query(idx)

  if (actualValue !== -1) {
    text += `<div class="actual">
               Actual
               <span class="bold">
                 ${actualValue.toFixed(2)}
               </span>
             </div>`
  }

  object.predictions.map(p => {
    let data = p.query(idx)
    if (data) {
      text += `<div class="prediction" style="background:${p.color}">
                 ${p.id}
                 <span class="bold">
                   ${data.toFixed(2)}
                 </span>
               </div>`
    }
  })

  return text
}

/**
 * Template for point predictions
 */
export const pointTooltip = (id, data, color) => {
  let text = `<div class="point head" style="background:${color}">${id}</div>`
  data.map(d => {
    text += `<div class="point">
               ${d.key}
               <span class="bold">${d.value.toFixed(2)}</span>
             </div>`
  })
  return text
}

/**
 * Return formatted tooltip info text for legend items
 */
export const legendTooltip = (meta) => {
  return `<div class="name">
            ${meta.name}
          </div>
          <div class="desc">
            ${meta.description}
          </div>`
}

/**
 * Return rgba for hex
 */
export const hexToRgba = (hex, alpha) => {
  let color = tinycolor(hex)
  color.setAlpha(alpha)
  return color.toRgbString()
}
