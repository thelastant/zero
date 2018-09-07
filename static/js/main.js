$(document).ready(function () {
    $.ajaxSetup({
        data: {csrfmiddlewaretoken: '{{ csrf_token }}'},
    })
});


// $('.title_type_1').click(function () {
//         $.gerJson('/movie',function (ret) {
//             for (var i = ret.length - 1; i>=0; i--){
//                 $('.title_type_1')
//             }
//         })
//
// });