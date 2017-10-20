window.addEventListener('DOMContentLoaded', function() {
    window.onerror = function (msg, url, line) {
 alert(msg + "\n" + url + "\n" + "\n" + line);
 return true;
};
    var currentCat=null;
    addEvents();
    SearchData(false,true);
    var catForm=document.getElementById('catSearch');
    var e=new Event('submit');
    catForm.dispatchEvent(e);

    function clear(id) {
        var element = document.getElementById(id);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    async function renderCat(mass) {
        var flag=false;
        var promise=new Promise((resolve, reject)=>{
            resolve();
        })
            .then(()=>{
                clear('categor');
            })
            .then(()=>{
                var div = document.getElementById('categor');
                if(mass[0]=='Нет таких категорий'){
                    var div_2=document.createElement('div');
                    div_2.textContent='Нет таких категорий';
                    div.appendChild(div_2);
                }
                else{
                    mass.forEach(function (item) {
                        var div_2=document.createElement('div');
                        div_2.classList.add('categor-item');
                        var a = document.createElement('a');
                        a.setAttribute('data-info', item);
                        a.setAttribute('href','#');
                        a.textContent = item;
                        if(currentCat!=null&&item==currentCat.getAttribute('data-info')){
                            div_2.classList.add('categor-item-active');
                            flag=true;
                        }

                        div_2.appendChild(a);
                        div.appendChild(div_2);
                    });

                    if(flag==false&&currentCat!=null){
                        var div_2=document.createElement('div');
                        div_2.classList.add('categor-item','categor-item-active');
                        div_2.appendChild(currentCat);
                        div.insertBefore(div_2, div.firstElementChild);
                    }
                }

            });




    }

    async function renderData(mass,f) {

        var ul=document.getElementById('PR');
        ul.classList.remove('awaitSearch');
        var ul=document.getElementById('PR');
        var products=mass.Products;
        var login=mass.login;
        var pages=mass.PageCount;
        var promise=new Promise((resolve, reject)=>{
            resolve();
        })
            .then(()=>{
                clear('PR');
            })
            .then(()=>{
                if(products==undefined)
                {
                    var li=document.createElement('li');
                    li.textContent='По вашему запросу ничего не найдено';
                    li.style.textAlign = "center";
                    ul.appendChild(li);
                    try {
                        document.getElementById('light-pagination').firstElementChild.remove();
                    }
                    catch (e){

                    }
                    return ;

                }


                products.forEach((item)=>{
                    var li=createElements(item, login);
                    ul.appendChild(li);
                });

                if(!f){//Запрос не по номеру страницы
                    if(pages>1){
                        $('#light-pagination').pagination({
                            items: pages,
                            cssStyle: 'light-theme',
                            prevText: 'Пред',
                            nextText: 'След',
                        });
                    }
                    else{
                        try{
                            document.getElementById('light-pagination').firstElementChild.remove();
                        }
                        catch(e){
                            console.log('Ошибка: ',e);
                        }

                    }
                }

            });




    }

    function SearchCat(form) {
        form.onsubmit = function(event) {
            event.preventDefault();
            var a=new FormData(this);
            fetch('/searchCat', {
                method: "POST",
                credentials: "include", // "omit" by default, for cookies to work
                body: new FormData(this)
            })
                .then(response => response.json())
                .then(response => {
                    if (response.error) {
                        alert(response.error.message);
                    } else if (response!='') {
                        renderCat(response)
                    }
                })
                .catch(function(err) {
                    alert("Error: " + err.message);
                });
        }


    }

    function SearchData(f,isMain) {
        var ul=document.getElementById('PR');
        ul.classList.add('awaitSearch');
        var li=document.createElement('li');
        li.textContent='Подождите, идет загрузка...';
        li.style.textAlign = "center";
        ul.appendChild(li);

        var textS=document.getElementById('dataSearch').searchD.value;
        var PageS;
        var categor;
        if(currentCat==null)
            categor=null;
        else
            categor=currentCat.getAttribute('data-info');
        if(document.getElementById('light-pagination').firstChild!=undefined)
            PageS=$('#light-pagination').pagination('getCurrentPage');
        else
            PageS=1;
        if(f==undefined)
            f=false;

            var req={
                text:textS,
                page:PageS,
                cat:categor,
                flag:isMain,
                isPageS:f
            };

            fetch('/searchData', {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                credentials: "include", // "omit" by default, for cookies to work
                body: JSON.stringify(req)
            })
                .then(response => response.json())
                .then(response => {
                    if (response.error) {
                        alert(response.error.message);
                    } else if (response!='') {
                        renderData(response,f)
                    }
                })
                .catch(function(err) {
                    alert("Error: " + err.message);
                });



    }

    function addEvents() {
        //for categories
        var catForm=document.getElementById('catSearch');
        SearchCat(catForm);
        catForm.search.addEventListener('keyup',function () {
            var event = new Event("submit");
            catForm.dispatchEvent(event);
        });

        //for data
        var dataForm=document.getElementById('dataSearch');
        dataForm.searchD.addEventListener('keyup',function () {
            SearchData(false,true);
        });

        var pagination=document.getElementById('light-pagination');
        pagination.addEventListener('click',SearchDataPage);

        var cat=document.getElementById('categor');
        cat.addEventListener('click', searchDatabyCat);

        var PR=document.getElementById('PR');
        PR.addEventListener('click',openNewWindow);

        var topMenu=document.getElementsByClassName('topMenu')[0];
        topMenu.addEventListener('click', topMenuFetch);
    }

    /*Pagination*/

    function searchDatabyCat(e){
        if(e.target.nodeName!='A')
            return
       var catNode=e.target;
       currentCat=catNode.cloneNode(true);
       changeActiveCat(e.target.parentNode);
       SearchData(false,true);

    }

    function changeActiveCat(parrent) {
        var cat=document.getElementById('categor');
        var childs=cat.childNodes;
        childs.forEach((item)=>{
            if(item.classList.contains('categor-item-active')){
                item.classList.remove('categor-item-active');
            }
        });

        parrent.classList.add('categor-item-active');
    }

    function SearchDataPage(e) {
        if(e.target.nodeName=='A')
            SearchData(true,false);
    }

    function createElements(item, login) {
        var li=document.createElement('li') //0
        li.classList.add('product-wrapper');

        var a=document.createElement('a');//1
        a.classList.add('product');
        a.setAttribute('href','#');

        var divPrM=document.createElement('div');//2
        divPrM.classList.add('product-main');

        var divPrP=document.createElement('div');
        divPrP.classList.add('product-photo');//3

        var img=document.createElement('img');//4
        img.setAttribute('src',item.icon);

        var divPrPr=document.createElement('div');//4
        divPrPr.classList.add('product-preview');

        var span=document.createElement('span');//5
        span.classList.add('button');
        span.classList.add('to-cart');
        span.setAttribute('data-info', item._id);
        span.textContent="В корзину";

        var divPrT=document.createElement('div');//3
        divPrT.classList.add('product-text');

        var divPrN=document.createElement('div');//4
        divPrN.classList.add('product-name');

        var amount=document.createElement('small');
        amount.innerText=`На складе: ${item.amount}`;


        if(item.info!='null')
        {
            var productNAmeA=document.createElement('a');
            productNAmeA.setAttribute('href',item.info);
            productNAmeA.textContent=item.name;
            divPrN.appendChild(productNAmeA);
        }
        else{
            divPrN.textContent=item.name;
        }


        var divPrDetailsWrap=document.createElement('div');//2
        divPrDetailsWrap.classList.add('product-details-wrap');

        var divPrDetails=document.createElement('div');//3
        divPrDetails.classList.add('product-details');

        var divPrAvail=document.createElement('div');//4
        divPrAvail.classList.add('product-availability');

        var spanIcon=document.createElement('span');//5
        spanIcon.classList.add('icon');
        spanIcon.classList.add('icon-check');
        spanIcon.textContent=item.status;

        var imgIcon=document.createElement('img');
        switch(item.status){
            case 'Акция!': imgIcon.setAttribute('src','images/onSale.png');
                break;
            case 'В наличие': imgIcon.setAttribute('src','images/inOrder.png');
                break;
            case 'Ожидается': imgIcon.setAttribute('src','images/comingSoon.png');
                break
            case 'Новинка':imgIcon.setAttribute('src','images/New.png');
                break;
        }
        imgIcon.classList.add('iconAvail');

        var spanPrPrice=document.createElement('span');//4
        spanPrPrice.classList.add('product-price');

        if(login){
            var small=document.createElement('small');//5
            if(item.status!='Ожидается')
                small.textContent=`${item.price} руб /${item.specialPrice1} руб /${item.specialPrice2} руб /${item.specialPrice3} руб`;
            else
                small.innerHTML="<br> <br>";
            spanPrPrice.appendChild(small);
        }
        else{
            var b=document.createElement('b');//5
            b.textContent=item.price;

            var small=document.createElement('small');//5
            small.textContent='руб';
            spanPrPrice.appendChild(b);
            spanPrPrice.appendChild(small);
        }
       /* var divPrButWrap=document.createElement('div');//2
        divPrButWrap.classList.add('product-buttons-wrap');

        var divButtons=document.createElement('div');//3
        divButtons.classList.add('buttons');

        var spanToCart=document.createElement('span');//3
        spanToCart.classList.add('button');
        spanToCart.classList.add('to-cart');

        var spanIconTocart=document.createElement('span');//4
        spanIconTocart.classList.add('icon');
        spanIconTocart.classList.add('icon-cart');
        spanIconTocart.textContent='В корзину';*/

        /*appending*/
        li.appendChild(a);
            a.appendChild(divPrM);
                divPrM.appendChild(divPrP);
                    divPrP.appendChild(img);
                    divPrP.appendChild(divPrPr);
                        divPrPr.appendChild(span);
                divPrM.appendChild(divPrT);
                    divPrT.appendChild(divPrN);
                    divPrT.appendChild(amount);

            a.appendChild(divPrDetailsWrap);
                divPrDetailsWrap.appendChild(divPrDetails);
                    divPrDetails.appendChild(divPrAvail);
                        divPrAvail.appendChild(imgIcon);
                        divPrAvail.appendChild(spanIcon);
                    divPrDetails.appendChild(spanPrPrice);


            /*a.appendChild(divPrButWrap);
                divPrButWrap.appendChild(divButtons);
                    divButtons.appendChild(spanToCart);
                        spanToCart.appendChild(spanIconTocart);*/

        return li;
    }

    function openNewWindow(e) {
        var reg=new RegExp('^http');
        if(e.target.nodeName=='A'&&e.target.href.match(reg))
        {
            e.preventDefault();
            window.open(e.target.href, '_blank');
        }

    }

    function topMenuFetch(e) {
        e.preventDefault();
        var reg=new RegExp('main');
        if(e.target.nodeName=='A'&&e.target.href.match(reg))
        {
            location.reload();
            return;
        }
        if(e.target.id=='mobMenu'){//показать категории
            var cat=document.getElementsByClassName('categor-wrapper-fix')[0];
            var ul=document.getElementById('PR');
            var pg=document.getElementById('light-pagination');
            if(cat.style.display=="none"){
                cat.style.display="block";
                ul.style.display="none";
                pg.style.display="none";

            }
            else {
                cat.style.display="none";
                ul.style.display="block";
                pg.style.display="block";

            }

        }

    }

});

