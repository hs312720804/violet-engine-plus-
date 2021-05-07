/* eslint-disable */
export function dataResourceGetList (params) {
  return this.fetch({
    url: 'sys/resource/data/index',
    params
  }).then(data => {
    const { total, list: rows } = data
    return {
      total,
      rows
    }
  })
}
