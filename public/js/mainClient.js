window.addEventListener('DOMContentLoaded', function() {
    var startPoint={};
    var historyCat={//объект для работы с текущими категориями
        div:null,
        pointers:[]
    };
    var touchCoords={//Координаты касания пальцем экрана
        X:null,
        Y:null
    };

    var activeCatPointer=null; //Указатель на текущую категорию
    var currentCat=null;
    addEvents();
    SearchData(false,true);
    getCats();
   /* var catForm=document.getElementById('catSearch');
    var e=new Event('submit');
    catForm.dispatchEvent(e);*/

    function clear(id) {
        var element = document.getElementById(id);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

     function renderCat(mass) {
        var isAnActiveCat=false;
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

                    //renderAllProductsCat(div);
                    mass.forEach(function (item) {
                        generateSubCat(item, div, true);
                    });

                    if(isAnActiveCat==false&&currentCat!=null){
                        var div_2=document.createElement('div');
                        div_2.classList.add('categor-item','categor-item-active');
                        div_2.appendChild(currentCat);
                        div.insertBefore(div_2, div.firstElementChild);
                    }
                }

            });




    }
    function renderAllProductsCat(div1) {
        var div=div1|| document.getElementById('categor');
        var div_2=document.createElement('div');
        div_2.classList.add('categor-item');
        var a = document.createElement('a');
        a.setAttribute('data-info', 'allProducts');
        a.setAttribute('href','#');
        a.textContent = 'Все товары ';
        div_2.appendChild(a);
        div.insertBefore(div_2,div.firstChild);
    }

    function renderHistoryCat(prevCat) {
        var div=document.getElementById('categor');
        var a=document.createElement('a');
        a.setAttribute('data-info', prevCat.firstChild.dataset.info);
        a.setAttribute('href','#');
        a.textContent = prevCat.firstChild.textContent;
        if(historyCat.div==null){
            var div_2=document.createElement('div');
            div_2.classList.add('categor-item');
            div_2.classList.add('subcatHistory')
            var aAllPr = document.createElement('a');
            aAllPr.setAttribute('data-info', 'allProducts');
            aAllPr.setAttribute('href','#');
            aAllPr.textContent = 'Все товары ';
            div_2.appendChild(aAllPr);
            div_2.appendChild(a);
            historyCat.div=div_2.cloneNode(true);
            let pointer={
                name:aAllPr.dataset.info,
                div:null
            }
            historyCat.pointers.push(pointer);
        }
        else{
            historyCat.div.appendChild(a);
        }
        div.insertBefore(historyCat.div, div.firstChild);
        let pointer={
            name:prevCat.firstChild.dataset.info,
            div:prevCat
        }
        historyCat.pointers.push(pointer);

    }

    function generateSubCat (item, div, flag) {//rendering subcat
        var div_2=document.createElement('div');
        div_2.classList.add('categor-item');
        if(!flag)
            div_2.style.display='none';
        var a = document.createElement('a');
        a.setAttribute('data-info', item.name);
        a.setAttribute('href','#');
        a.textContent = item.name;
        if(currentCat!=null&&item==currentCat.getAttribute('data-info')){
            div_2.classList.add('categor-item-active');
            isAnActiveCat=true;
        }

        div_2.appendChild(a);
        div.appendChild(div_2);
        if(item.subcat!='null'){
            //For mobile
            let subcatIcon=document.createElement('img');
            subcatIcon.src="images/vpravo.png"
            div_2.appendChild(subcatIcon);
            item.subcat.forEach(function (item) {
                generateSubCat(item, div_2);
            });
        }
    }

    function showSubcats(e){
        if(e.target.classList.contains('categor-item'))
        {
            let children=e.target.childNodes;
            children.forEach((item)=>{
                item.style.display='block';
            });
        }
    }

     function renderData(mass,f) {

        var ul=document.getElementById('PR');
        ul.classList.remove('awaitSearch');
        var ul=document.getElementById('PR');
        var products=mass.Products;
        var login=mass.login;
         if(login)
             var User=mass.User;
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
                    var li=createElements(item, login, User);
                    try{
                        let mass=getCookie('itemsID').split(';');
                        if(mass.indexOf(item._id.toString())!=-1)
                            addToCartList(li);
                    }
                    catch (e){

                    }

                    ul.appendChild(li);
                });

                if(!f){//Запрос не по номеру страницы
                    if(pages>1){
                        $('#light-pagination').pagination({
                            displayedPages: 3,
                            edges:1,
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

/*    function SearchCat(form) {
        form.onsubmit = function(event) {
            event.preventDefault();
            var a = new FormData(this);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/searchCat', true);
            xhr.send(new FormData(this));
            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) return;

                if (xhr.status == 200) {
                    renderCat(JSON.parse(xhr.response));
                }


            }

        }
    }*/

function getCats() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/searchCat', true);
    xhr.send('');
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;

        if (xhr.status == 200) {
            renderCat(JSON.parse(xhr.response));
        }
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
            var sort=document.getElementById('chooseSort').options[document.getElementById('chooseSort').selectedIndex].value;
            var req={
                text:textS,
                page:PageS,
                cat:categor,
                flag:isMain,
                isPageS:f,
                sort:sort
            };



        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/searchData', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(req));
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;

            if (xhr.status == 200) {
                renderData(JSON.parse(xhr.response),f);
            }


        }




    }

    function addEvents() {
        //for categories
     /*   var catForm=document.getElementById('catSearch');
        SearchCat(catForm);
        catForm.search.addEventListener('keyup',function () {
            var event = new Event("submit");
            catForm.dispatchEvent(event);
        });*/

      /*  var INPUT=document.getElementsByTagName('input');
        var SELECT=document.getElementsByTagName('select');
        Array.from(INPUT).concat(Array.from(SELECT)).forEach((item)=>{
            item.addEventListener('focus',(e)=>{
                e.preventDefault()
            });
        });*/

        //for Select
        var select=document.getElementById('chooseSort');
        select.addEventListener('change',(e)=>{
            SearchData(false, true);
        });
        //for data
        var dataForm=document.getElementById('dataSearch');
        dataForm.searchD.addEventListener('keyup',function () {
            SearchData(false,true);
        });

        dataForm.addEventListener('submit',(e)=>{
            e.preventDefault();

        });

        dataForm.searchD.addEventListener('focus',()=>{
            var s=document.getElementById('dataSearch').searchD.placeholder='';

        });

        dataForm.searchD.addEventListener('blur',()=>{
            document.getElementById('dataSearch').searchD.placeholder='Поиск товаров';
        });

 /*       catForm.search.addEventListener('focus',()=>{
            document.getElementById('catSearch').search.placeholder='';
        });

        catForm.search.addEventListener('blur',()=>{
            document.getElementById('catSearch').search.placeholder='Поиск в категориях';
        });*/


        var pagination=document.getElementById('light-pagination');
        pagination.addEventListener('click',SearchDataPage);

        var cat=document.getElementById('categor');
        //event is also used for working with subcats
        cat.addEventListener('click', onclick);
        //Мобильные события
        /*document.addEventListener('touchstart', handleTouchStart, false);
        document.addEventListener('touchmove', handleTouchMove, false);
*/

        var PR=document.getElementById('PR');
        PR.addEventListener('click',openNewWindow);

        var topMenu=document.getElementsByClassName('topMenu')[0];
        topMenu.addEventListener('click', topMenuFetch);

        document.body.addEventListener('scroll',()=> {

            var isMobile = getComputedStyle(document.getElementsByClassName('mobile')[0]);
            var cat=getComputedStyle(document.getElementsByClassName('categor-wrapper-fix')[0]);
            if (isMobile.display == 'none') return;

            if(cat.display=='block'){//скроллинг в категориях

                var height = '';
                try{
                    height=parseFloat(getComputedStyle(document.getElementById('header')).height);
                }
                catch (e){
                    return;
                };
                try {
                    document.getElementsByClassName('topMenu')[0].classList.remove('topMenuScroll');
                }
                catch (e){

                }
                var viewportOffset = document.getElementById('categor-wrapper').getBoundingClientRect();
                var top = viewportOffset.top;

                if (top <0) {
                    document.getElementsByClassName('catS')[0].classList.add('catSscroll');
                }
                else {
                    try {
                        document.getElementsByClassName('catS')[0].classList.remove('catSscroll');
                    }
                    catch (e) {

                    }
                }
            }
            else{//основной скроллинг

                var height = '';
                try{
                    height=parseFloat(getComputedStyle(document.getElementById('header')).height);
                }
                catch (e){
                    return;
                };
                var s=document.body.scrollTop;
                var viewportOffset = document.getElementById('PR').getBoundingClientRect();
                var top = viewportOffset.top;

                var pbb=PR.clientHeight;
                var y=this.scrollY;
                if (top <0) {
                    document.getElementsByClassName('topMenu')[0].classList.add('topMenuScroll');
                }
                else{
                    try {
                        document.getElementsByClassName('topMenu')[0].classList.remove('topMenuScroll');
                    }
                    catch (e){

                    }
                }



            }


        });

        /*Listening to the orientation change*/
        window.addEventListener("orientationchange", function() {
            if(window.orientation==90||window.orientation==-90||window.orientation==0)
                location.reload();
        }, false);


    }

   /* function handleTouchStart (e){
        if(isExecuted) return;
        var isMobile = getComputedStyle(document.getElementsByClassName('mobile')[0]);
        if(isMobile.display == 'none') return;
        touchCoords.X= e.touches[0].clientX;
        touchCoords.Y=e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        if ( ! touchCoords.X || ! touchCoords.Y ) {
            return;
        }
        var isMobile = getComputedStyle(document.getElementsByClassName('mobile')[0]);
        if(isMobile.display == 'none') return;

        var xUp = e.touches[0].clientX;
        var yUp = e.touches[0].clientY;

        var xDiff = touchCoords.X - xUp;
        var yDiff = touchCoords.Y - yUp;

        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/!*most significant*!/
            if ( xDiff > 0 ) {
                /!* left swipe *!/

            } else {
                /!* right swipe *!/
                if(historyCat.pointers.length==0) return;
                var newVisibleCat={
                    pointer:historyCat.pointers[historyCat.pointers.length-2].div,
                    index:historyCat.pointers.length-2
                };
                if(newVisibleCat=={}) return;
                changeCurentCat(newVisibleCat);//Изменить текущую категорию и отрисовать это


            }
        } else {
            if ( yDiff > 0 ) {
                /!* up swipe *!/
            } else {
                /!* down swipe *!/
            }
        }
        /!* reset values *!/
        xDown = null;
        yDown = null;
    };
*/
    function changeDisplay(param, elem, count, flag) {

        if(flag!=undefined){
            elem.style.display=param;
        }
        if(elem.classList.contains('curSubcat')&&param!='none')
            elem.style.display='block';
        let children=elem.childNodes;
        if(children.length!=0&&count>0){
            children.forEach((node)=>{
                if(node.classList.contains('categor-item')&&node.firstChild.dataset.info!='allProducts'){
                    node.style.display=param;
                    changeDisplay(param, node, count-1);
                }
            });
        }
    }

function curentSubcat(subcat){
        subcat.classList.add('curSubcat');
        subcat.style.display='block';//changing flex
        var children=subcat.childNodes;
        children[0].classList.add('curSubcatA');
        children[1].classList.add('curSubcatImg');
        /*try{
            subcat.parentNode.classList.remove('curSubcat');
        }
        catch(e){

        }*/

}

function getPointerFromHistoryCat(name) {
    var pointer={};
    historyCat.pointers.forEach((item,i)=> {
       if (item.name == name)
           pointer= {pointer: item.div, index: i} //item.div-указатель на div, к которому нужно перейти
   });
    return pointer;
}

    function onclick(e) {
        //working with subcats
        if(e.target.nodeName=="IMG"){//Свернуть/развернуть категории
            let parent=e.target.parentNode;
            var histCat=parent;
            changeDisplay('none', parent.parentNode, 100);//Скрыть все категории
            changeDisplay('flex',parent,1, true);//Сделать видимыми нужные категории
            if(histCat.id!='categor')
                curentSubcat(parent);//Добавть класс для текущей категории
            renderHistoryCat(histCat);
            document.getElementsByClassName('subcatHistory')[0].style.display='block';//changing flex to block


            return
        }

        if(e.target.nodeName!='A')
            return



        if(e.target.parentNode.classList.contains('subcatHistory')){
            var newVisibleCat=getPointerFromHistoryCat(e.target.dataset.info);
            if(newVisibleCat=={}) return;
            changeCurentCat(newVisibleCat);//Изменить текущую категорию и отрисовать это

        }

        searchDatabyCat(e);
    }

    function changeCurentCat(newVisibleCat) {
        var count=0;
        for(let i=historyCat.pointers.length-1;i>newVisibleCat.index;i--){//Удалить лишние указатели из объекта historyCat
            if(historyCat.pointers[i].div!=null)
            {
                let ch=historyCat.pointers[i].div.childNodes;//Убрать классы "текущих" категорий
                historyCat.pointers[i].div.classList.remove('curSubcat');
                ch[0].classList.remove('curSubcatA');
                ch[1].classList.remove('curSubcatImg');
            }
            historyCat.pointers.pop();
            count++;
        }
        while (count>0){//Удалить лишние ссылки из объекта historyCat
            historyCat.div.lastChild.remove();
            count--;
        }
        if(historyCat.div.lastChild==null)
            historyCat.div=null;
        if(newVisibleCat.pointer==null){
            let categor=document.getElementById('categor');
            changeDisplay('none', categor, 100);//Скрыть все категории
            changeDisplay('flex',categor,1, true);//Сделать видимыми нужные категории
        }
        else{
            changeDisplay('none', newVisibleCat.pointer.parentNode, 100);//Скрыть все категории
            changeDisplay('flex',newVisibleCat.pointer,1, true);//Сделать видимыми нужные категории
        }
        categor.style.display='block';//changing flex to block
        document.getElementsByClassName('subcatHistory')[0].style.display='block';//changing flex to block

    }

    function searchDatabyCat(e){

        var catNode=e.target;
       currentCat=catNode.cloneNode(true);
       changeActiveCat(e.target.parentNode);
       SearchData(false,true);
       var isMobile=getComputedStyle(document.getElementsByClassName('mobile')[0]);
       if(isMobile.display!='none'&&!e.target.parentNode.classList.contains('subcatHistory')){
           var cat=document.getElementsByClassName('categor-wrapper-fix')[0];
           var ul=document.getElementById('PR');
           var pg=document.getElementById('light-pagination');
           cat.style.display="none";
           ul.style.display="block";
           pg.style.display="block";

       }


    }

    function changeActiveCat(parrent, child) {
        /*var cat=child||document.getElementById('categor');
        var childs=cat.childNodes;
        childs.forEach((item)=>{
            let flag=f
            if(item.classList.contains('categor-item-active')){
                item.classList.remove('categor-item-active');
                return;
            }

            changeActiveCat(null,item);
        });*/

            if(activeCatPointer!=null)
            {
                try{
                    activeCatPointer.classList.remove('categor-item-active');
                }
                catch (e){

                }
            }
        if(!parrent.classList.contains('subcatHistory')){
            parrent.classList.add('categor-item-active');
           // document.getElementById('dataSearch').searchD.value='';
            activeCatPointer=parrent;

        }



    }

    function SearchDataPage(e) {
        if(e.target.nodeName=='A')
            SearchData(true,false);
    }

    function createElements(item, login, User) {
        var li=document.createElement('li') //0
        li.classList.add('product-wrapper');


        var a=document.createElement('a');//1
        a.classList.add('product');


        var divPrM=document.createElement('div');//2
        divPrM.classList.add('product-main');

        var divPrP=document.createElement('div');
        divPrP.classList.add('product-photo');//3

        var img=document.createElement('img');//4
        img.setAttribute('src',item.icon);

        var divPrPr=document.createElement('div');//4
        divPrPr.classList.add('product-preview');


            if(item.price!="0.00"){
                var span=document.createElement('span');//5
                span.classList.add('button');
                span.classList.add('to-cart');
                span.setAttribute('data-info', item._id);
                span.textContent="В корзину";
                divPrPr.appendChild(span);
            }




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
        else{//Вывод текстового описания
            divPrN.textContent=item.name;
            if(item.textDescription!=''){
                    var spanDescription=document.createElement('span');
                    spanDescription.classList.add('textDescription');
                    spanDescription.textContent=item.textDescription;

                    divPrP.appendChild(spanDescription);
                    img.style.opacity="0.3";



            }

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


        var imgIcon=document.createElement('img');
       if(item.status[2]=='1'){
           imgIcon.setAttribute('src','images/comingSoon.png');//Ожидается
           spanIcon.textContent='Ожидается';
       }
        else if(item.status[0]=='1'){
                imgIcon.setAttribute('src','images/New.png');//Новинка
                spanIcon.textContent='Новинка';
       }
       else if(item.status[1]=='1'){
           imgIcon.setAttribute('src','images/onSale.png');//Акция
           spanIcon.textContent='Акция';
       }
       else {
           if(item.amount!="0"){
               spanIcon.textContent='В наличии';
               imgIcon.setAttribute('src','images/inOrder.png');

           }
           else{
               spanIcon.textContent='Нет в наличие';
               imgIcon.setAttribute('src','images/no.jpg');
           }

       }
       /* switch(item.status){
            case 'Акция!': imgIcon.setAttribute('src','images/onSale.png');
                break;
            case 'В наличии': imgIcon.setAttribute('src','images/inOrder.png');
                break;
            case 'Ожидается': imgIcon.setAttribute('src','images/comingSoon.png');
                break
            case 'Новинка':imgIcon.setAttribute('src','images/New.png');
                break;
        }*/
        imgIcon.classList.add('iconAvail');

        var spanPrPrice=document.createElement('span');//4
        spanPrPrice.classList.add('product-price');
        spanPrPrice.classList.add('fix');//Чтобы b, small=float:left только в корзине

        if(login){

            var small = document.createElement('small');//5
            if (item.status[2] != '1') {

                var select = document.createElement('select');
                select.setAttribute('id', `select${item._id}`);
                spanPrPrice.classList.add('selectPrice');
                if (User.price.length == 0) {
                    var b = document.createElement('b');//5
                    b.textContent = item.price;

                    var small = document.createElement('small');//5
                    small.textContent = 'руб';
                    spanPrPrice.appendChild(b);
                    spanPrPrice.appendChild(small);

                }
                else {
                    var option = document.createElement('option');
                    option.textContent = "Доступные цены";
                    option.disabled = true;
                    select.appendChild(option);
                    User.price.forEach((price, i) => {
                        var option = document.createElement('option');
                        var priceName = `specialPrice${i + 1}`;
                        option.textContent = item[priceName];
                        select.appendChild(option);
                    });
                    spanPrPrice.appendChild(select);
                }

            }
           /* var small=document.createElement('small');//5
            if(item.status[2]!='1')
                small.textContent=`${item.price} руб /${item.specialPrice1} руб /${item.specialPrice2} руб /${item.specialPrice3} руб/${item.specialPrice4} руб`;
            else
                small.innerHTML="<br> <br>";
            spanPrPrice.appendChild(small);*/
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
                    if(item.status!='Ожидается') {
                        divPrP.appendChild(divPrPr);

                    }
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
        else if(e.target.classList.contains('button')&&e.target.classList.contains('to-cart')){//Добавление товара в корзину
            var cookies=getCookie('itemsID');
            if(cookies==undefined||cookies=="")
                setCookie('itemsID',e.target.dataset.info);
            else
                setCookie('itemsID',cookies+';'+e.target.dataset.info);
            var li=e.target;
            while(li.nodeName!='LI')
                li=li.parentNode;
            addToCartList(li);
        }
        else if(e.target.classList.contains('textDescription')){
            if(e.target.style.overflow=="hidden"){
                e.target.style.overflow="visible";
            }
            else{
                e.target.style.overflow="hidden";
            }

        }

    }
    
    function addToCartList(li) {//Добавление к товару класса, говорящего о том, что он находится в корзине
        var preview=li.getElementsByClassName('product-preview')[0];
        while (preview.firstChild)
            preview.removeChild(preview.firstChild);
        var div=document.createElement('div');
        div.classList.add('vKorzine');
        div.textContent='В корзине';
        preview.appendChild(div);
        preview.style.opacity=1;
        preview.style.bottom='11%';


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
            var catInfo=getComputedStyle(cat);
            if(catInfo.display=="none"){
                $(cat).slideToggle(300);
                ul.style.display="none";
                pg.style.display="none";

            }
            else {
                $(cat).slideToggle(300);
                ul.style.display="block";
                pg.style.display="block";

            }

        }
        else{//Переход в корзину в новой вкладке
            reg=new  RegExp('corzina');
            var target=e.target;
            if(e.target.nodeName=='IMG')
                target=e.target.parentNode;

            if(target&&target.href.match(reg)){///Переход в корзину
                //window.open(target.href, '_blank');
               window.location=target.href;
            }
        }



    }

    function setCookie(name, value, options) {//Установка кук
        options = options || {};

        var expires = options.expires;

        if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + "=" + value;

        for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }

        document.cookie = updatedCookie;
    }

    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }


});

