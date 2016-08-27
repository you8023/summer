'use strict';


// 菜单切换
// 
var menu = document.getElementById('menu'),
    isIndex = true,


    indexWeb = document.getElementById('index'),
    menuWeb = document.getElementById('menuweb'),

    banner = document.querySelector('#header'),
    bannerA = banner.querySelectorAll('div'),
    bannerP = banner.querySelectorAll('p');

menu.addEventListener('touchstart' || 'click', changeWeb);

function changeWeb () {
    console.log('in');
    if (isIndex) {
        indexWeb.className = 'hide';
        menuWeb.className -= ' hide';
        for (var i = 0; i < bannerA.length - 1; i++) {
            bannerA[i].className += ' hide';
        }
        bannerP[0].className -= ' hide';
        bannerP[1].className -= ' hide';
        isIndex = !isIndex;
    } else {
        indexWeb.className = '';
        menuWeb.className = 'hide';
        for (var i = 0; i < bannerA.length - 1; i++) {
            bannerA[i].className = 'other';
        }
        bannerP[0].className += ' hide';
        bannerP[1].className += ' hide';
        isIndex = !isIndex;
    }
}

// 添加类目
var added = document.querySelectorAll('.choose'),
    add = document.querySelector('#add'),
    chooseBtn = add.querySelectorAll('button'),
    changeDiv = document.getElementById('changeDiv');
for (var i = 0; i < chooseBtn.length; i++) {
    chooseBtn[i].addEventListener('click' || 'touchstart', adding(chooseBtn[i]));
}

function adding (obj) {
    var indexChoose = added.length - 1;
    console.log('indexchoose' + indexChoose);
    var addedBtn = added[indexChoose].querySelectorAll('button');
    if (addedBtn.length == 4) {
        changeDiv.innerHTML += '<hr><div class="choose"><button>' + obj.innerHTML + '</button></div>';
    } else {
        added[indexChoose].innerHTML += '<button>' + obj.innerHTML + '</button>';
    }
}

function createXHR() {
  if (window.XMLHttpRequest) {  //IE7+、Firefox、Opera、Chrome 和Safari
     return new XMLHttpRequest();
  } else if (window.ActiveXObject) {   //IE6 及以下
    var versions = ['MSXML2.XMLHttp','Microsoft.XMLHTTP'];
    for (var i = 0,len = versions.length; i<len; i++) {
      try {
        return new ActiveXObject(version[i]);
        break;
      } catch (e) {
        //跳过
      } 
    }
  } else {
    throw new Error('浏览器不支持XHR对象！');
  }
}


//封装ajax，参数为一个对象
function ajax(obj) {
    var xhr = createXHR();    //创建XHR对象
    //通过使用JS随机字符串解决IE浏览器第二次默认获取缓存的问题
    obj.url = obj.url;
    obj.data = params(obj.data);  //通过params()将名值对转换成字符串
    //若是GET请求，则将数据加到url后面
    if (obj.method === 'get') {
        obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data; 
    }
    if (obj.async === true) {   //true表示异步，false表示同步
    //使用异步调用的时候，需要触发readystatechange 事件
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {   //判断对象的状态是否交互完成
                callback();      //回调
            }
        };
    }
    //在使用XHR对象时，必须先调用open()方法，
    //它接受三个参数：请求类型(get、post)、请求的URL和表示是否异步。
    xhr.open(obj.method, obj.url, obj.async);
    if (obj.method === 'post') {
        //post方式需要自己设置http的请求头，来模仿表单提交。
        //放在open方法之后，send方法之前。
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(obj.data);     //post方式将数据放在send()方法里
    } else {
        xhr.send(null);     //get方式则填null
    }
    if (obj.async === false) {  //同步
        callback();
    }
    function callback() {
        if (xhr.status == 200) {  //判断http的交互是否成功，200表示成功
            obj.success(xhr.responseText);            //回调传递参数
        } else {
            alert('获取数据错误！错误代号：' + xhr.status + '，错误信息：' + xhr.statusText);
        }   
    }
}
//名值对转换为字符串
function params(data) {
    var arr = [];
    for (var i in data) {
    //特殊字符传参产生的问题可以使用encodeURIComponent()进行编码处理
      arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
    }
    return arr.join('&');
}

// 轮播
// 
var ppt = document.querySelector('#ppt'),
    button = document.querySelector('#button'),
    timer = null,
    index = 0;
ajax({
    url: "/sliders",
    method: 'GET',
    success: function(res) {
        // console.log(res);
        var data = JSON.parse(res);
        console.log(res);

        for (var i = 0; i < data.length; i++) {
            ppt.innerHTML += '<a href="' + data[i].link + '"><div><img src="' + data[i].imgURL + '"><p>' + data[i].title + '</p></div></a>';
            
        }
        for (var i = 0; i < data.length - 1; i++) {
            button.innerHTML += '<div class="btn"></div>';
            var btnWidth = getClass(button, 'width');
            console.log(parseInt(btnWidth));
            button.style.width = (parseInt(btnWidth) / 64) + (20 / 64) + 'rem';
            console.log(button.style.width);
            
        }

        //获取当前位置
        function getClass (obj, name) {
            if(obj.currentStyle) {
                return obj.currentStyle[name];
            } else {
                return getComputedStyle(obj, false)[name];
            }
        }

        var  btn = button.querySelectorAll('div'),
        img = ppt.querySelectorAll('div'),
        len = img.length;
        
        [].forEach.call(img, function (item) {
            item.style.width = (100 / len) + '%';
        });
        ppt.style.left = '0%';
        ppt.style.width = (100 * len) + '%';


        //自动播放函数autoPlay
        function autoPlay () {
            setInterval(function() {
                show(index);
            },2500);
        }
        autoPlay();//应用

        //图片切换
        function show (a) {
            index = a;

            // 轮播
            var left = ppt.style.left;
            if (index < len - 1) {
                // 切换到下一张图片
                ppt.style.left = (parseInt(left) - 100) + '%';
                index ++;
              }
              else if (index == len - 1) {
                ppt.style.left = '0%';
                index = 0;
              }
              for (var i = 0; i < btn.length; i++)
                    btn[i].className = 'btn';
                btn[index].className = 'current';
        }

    },
    async : true
});







// 新闻同步
var news = document.querySelectorAll('.news-div'),
    image = document.querySelectorAll('.image'),
    content = document.querySelectorAll('.content'),
    contentA = document.querySelectorAll('.contentA'),
    title = document.querySelectorAll('.title'),
    decration = document.querySelectorAll('.decration'),
    number = document.querySelectorAll('.number'),
    sort = document.querySelectorAll('.sort'),
    focus = document.querySelector('.bannerFocus');


ajax({
    url: "/news?num=4",
    method: "GET",
    success: function(res) {
        // console.log(res);
        var data = JSON.parse(res);
        console.log(res);
        for (var i = 0; i < data.length; i++) {
            image[i].innerHTML = '<img src="' + data[i].imgURL + '">';
            contentA[i].href = data[i].link;
            focus.innerHTML = data[0].title;
            if (data[0].type == null) {
                sort[0].style.display = 'none';
            } else {
                sort[0].innerHTML = data[0].type;
                sort[0].style.backgroundColor = data[0].typeColor;
            }
            
            if (data[i].type == null) {
                sort[i + 1].style.display = 'none';
            }
            

            title[i].innerHTML = data[i].title;
            decration[i].innerHTML = data[i].description;
            number[i].innerHTML = data[i].post + '跟帖';
            sort[i + 1].innerHTML = data[i].type;
            sort[i + 1].style.backgroundColor = data[i].typeColor;
        }
    },
    async : true
})


