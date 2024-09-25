$(document).ready(function() {
    // 當按下按鈕時，觸發 FancyBox
    $("#openLightboxBtn").click(function() {
        $("#fancyboxLink").trigger('click'); // 觸發 FancyBox 顯示燈箱
    });

    // FancyBox 配置 - 監聽燈箱關閉事件
    $("[data-fancybox]").fancybox({
        afterClose: function() {
            // 燈箱關閉後顯示 alert 訊息
            alert("圖片已關閉");
        }
    });
});
