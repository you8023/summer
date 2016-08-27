'use strict';
function $ (obj) {
    return document.querySelector(obj);
}
function $$ (father, obj) {
    return father.querySelectorAll(obj);
}

// 菜单切换
// 
var menu = $('#menu'),
    isIndex = true,


    indexWeb = $('#index'),
    menuWeb = $('#menuweb'),

    banner = $('#header'),
    bannerA = $$(banner, 'div'),
    bannerP = $$(banner, 'p'),
    icon = $$(document, 'i'),
    all = $('#all');

menu.addEventListener('touchstart' || 'click', changeWeb);

function changeWeb () {
    if (isIndex) {
        // all.style.left = '-50%';
        indexWeb.className = 'hide';
        menuWeb.className -= ' hide';
        for (var i = 0; i < bannerA.length - 1; i++) {
            bannerA[i].className += ' hide';
        }
        bannerP[0].className -= ' hide';
        bannerP[1].className -= ' hide';
        icon[0].className += ' hide';
        icon[1].className = 'iconfont';
        isIndex = !isIndex;
        

    } else {
        // all.style.left = 0;
        indexWeb.className = '';
        menuWeb.className = 'hide';
        for (var i = 0; i < bannerA.length - 1; i++) {
            bannerA[i].className = 'other';
        }
        bannerP[0].className += ' hide';
        bannerP[1].className += ' hide';
        icon[1].className += ' hide';
        icon[0].className = 'iconfont';
        isIndex = !isIndex;
        
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
        if (xhr.status == 200) {  
        //判断http的交互是否成功，200表示成功
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
var ppt = $('#ppt'),
    button = $('#button'),
    timer = null,
    index = 0;
ajax({
    url: "/sliders",
    method: 'GET',
    success: function(res) {
        var data = JSON.parse(res);
        // 传入图像和对应的title
        for (var i = 0; i < data.length; i++) {
            ppt.innerHTML += '<a href="' + data[i].link + '"><div><img src="' + data[i].imgURL + '"><p>' + data[i].title + '</p></div></a>';
            
        }
        for (var i = 0; i < data.length - 1; i++) {
            button.innerHTML += '<div class="btn"></div>';
            var btnWidth = getClass(button, 'width');
            var intWidth = parseFloat(btnWidth) + 21;
            button.style.width = intWidth + 'px';
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




// 菜单栏
ajax({
    url: '/tags',
    method: 'GET',
    success: function(res) {
        var data = JSON.parse(res);
        var added = $$(document, '.choose'),
        addMore = $$(document, '.choose-more'),
    
        add = $('#add'),
        chooseBtn = $$(add, 'button'),
        changeDiv = $('#changeDiv');
        var indexChosen = added.length - 1;
        // 初始化已添加的
        for (var i = 0; i < data.added.length; i++) {
            var added = $$(document, '.choose');
            if (indexChosen == -1) {
                var changeDiv = document.getElementById('changeDiv');
                changeDiv.innerHTML += '<div class="choose"><button>' + data.added[i].name + '</button></div>';
                indexChosen ++;
            } else if (added[indexChosen] != undefined) {
                var addedBtn = $$(added[indexChosen], 'button');
                if (addedBtn.length == 4) {
                    // 判断该行div内有多少个button，若有四个，则另起一行
                    var changeDiv = $('#changeDiv');
                    changeDiv.innerHTML += '<hr><div class="choose"><button>' + data.added[i].name + '</button></div>';
                    indexChosen ++;
                } else {
                    // 否则直接在该div内加一个button
                    added[indexChosen].innerHTML += '<button>' + data.added[i].name + '</button>';
                }
            }   
        }
        // 初始化可添加的
        var indexChoose = addMore.length - 1;
        for (var i = 0; i < data.avaliable.length; i++) {
            var addMore = $$(document, '.choose-more');
            if (indexChoose == -1) {
                var add = document.getElementById('add');
                add.innerHTML += '<div class="choose-more"><button>' + data.avaliable[i].name + '</button></div>';
                indexChoose ++;
            } else if (addMore[indexChoose] != undefined) {
                var chooseBtn = addMore[indexChoose].querySelectorAll('button');
                if (chooseBtn.length == 4) {
                    // 判断该行div内有多少个button，若有四个，则另起一行
                    var add = document.getElementById('add');
                    add.innerHTML += '<div class="choose-more"><button>' + data.avaliable[i].name + '</button></div>';
                    indexChoose ++;
                } else {
                    // 否则直接在该div内加一个button
                    addMore[indexChoose].innerHTML += '<button>' + data.avaliable[i].name + '</button>';
                }
            }
        }

        // 添加栏目
        var added = $$(document, '.choose'),
            add = $('#add'),
            chooseBtn = $$(add, 'button'),
            changeDiv = $('#changeDiv');
            
        var indexChooseIt = added.length - 1;
        for (var i = 0; i < chooseBtn.length; i++) {
            chooseBtn[i].addEventListener('touchstart', function () {

                var added = $$(document, '.choose'),
                    changeDiv = $('#changeDiv'),
                    chosenBtn = $$(changeDiv, 'button');

                var addedBtn = $$(added[indexChooseIt], 'button');
                // 依次与已有栏目一一核对，若有重名的，则弹窗提醒
                for (var j = 0; j < chosenBtn.length; j++) {
                    if (chosenBtn[j].innerHTML == this.innerHTML) {
                        alert('你已选择该栏目');
                        return;
                    } 
                }
                if (addedBtn.length == 4) {
                    var changeDiv = $('#changeDiv');
                    changeDiv.innerHTML += '<hr><div class="choose"><button>' + this.innerHTML + '</button></div>';
                    indexChooseIt ++;
                } else {
                    added[indexChooseIt].innerHTML += '<button>' + this.innerHTML + '</button>';
                }
                
            });
        }
    },
    async : true
});

function newsSync () {
    // 新闻同步
    var news = $$(document, '.news-div'),
        image = $$(document, '.image'),
        content = $$(document, '.content'),
        contentA = $$(document, '.contentA'),
        title = $$(document, '.title'),
        decration = $$(document, '.decration'),
        number = $$(document, '.number'),
        sort = $$(document, '.sort'),
        focus = $('.bannerFocus');

    ajax({
        url: "/news?num=4",
        method: "GET",
        success: function(res) {
            var data = JSON.parse(res);
            // 初始化新闻图片
            for (var i = 0; i < data.length; i++) {
                image[i].innerHTML = '<img src="' + data[i].imgURL + '">';
                contentA[i].href = data[i].link;
                focus.innerHTML = data[0].title;
                // 字符过长解决方案
                function longToShort (obj, len) {
                    if (obj.innerHTML.replace(/[\u4e00-\u9fa5_a-z_A-Z_0-9]/g,"a").length > len) {
                        var str = obj.innerHTML;
                        var reg = /[\u4e00-\u9fa5_a-z_A-Z_0-9]/g;
                        var arr = str.match(reg).slice(0,len);
                        title = $$(document, '.title');
                        
                        obj.innerHTML = arr;
                        obj.innerHTML = obj.innerHTML.replace(/,/g, '') + '...';
                    }
                }
                longToShort(focus, 12);
                // 如果没有type图标，则该div不显示
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
                longToShort(title[i], 12);

                decration[i].innerHTML = data[i].description;
                longToShort(decration[i], 30)

                // 初始化跟帖数
                number[i].innerHTML = data[i].post + '跟帖';
                sort[i + 1].innerHTML = data[i].type;
                sort[i + 1].style.backgroundColor = data[i].typeColor;
            }
        },
        async : true
    });
}

newsSync();

indexWeb.addEventListener('touchstart', startFresh);
indexWeb.addEventListener('touchmove', fresh);
indexWeb.addEventListener('touchend', endFresh);
var isMove, y;
function startFresh (e) {
    isMove = true;
    e.preventDefault();  
    y = e.touches[0].pageY;
}
function fresh(e) {
    if (isMove) {
        e.preventDefault();  
        var n = e.touches[0].pageY - y;
        if (n > 100) {
            newsSync();
        }
    }
    
}
function endFresh (e) {
    isMove = false;
}