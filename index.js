(function () {
  if (!location.search) {
    location.search = "size=M&color=1&color=2&manufacturer=aaa&manufacturer=ddd";
  }

  function decode(str) {
    return str
        .replace(/[ +]/g, '%20')
        .replace(/(%[a-f0-9]{2})+/ig, function(match) {
            return decodeURIComponent(match);
        });
  }
  
  function encode(str) {
    var replace = {
        '!': '%21',
        "'": '%27',
        '(': '%28',
        ')': '%29',
        '~': '%7E',
        '%20': '+',
        '%00': '\x00'
    };
    return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, function(match) {
        return replace[match];
    });
  }
  
  function parseSearchParams(search) {
    if (!search) {
      return {};
    }
    return search.replace(/^\?/, "").split("&").reduce(function (acc, item) {
      var pair = item.split("=");
      var key = pair[0];
      var value = decode(pair[1]); 
      if (acc[key]) {
        acc[key].push(value)
      }  else {
        acc[key] = [value];
      }
    
      return acc;
    }, {})
  }
  
  var urlParams = parseSearchParams(location.search);
  
  function formDataToUrl(formData) {
    var url = location.origin + location.pathname;
  
    var searchArr = [];
  
    for (var pair of formData) {
      searchArr.push(pair[0] + "=" + encode(pair[1]));
    }
  
    var search = searchArr.join("&");
  
    return url + (search && "?" + search);
  }
  
  var size = urlParams.size && urlParams.size[0];
  var color = urlParams.color || [];
  var manufacturer = urlParams.manufacturer || [];
  var sales = urlParams.sales && urlParams.sales[0];
  
  if (size) {
    var id = "size-" + size.toUpperCase();
    document.getElementById(id).checked = true;
  }
  
  if (color) {
    color.forEach(function (item) {
      var id = "color-" + item;
      document.getElementById(id).checked = true;
    });
  }
  if (manufacturer) {
    manufacturer.forEach(function (item) {
      var id = "manufacturer-" + item;
      document.getElementById(id).selected = true;
    });
  }
  if (sales) {
    const id = "sales-" + sales;
    document.getElementById(id).checked = true;
  }
  
  
    var form = document.querySelector("form");
    form.addEventListener("input", function() { 
      console.log(formDataToUrl(new FormData(form)));
    });  
})();