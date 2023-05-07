hideAll();
$('#home').show();
$('.navbar-nav .nav-link').click(function () {
    const targetId = $(this).attr('href');
    hideAll();
    $(targetId).show();
    return false;
});
function hideAll(){
    $('#home, #customers, #orders,#placeOrder, #items').hide();
}
