let diseases = []
let filteredDiseases = []
let chosenDisease = "肠癌病"
let importedFile = ''

fs.readFile(`${__dirname}/../b_coded.csv`, (err, contents) => {
  var str = iconv.decode(contents, 'gb18030')
  csv.parse(str, (err, data) => {
    data.forEach(d => {
      diseases.push(d[0]);
    })
    diseases.splice(0, 1);
    filteredDiseases = diseases;
  })
})

$('#run').click(() => {
  if (importedFile === '') {
    alert('请先导入 .csv 文件')
    return
  }

  let index = 0;
  for (var i = 0; i <diseases.length; i++) {
    if (diseases[i] === chosenDisease) {
      index = i;
      break;
    }
  }

  fs.writeFileSync('./params.txt', importedFile + '\n' + index);

  $('#run').prop('disabled', true);
  $('.dropdown-input').prop('disabled', true);
  $('#notification').html('程序需要大概十秒钟的时间启动，请耐心等待');
  
  var batFile = require.resolve('../run.bat');
  var bat = spawn(batFile)

  bat.stdout.on('data', (data) => {
    console.log(data.toString('utf-8'));
  });

  bat.stderr.on('data', (data) => {
    console.log(data.toString());
  });

  bat.on('exit', (code) => {
    console.log(`Child exited with code ${code}`);
    $('#run').prop('disabled', false);
    $('.dropdown-input').prop('disabled', false);
    $('#notification').html('');
  });
})

function create(index) {
  var elem = $(`<button class='dropdown-item' type='button'>${filteredDiseases[index]}</button>`)
  elem.click(() => {
    $('.dropdown-input').val(filteredDiseases[index])
    chosenDisease = filteredDiseases[index];
    $('.scrollable-menu').empty()
  })
  return elem
}

$(document).click(() => {
  $('.scrollable-menu').empty();
})

function showMenu() {
  $('.scrollable-menu').empty();
  $('.scrollable-menu').css('width', $('.dropdown-input').width() + 4)
  var elems = []
  for (var i = 0; i < filteredDiseases.length; i++) {
    elems.push(create(i))
  }
  $('.scrollable-menu').append(elems);
}

$('.dropdown-input').on('keyup', () => {
  let currentVal = $('.dropdown-input').val();
  if (currentVal === '') {
    filteredDiseases = diseases;
  } else {
    filteredDiseases = diseases.filter(d => d.startsWith(currentVal));
  }
  showMenu();
})

$('.dropdown-input').click(e => {
  e.stopPropagation();
  showMenu();
})

function signout() {
  session.defaultSession.clearStorageData({
    origin: "http://localhost",
    storage: ['cookies']
  }, function (error) {
    if(error) console.error(error);
  })
  return true;
}

function username() {
  document.getElementById("myname").innerHTML = remote.getGlobal('sesObject').user;
}

$('#choose').click(e => {
  dialog.showOpenDialog(['openFile'], paths => {
    if (!paths) {
      return;
    }
    var file = paths[0];
    if (!file.endsWith('.csv')) {
      alert('文件格式错误，请导入 .csv 文件');
    }
    importedFile = file;
    $("#holdtext").html("已导入 " + file);
  })
})

$("html").on("dragover", function(event) {
  event.preventDefault();
});

$("html").on("dragleave", function(event) {
  event.preventDefault();  
});

$("html").on("drop", function(event) {
  event.preventDefault();  
});

$('#choose').on("drop", e => {
  e.preventDefault();
  var file = e.originalEvent.dataTransfer.files[0].path;
  if (!file.endsWith('.csv')) {
    alert('文件格式错误，请导入 .csv 文件');
  }
  // ipcRenderer.send('import-file', file);
  importedFile = file;
  $("#holdtext").html("已导入 " + file);
})
