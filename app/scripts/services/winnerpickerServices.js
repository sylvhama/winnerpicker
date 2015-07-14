(function() {
  'use strict';
  angular.module('winnerpickerApp').factory("winnerpickerServices", [
    function() {
      var fact;
      fact = {};
      fact.getId = function(id) {
        var index, part1, part2;
        index = id.indexOf('_');
        part1 = id.substr(0, index);
        part2 = id.substr(index + 1, id.length);
        return {
          "part1": part1,
          "part2": part2
        };
      };
      fact.HTMLTable = function(columns, tab) {
        var column, html, row, _i, _j, _len, _len1;
        html = '<table><tr>';
        for (_i = 0, _len = columns.length; _i < _len; _i++) {
          column = columns[_i];
          html = html + '<th>' + column + '</th>';
        }
        html = html + '</tr>';
        for (_j = 0, _len1 = tab.length; _j < _len1; _j++) {
          row = tab[_j];
          html = html + '<tr>';
          if (typeof row.id !== "undefined") {
            html = html + '<td>' + row.id + '</td>';
          }
          if (typeof row.name !== "undefined") {
            html = html + '<td>' + row.name + '</td>';
          }
          if (typeof row.link !== "undefined") {
            html = html + '<td>' + row.link + '</td>';
          }
          if (typeof row.message !== "undefined") {
            html = html + '<td>' + row.message + '</td>';
          }
          if (typeof row.comment !== "undefined") {
            html = html + '<td>' + row.comment + '</td>';
          }
          if (typeof row.like_count !== "undefined") {
            html = html + '<td>' + row.like_count + '</td>';
          }
          if (typeof row.created_time !== "undefined") {
            html = html + '<td>' + row.created_time + '</td>';
          }
          if (typeof row.photoSrc !== "undefined") {
            html = html + '<td>' + row.photoSrc + '</td>';
          }
          html = html + '</tr>';
        }
        html = html + '</table>';
        return html;
      };
      fact.download = function(columns, tab) {
        var base64, ctx, format, template, uri;
        uri = "data:application/vnd.ms-excel;base64,";
        template = "<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns=\"http://www.w3.org/TR/REC-html40\"><head><meta http-equiv=\"content-type\" content=\"text/plain; charset=UTF-8\"/><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>";
        base64 = function(s) {
          return window.btoa(unescape(encodeURIComponent(s)));
        };
        format = function(s, c) {
          return s.replace(/{(\w+)}/g, function(m, p) {
            return c[p];
          });
        };
        ctx = {
          worksheet: "Export",
          table: fact.HTMLTable(columns, tab)
        };
        return window.location.href = uri + base64(format(template, ctx));
      };
      return fact;
    }
  ]);

}).call(this);

/*
//@ sourceMappingURL=winnerpickerServices.js.map
*/