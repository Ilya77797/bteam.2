window.addEventListener('DOMContentLoaded', function() {
    getOrderedProducts();
    addEvents();
    $("#phone").mask("8(999) 999-9999");

    function getOrderedProducts() {
        let mass=getCookie('itemsID');
        if(mass==undefined)
        {
            renderOrderedProducts(false);
            return
        }
        mass=mass.split(';');
        let req={
            data:mass
        };

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/corzina', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(req));
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;

            if (xhr.status == 200) {
                var ul=document.getElementById('PR');
                ul.classList.add('awaitSearch');
                renderData(JSON.parse(xhr.response));
            }


        }
    }

    function renderOrderedProducts(isAnyData) {
        var ul=document.getElementById('PR');
        ul.classList.remove('awaitSearch');
        var li=document.createElement('li');
        li.textContent='У вас пока нет товаров в корзине';
        li.style.textAlign = "center";
        ul.appendChild(li);
    }

    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function renderData(mass) {

        var ul=document.getElementById('PR');
        ul.classList.remove('awaitSearch');
        var products=mass.Products;
        var login=mass.login;
        if(login)
            var User=mass.User;
        var promise=new Promise((resolve, reject)=>{
            resolve();
        })
            .then(()=>{
                clear('PR');
            })
            .then(()=>{
            var a=0;
                if(products==undefined)
                {
                    var li=document.createElement('li');
                    li.textContent='У вас пока нет товаров в корзине';
                    li.style.textAlign = "center";
                    ul.appendChild(li);

                }

                var div=document.createElement('div');
                div.classList.add('ZakazItogForAll');
                var span=document.createElement('span');
                span.textContent='Сумма закакза: 0 руб';
                span.setAttribute('id','ZakazItogForAllPrice');
                var a=document.createElement('a');
                a.setAttribute('id','showOrderForm');
                a.textContent='Оформить заказ';
                a.setAttribute('href','#');
                a.addEventListener('click',Order);
                div.appendChild(span);

                if(login){
                    var discount=document.createElement('span');
                    discount.textContent=`Ваша персональная скидка: ${User.discount} %`;
                    discount.style.display="block";
                    div.appendChild(discount);
                }
                div.appendChild(a);

                products.forEach((item)=>{
                    var li=createElements(item, login, User);
                    ul.appendChild(li);
                });
                document.getElementsByClassName('topMenu')[0].appendChild(div);
                //ul.parentNode.insertBefore(div,ul);


            });




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


        var divPrT=document.createElement('div');//3
        divPrT.classList.add('product-text');

        var divPrN=document.createElement('div');//4
        divPrN.classList.add('product-name');

        var amount=document.createElement('span');
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

        var inputZakaz=document.createElement('input');
        inputZakaz.setAttribute('placeholder',`${item.minOrder} ${item.measure}`);
        inputZakaz.setAttribute('id',`inputZ${item._id}`);
        var buttonP=document.createElement('button');
        buttonP.textContent='+';
        var buttonM=document.createElement('button');
        buttonM.textContent='-';
        var spanTotal=document.createElement('span');
        spanTotal.classList.add('spanTotalPrice');
        var zakazContainer=document.createElement('div');
        zakazContainer.classList.add('zakazContainer');

        var small=document.createElement('small');
        small.textContent='руб';
        var b1=document.createElement('b');
        b1.textContent='Итого: ';
        var b=document.createElement('b');
        b.textContent='0';
        b.setAttribute('id',`PriceTotal${item._id}`);
        b.classList.add('PriceTotal'); //Для обновления общей цены
        spanTotal.appendChild(b1);
        spanTotal.appendChild(b);
        spanTotal.appendChild(small);

        var aDelete=document.createElement('a');
        aDelete.classList.add('aDelFromKorzina');
        aDelete.setAttribute('data-info',item._id);
        a.setAttribute('href','#');
        aDelete.textContent='Удалить';

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
            imgIcon.setAttribute('src','images/inOrder.png');//Акция
            spanIcon.textContent='В наличие';
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
        spanPrPrice.textContent='';

        if(login) {
            item.discount=User.discount;
            var small = document.createElement('small');//5
            if (item.status[2] != '1') {

            var select = document.createElement('select');
            select.setAttribute('id',`select${item._id}`);
            spanPrPrice.classList.add('selectPrice');
            if(User.price.length==0){
                var b=document.createElement('b');//5
                b.textContent=item.price;

                var small=document.createElement('small');//5
                small.textContent='руб';
                spanPrPrice.appendChild(b);
                spanPrPrice.appendChild(small);

            }
            else {
                var option = document.createElement('option');
                option.textContent="Выберете цену";
                option.disabled=true;
                select.appendChild(option);
                User.price.forEach((price, i) => {
                    var option = document.createElement('option');
                    var priceName = `specialPrice${i+1}`;
                    option.textContent = item[priceName];
                    select.appendChild(option);
                });
                spanPrPrice.appendChild(select);
            }

            }
            else{
                small.innerHTML="<br> <br>";
                spanPrPrice.appendChild(small);
            }

        }
        else{
            var b=document.createElement('b');//5
            b.textContent=item.price;

            var small=document.createElement('small');//5
            small.textContent='руб';
            spanPrPrice.appendChild(b);
            spanPrPrice.appendChild(small);
        }



        /*appending*/
        li.appendChild(a);
        a.appendChild(divPrM);
        a.appendChild(aDelete);
        divPrM.appendChild(divPrP);

        divPrP.appendChild(img);
        if(item.status!='Ожидается') {
            divPrP.appendChild(divPrPr);
        }

        divPrT.appendChild(divPrN);
        divPrT.appendChild(amount);
        //divPrDetails.appendChild(divPrT);


        a.appendChild(divPrT);
        a.appendChild(divPrAvail);
        a.appendChild(spanPrPrice);
        zakazContainer.appendChild(buttonM);
        zakazContainer.appendChild(inputZakaz);
        zakazContainer.appendChild(buttonP);
        a.appendChild(zakazContainer);
        a.appendChild(spanTotal);


        //a.appendChild(divPrDetailsWrap);
        //divPrDetailsWrap.appendChild(divPrDetails);
        //divPrDetails.appendChild(divPrAvail);
        divPrAvail.appendChild(imgIcon);
        divPrAvail.appendChild(spanIcon);
        //divPrDetails.appendChild(spanPrPrice);
        //divPrDetails.appendChild(buttonM);
        //divPrDetails.appendChild(inputZakaz);
        //divPrDetails.appendChild(buttonP);
        //divPrDetails.appendChild(spanTotal);





        /*a.appendChild(divPrButWrap);
         divPrButWrap.appendChild(divButtons);
         divButtons.appendChild(spanToCart);
         spanToCart.appendChild(spanIconTocart);*/

        //Events for buttons
        buttonM.addEventListener('click', decrementAmount.bind(item) );

        buttonP.addEventListener('click', incrementAmount.bind(item));
        
        inputZakaz.addEventListener('ch', changeZakaz.bind(item));

        inputZakaz.addEventListener('keyup', checkKey.bind(item));

        function changeZakaz(e) {
            var select=document.getElementById(`select${this._id}`);
            var discount=0;
            try {
                discount=parseFloat(this.discount);
            }
            catch (e){

            }
            if(select==undefined)
                var price=this.price;
            else
                price=select.options[select.selectedIndex].value;


            var value=checkInput(e.target, this);
            if(value==null)
                return;


            var totalPrice=document.getElementById(`PriceTotal${this._id}`);
            totalPrice.textContent=`${value*price-value*price*discount/100}`;
            calculateAll();


        }
        
        function incrementAmount (e) {
            e.preventDefault();
            let input=document.getElementById(`inputZ${this._id}`);
            if(input.value==''){
                input.value=this.minOrder;
                var event = new Event('ch');
                input.dispatchEvent(event);
                return
            }


            var value=checkInput(input,this);
            if(value==null)
                return;



                input.value=value+1;
                var event = new Event('ch');

                input.dispatchEvent(event);




        }

        function decrementAmount(e) {
            e.preventDefault();
            let input=document.getElementById(`inputZ${this._id}`);
            if(input.value==''){
                input.value=this.minOrder;

            }



            var value=checkInput(input,this);
            if(value==null)
                return;



            if(value>this.minOrder){
                input.value=value-1;
                var event = new Event('ch');
                input.dispatchEvent(event);
            }

            else{
                var totalPrice=document.getElementById(`PriceTotal${this._id}`);
                totalPrice.textContent='0';
                input.value='0';
                alert(`Минимальный заказ для этого товара: ${this.minOrder}`);
                calculateAll();
            }



        }

        function checkKey(e) {
            var ip=document.getElementById(`inputZ${this._id}`);
            if(e.keyCode==8&&ip.value==""){
                var totalPrice=document.getElementById(`PriceTotal${this._id}`);
                totalPrice.textContent='0';
                calculateAll();
                return
            }
            else {
                var event = new Event('ch');

                ip.dispatchEvent(event);
            }

        }

        return li;
    }

    function clear(id) {
        var element = document.getElementById(id);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    function checkInput(input, item) {
        var value=parseInt(input.value);

        if(isNaN(value)){
            input.value=item.minOrder;
            alert('Введите целое число');
            return null
        }
        return value;
    }

    function addEvents() {
        document.getElementById('PR').addEventListener('click', deleteFromKorzina);
    }
    function deleteFromKorzina(e) {
        e.preventDefault();
        if(e.target.classList.contains('aDelFromKorzina')){
            let id=e.target.dataset.info;
            var mass=getCookie('itemsID').split(';');
            var index = mass.indexOf(id);
            if (index >= 0) {
                mass.splice( index, 1 );
                setCookie('itemsID',mass.join(';'));
                e.target.parentNode.parentNode.remove();

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
    
    function calculateAll() {
        var span=document.getElementById('ZakazItogForAllPrice');
        var price=0;
        var massPrice=document.querySelectorAll('.PriceTotal');
        massPrice.forEach((item)=>{
            try {
                price+=parseFloat(item.textContent);
            }
            catch (e){

            }

        });

        span.textContent=`Сумма заказа: ${price} руб`;
        
    }

    function Order(e) {
        var form=document.getElementsByClassName('formOrder')[0];
        var ul=document.getElementById('PR');
        var content=document.getElementById('content');
        var a=document.getElementById('showOrderForm');
        if(ul.style.display=='none')
            a.textContent='Оформить заказ';
        else
            a.textContent='Назад в корзину';
        $(ul).slideToggle(300);
        $(form).slideToggle(300);
        document.body.style.overflowY='scroll';
        //$('html, body').animate({ scrollTop: form[0].offsetTop}, 500);

    }

});