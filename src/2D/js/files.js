var http = function (option) {
// 过滤请求成功后的响应对象
function getBody (xhr) {
  var text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch (err) {
    return text
  }
}

var xhr = new XMLHttpRequest();
// 自定义 beforeSend 函数
if(option.beforeSend instanceof Function) {
  if (option.beforeSend(xhr) === false) {
    return false
  }
}

xhr.onreadystatechange = function () {
  if (xhr.status === 200) {
    if (xhr.readyState === 4) {
      // 成功回调
      option.onSuccess(getBody(xhr))
    }
  }
}

// 请求失败
xhr.onerror = function (err) {
  option.onError(err)
}

xhr.open(option.type, option.url, true)

// 当请求为上传文件时回调上传进度
if (xhr.upload) {
  xhr.upload.onprogress = function (event) {
    if (event.total > 0) {
      event.percent = event.loaded / event.total * 100;
    }
    // 监控上传进度回调
    if (option.onProgress instanceof Function) {
      option.onProgress(event)
    }
  }
}

// 自定义头部
const headers = option.headers || {}
for (var item in headers) {
  xhr.setRequestHeader(item, headers[item])
}

xhr.send(option.data)
}

document.getElementById('file_upload').onchange = function () {
var fileList = this.files, formData = new FormData();
Array.prototype.forEach.call(fileList, function (file) {
  formData.append(file.name, file)
})
// 当上传的数据为 file 类型时，请求的格式类型自动会变为 multipart/form-data, 如果头部格式有特定需求，在我的 http 函数中传入 headers<Object> 即可，大家可自己查看，我这里没有什么特殊处理所以就不传了
http({
  type: 'POST',
  url: '/upload',
  data: formData,
  onProgress: function (event) {
    console.log(event.percent)
    document.querySelector('.progress span').style.width = event.percent + '%';
  },
  onSuccess: function (data) {
    console.log('upload success')
    location.reload()
  },
  onError: function (err) {
    alert(err)
  }
})
}