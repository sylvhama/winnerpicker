'use strict'

angular.module('winnerpickerApp')
.factory "winnerpickerServices", [ () ->

  fact = {}

  fact.getId = (id) ->
    index = id.indexOf('_')
    part1 = id.substr(0, index)
    part2 = id.substr(index+1, id.length)
    return {"part1": part1, "part2": part2}

  fact.HTMLTable = (columns, tab) ->
    html = '<table><tr>'
    for column in columns
      html = html + '<th>' + column + '</th>'
    html = html + '</tr>'
    for row in tab
      html = html + '<tr>'
      if typeof row.id != "undefined"
        html = html + '<td>' + row.id + '</td>'
      if typeof row.name != "undefined"
        html = html + '<td>' + row.name + '</td>'
      if typeof row.link != "undefined"
        html = html + '<td>' + row.link + '</td>'
      if typeof row.message != "undefined"
        html = html + '<td>' + row.message + '</td>'
      if typeof row.comment != "undefined"
        html = html + '<td>' + row.comment + '</td>'
      if typeof row.like_count != "undefined"
        html = html + '<td>' + row.like_count + '</td>'
      if typeof row.created_time != "undefined"
        html = html + '<td>' + row.created_time + '</td>'
      if typeof row.photoSrc != "undefined"
        html = html + '<td>' + row.photoSrc + '</td>'
      html = html + '</tr>'
    html = html + '</table>'
    return html

  fact.download = (columns, tab) ->
    uri = "data:application/vnd.ms-excel;base64,"
    template = "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns=\"http://www.w3.org/TR/REC-html40\"><head><meta http-equiv=\"content-type\" content=\"text/plain; charset=UTF-8\"/><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>"
    base64 = (s) ->
      window.btoa unescape(encodeURIComponent(s))

    format = (s, c) ->
      s.replace /{(\w+)}/g, (m, p) ->
        c[p]

    ctx =
      worksheet: "Export"
      table: fact.HTMLTable(columns, tab)
    window.location.href = uri + base64(format(template, ctx))

  return fact
]