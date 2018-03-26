import * as d3 from 'd3'
import * as tt from '../../../utilities/tooltip'
import * as colors from '../../../utilities/colors'
import { selectUncle } from '../../../utilities/misc'
import SComponent from '../../s-component'

export default class PeakMarker extends SComponent {
  constructor (id, color) {
    super()

    this.selection
      .attr('class', 'peak-group')
      .attr('id', id + '-marker')

    let colorPoint = colors.hexToRgba(color, 0.8)
    let colorRange = colors.hexToRgba(color, 0.6)

    this.selection.append('line')
      .attr('class', 'range peak-range peak-range-x')
      .style('stroke', colorRange)

    this.selection.append('line')
      .attr('class', 'range peak-range peak-range-y')
      .style('stroke', colorRange)

    this.selection.append('line')
      .attr('class', 'stopper peak-stopper peak-low-x')
      .style('stroke', colorRange)

    this.selection.append('line')
      .attr('class', 'stopper peak-stopper peak-high-x')
      .style('stroke', colorRange)

    this.selection.append('line')
      .attr('class', 'stopper peak-stopper peak-low-y')
      .style('stroke', colorRange)

    this.selection.append('line')
      .attr('class', 'stopper peak-stopper peak-high-y')
      .style('stroke', colorRange)

    this.point = this.selection.append('circle')
      .attr('r', 5)
      .attr('class', 'peak-mark')
      .style('stroke', 'transparent')
      .style('fill', colorPoint)
  }

  move (cfg, peakTime, peakValue) {
    let colorHover = colors.hexToRgba(cfg.color, 0.3)
    let leftW = cfg.scales.xScale(peakTime.point)
    let leftP = cfg.scales.yScale(peakValue.point)

    this.point
      .transition()
      .duration(200)
      .attr('cx', leftW)
      .attr('cy', leftP)

    this.point
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .style('stroke', colorHover)
        cfg.tooltip.hidden = false
        cfg.tooltip.render(tt.parsePoint({
          title: cfg.id,
          values: [
            { key: 'Peak Percent', value: peakValue.point },
            { key: 'Peak Week', value: cfg.scales.ticks[peakTime.point] }
          ],
          color: cfg.color
        }))
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .style('stroke', 'transparent')
        cfg.tooltip.hidden = true
      })
      .on('mousemove', function () {
        tt.moveTooltip(cfg.tooltip, selectUncle(this, '.overlay'))
      })

    if (cfg.cid === -1) {
      ['.range', '.stopper'].forEach(cls => {
        this.selection.selectAll(cls)
          .attr('visibility', 'hidden')
      })
    } else {
      ['.range', '.stopper'].forEach(cls => {
        this.selection.selectAll(cls)
          .attr('visibility', null)
      })
      this.selection.select('.peak-range-x')
        .transition()
        .duration(200)
        .attr('x1', cfg.scales.xScale(peakTime.low[cfg.cid]))
        .attr('x2', cfg.scales.xScale(peakTime.high[cfg.cid]))
        .attr('y1', cfg.scales.yScale(peakValue.point))
        .attr('y2', cfg.scales.yScale(peakValue.point))

      this.selection.select('.peak-range-y')
        .transition()
        .duration(200)
        .attr('x1', cfg.scales.xScale(peakTime.point))
        .attr('x2', cfg.scales.xScale(peakTime.point))
        .attr('y1', cfg.scales.yScale(peakValue.low[cfg.cid]))
        .attr('y2', cfg.scales.yScale(peakValue.high[cfg.cid]))

      this.selection.select('.peak-low-x')
        .transition()
        .duration(200)
        .attr('x1', cfg.scales.xScale(peakTime.low[cfg.cid]))
        .attr('x2', cfg.scales.xScale(peakTime.low[cfg.cid]))
        .attr('y1', cfg.scales.yScale(peakValue.point) - 5)
        .attr('y2', cfg.scales.yScale(peakValue.point) + 5)

      this.selection.select('.peak-high-x')
        .transition()
        .duration(200)
        .attr('x1', cfg.scales.xScale(peakTime.high[cfg.cid]))
        .attr('x2', cfg.scales.xScale(peakTime.high[cfg.cid]))
        .attr('y1', cfg.scales.yScale(peakValue.point) - 5)
        .attr('y2', cfg.scales.yScale(peakValue.point) + 5)

      leftW = cfg.scales.xScale(peakTime.point)
      this.selection.select('.peak-low-y')
        .transition()
        .duration(200)
        .attr('x1', (!leftW ? 0 : leftW) - 5)
        .attr('x2', (!leftW ? 0 : leftW) + 5)
        .attr('y1', cfg.scales.yScale(peakValue.low[cfg.cid]))
        .attr('y2', cfg.scales.yScale(peakValue.low[cfg.cid]))

      this.selection.select('.peak-high-y')
        .transition()
        .duration(200)
        .attr('x1', (!leftW ? 0 : leftW) - 5)
        .attr('x2', (!leftW ? 0 : leftW) + 5)
        .attr('y1', cfg.scales.yScale(peakValue.high[cfg.cid]))
        .attr('y2', cfg.scales.yScale(peakValue.high[cfg.cid]))
    }
  }
}
