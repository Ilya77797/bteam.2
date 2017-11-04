window.addEventListener('DOMContentLoaded', function() {
    getOrderedProducts();
    function addEvents() {

    }
    function getOrderedProducts() {
        let mass=getCookie('itemsID').split(';');
        if(mass.length==0)
        {
            renderOrderedProducts(false);
            return
        }

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
                renderData(JSON.parse(xhr.response),f);
            }


        }
    }

    function renderOrderedProducts(isAnyData) {

    }

    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

});