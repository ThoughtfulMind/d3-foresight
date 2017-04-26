/**
 * Time rectangle for navigation guidance
 */
export default class TimeRect {
  constructor (parent) {
    this.rect = parent.svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 0)
      .attr('height', parent.height)
      .attr('class', 'timerect')
  }

  plot (parent) {
    // Save local data
    this.xScale = parent.xScale
  }

  update (idx) {
    this.rect
      .transition()
      .duration(200)
      .attr('width', this.xScale(idx))
  }
}