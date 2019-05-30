function start() {

    let url = "https://api.coingecko.com/api/v3/coins/list";

    ajaxFetch('GET', url, cb);

};

var checked = [];
var mydata;

const cb = function (xhr) {
    mydata = JSON.parse(xhr.responseText);
    mydata = mydata.slice(400, 500);

    var list = $("#list");
    for (var i = 0; i < mydata.length; i++) {

        var card = $('<div/>', { class: "card", id: mydata[i].symbol }).appendTo(list);
        $(card).append('<label class = "switch"> <input type = "checkbox" class = ' + mydata[i].symbol + ' id = ' + mydata[i].id + ' > <span class = "slider round" </span> </label>');

        $('<div/>', { class: "info" }).appendTo(card).html(`<p> ${mydata[i].symbol} </p>
                                                            <p> ${mydata[i].name} </p>
                                                            <p class = "need">${mydata[i].id}</p>`);
        $('.need').hide();
        $('<button/>', { class: "inf", text: "More Info", id: i }).appendTo(card);

    }

    $('input').bind('click', (function () {
        if ($(this).is(':checked')) {
            checked.push($(this).attr('class'));
            //console.log(checked);
        } else {
            var unchC = $(this).attr('class');
            for (i = 0; i < checked.length; i++) {
                if (checked[i] === unchC) { checked.splice(i, 1); }
            }
            //console.log(checked);
        }

        if (checked.length == 6) {
            $('#myOverlay').fadeIn(297, function () {
                $('#myModal')
                    .css('display', 'block')
                    .animate({ opacity: 1 }, 198);
            });

            $.each(checked, function (index, value) {
                $('#content').append(`<li>${value}</li>`);
            });
            $('#content').children().click(function () {
                $(this).remove();
                var h = $(this).text(); //value
               // console.log(h);
                for (i = 0; i < checked.length; i++) { if (checked[i] === h) { checked.splice(i, 1); } };
                $('input.' + h).prop('checked', false);
                //console.log(checked);
            });
            //else
        }
    }));

    $('#confirm').click(function () {
        if (checked.length <= 5) {
            $('#myModal').animate({ opacity: 0 }, 198, function () {
                $(this).css('display', 'none');
                $('#myOverlay').fadeOut(297);
                $('#content').html('');
            });
        }
    })

    $('.inf').bind('click', (function () {

        var a = $(this).siblings('.info').find('.need').text();

        let url = 'https://api.coingecko.com/api/v3/coins/' + a;

        var b = $(this).parent();
        $(this).parent().append('<div id = "pic" class = pic' + a + '></div> <div id = price class= price' + a + '></div>');
        $(this).replaceWith('<button class = "back"> More Info</button>');
        $(b).find('.back').bind('click', (function () { $(b).children('#pic, #price').toggle(); }));

        const pb = function (xhr) {
            var moreData = xhr.responseText;
            cho = JSON.parse(moreData.replace(/(\r\n)/g, '').replace(/="https/g, "='https").replace(/">/g, "'>"));

            $('.pic' + a).html("<img src = " + cho.image.large + ">");
            $('.price' + a).html(`<span>${cho.market_data.current_price.usd}$</span> <br>
                             <span>${cho.market_data.current_price.eur}€</span> <br>
                             <span>${cho.market_data.current_price.ils}₪</span>
                            `);
        }
        ajaxFetchA('GET', url, pb);
    }));

}

$(start());

$('#home').bind('click', function () {
    $('.parallax-window').css({ 'min-height': '500px' });
    $('#list').show();
    $('#chart1').hide();
    $('#forsearch').empty();
    $('#forabout').empty();
    $("#chart2").remove();
})

$('#reports').bind('click', function () {

    $("#list").hide();
    $("#chart1").show();
    $('#forsearch').empty();
    $('#forabout').empty();
    $('<div/>', { id: "chart2" }).appendTo($("#chart1"));
    $('.parallax-window').css({ 'min-height': '270px' });

    var coinPrice;
    var end = 1;
    var dataStr = checked.toString().toUpperCase();

    for (var i = 0; i < checked.length; i++) {
        window['dataPoints' + i] = [];
        //window.dataPoints + i == [];
    }

    var options = {
        animationEnabled: true,
        title: {
            text: `${dataStr} to USD`
        },
        axisX: {
            title: "",
            valueFormatString: "hh:mm:ss"

        },
        axisY: {
            title: "USD",
            //valueFormatString: "$#.########"

        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },

        data: []

    };

    getData();

    function updateData(data) {
        if (end == 1) {
            for (var i = 0; i < Object.values(data).length; i++) {
                options.data.push({
                    type: "spline",
                    name: Object.keys(data)[i],
                    showInLegend: true,
                    xValueFormatString: "hh:mm:ss",
                    //valueFormatString: "$#.########",
                    dataPoints: window['dataPoints' + i]

                });
            }
            end = 2;
        }
        $("#chart2").CanvasJSChart(options);
        // $("#chart1").CanvasJSChart().render();
        setTimeout(getData, 2000);
    };

    function getData() {
        $.getJSON(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${dataStr}&tsyms=USD`, function (data) {

            for (var i = 0; i < Object.values(data).length; i++) {
                coinPrice = Object.values(data)[i].USD
                window['dataPoints' + i].push({ x: new Date(), y: coinPrice })
            }
            updateData(data);
        });
    }

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
});

$("#search").click(function () {
    $('#forabout').empty();
    var searchCoin = $("#crypto").val().toLowerCase();
    $("#crypto").val("");
    for (var i = 0; i < mydata.length; i++) {
        if (searchCoin === mydata[i].symbol) {
            $('#list').hide();
            $('#forsearch').show();
            $('#' + searchCoin).clone(true).appendTo('#forsearch').show();
            return;
        }
    }
    //alert
    $('#myOverlay2').fadeIn(297, function () {
        $('#myModalError')
            .css('display', 'block')
            .animate({ opacity: 1 }, 198);
    });
});

$('#ok').click(function () {
    $('#myModalError').animate({ opacity: 0 }, 198, function () {
        $(this).css('display', 'none');
        $('#myOverlay2').fadeOut(297);
        $('#content').html('');
    });
});

$('#about').click(function () {
    $('#list, #chart1').hide();
    $('#forsearch').empty();

    $('#forabout').html(`<h1> Cryptocurrencies project. </h1> <br> 
                         <p> On this site you can get the actual information about cryptocoins 
                             and check out live charts with price information in USD. </p>
                             
                             <span> Created By Tamila Kats. </span> <br>
                             <img src = "pic/2019-02-13.jpg" id = "mypic"/>`);

});