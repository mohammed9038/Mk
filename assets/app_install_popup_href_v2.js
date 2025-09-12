var VJR_BANNER = VJR_BANNER || function() {
    return {
        init: function(t) {
            var a;
            var checkCookie = VJR_BANNER.asdfgetCookieqwer("need");
            if (checkCookie !== "no") {
                if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && t.title && t.days && t.image_url && t.appid && (t.ios_appid || t.android_packagage_name) && (navigator.userAgent.includes("Android") ? t.android_packagage_name && (a = "https://play.google.com/store/apps/details?id=" + t.android_packagage_name) : (navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad") || navigator.userAgent.includes("iPod")) && t.ios_appid && (a = "https://apps.apple.com/us/app/id" + t.ios_appid), t.button_text || (t.button_text = "INSTALL"), a && (0 === window.location.pathname.localeCompare("/")))) {
                    var n = document.createElement("style");
                    n.type = "text/css", n.innerText = '.asdfsmartbannerqwer{left:0;top:0;width:100%;font-family:"Helvetica Neue",helvetica,arial,sans-serif;background:#fff;overflow:hidden;margin-bottom:10px;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:none}.asdfsmartbanner-containerqwer{height:120px;margin:0 auto}.asdfsmartbanner-closeqwer{position:absolute;left:7px;top:32px;display:block;font-family:ArialRoundedMTBold,Arial;font-size:15px;text-align:center;text-decoration:none;border-radius:14px;-webkit-font-smoothing:subpixel-antialiased;border:0;width:17px;height:17px;line-height:17px;color:#b1b1b3;background:#efefef}.asdfsmartbanner-closeqwer:active,.asdfsmartbanner-closeqwer:hover{color:#333}.asdfsmartbanner-iconqwer{box-shadow:0 19px 38px rgba(0,0,0,.3),0 15px 12px rgba(0,0,0,.22);border-radius:10px;position:absolute;left:40px;top:40px;display:block;width:70px;height:70px;background-color:#fff;background-size:cover;background-image:url(' + t.image_url + ')}.asdfsmartbanner-infoqwer{position:absolute;left:130px;top:25%;width:44%;font-size:12px;line-height:1.2em;font-weight:700;color:#999}.asdfsmartbanner-titleqwer{font-size:15px;line-height:17px;color:#000;font-weight:700}.asdfsmartbanner-buttonqwer{margin-left:5%;margin-right:5%;position:absolute;right:0;top:70%;padding:0 10px;width:90%;height:25px;font-size:10px;line-height:0;text-align:center;font-weight:700;color:' + t.text_color + ';background-color:' + t.button_color + ';text-decoration:none;border-radius:0}.asdfsmartbanner-button-textqwer{margin-top:12.5px;text-align:center;display:block;padding:0 5px}a.link{cursor:help;text-decoration:underline}[data-ml-modal]{position:fixed;top:0;bottom:0;left:0;right:0;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch;z-index:999;width:0;height:0;opacity:0}[data-ml-modal]:target{width:auto;height:auto;opacity:1;-webkit-transition:opacity 1s ease;transition:opacity 1s ease}[data-ml-modal]:target .asdfmodal-overlayqwer{position:fixed;top:0;bottom:0;left:0;right:0;cursor:pointer;background-color:#000;background-color:rgba(0,0,0,.7);z-index:1}[data-ml-modal] .asdfmodal-dialogqwer{position:relative;width:100%;max-width:660px;max-height:70%;margin:0;overflow-x:hidden;overflow-y:auto;z-index:2}.asdfmodal-dialog-lgqwer{max-width:100%!important}[data-ml-modal] .asdfmodal-dialogqwer>h3{background-color:#fff;font-size:24px;font-weight:400;margin:0;padding:.8em 56px .8em 27px}[data-ml-modal] .asdfmodal-contentqwer{background:#fff;padding:23px 27px;height:30%;border:0!important}[data-ml-modal] .asdfmodal-closeqwer{padding:6px;position:absolute;top:13px;right:0;color:#000;background-color:#fff;border-radius:50%;height:50px;width:50px;font-size:20px;line-height:37px;text-align:center;-webkit-transition:all .3s ease-in-out;transition:all .3s ease-in-out}[data-ml-modal] .asdfmodal-closeqwer:hover{background-color:#fff;color:#000;cursor:pointer}[data-ml-modal] p:first-child,[data-ml-modal] p:last-child{margin:0;font-size:10px;color:grey;margin-bottom:5px}@media (max-width:767px){[data-ml-modal] .modal-dialog{margin:0 auto}}*,:after,:before{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}a{text-decoration:none;outline:0}.center{text-align:center!important}.btn{display:inline-block;margin-bottom:0;font-weight:400;text-align:center;vertical-align:middle;touch-action:manipulation;cursor:pointer;background-image:none;border:2px solid transparent;white-space:normal;padding:3px 14px;font-size:18px;border-radius:3px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.btn-default{border-color:#0085a6}a.btn-default:hover{background-color:#0085a6;color:#fff}pre{overflow:auto;font-size:1em}', document.head.appendChild(n), document.addEventListener("DOMContentLoaded", function() {
                        var n = document.createElement("div");
                        n.innerHTML = `<div data-ml-modal id="modal-12" style="z-index:999999999999999999999999;"><a href="#!" class="asdfmodal-overlayqwer"></a><div class="asdfmodal-dialogqwer asdfmodal-dialog-lgqwer"><div class="asdfsmartbannerqwer" id="smartabanner" style="z-index:999999999999999999;"><div class="asdfmodal-contentqwer"><div class="asdfsmartbanner-containerqwer"><a href="#!" onclick="return VJR_BANNER.asdfsetCookieqwer('need','no',` + t.days + `)" class="asdfmodal-closeqwer">&times;</a><span class="asdfsmartbanner-iconqwer"></span><div class="asdfsmartbanner-infoqwer"><div class="asdfsmartbanner-titleqwer">` + t.title + `</div><div>` + t.sub_title + `</div></div><a href="` + a + `" target="_blank" class="asdfsmartbanner-buttonqwer"><span class="asdfsmartbanner-button-textqwer">` + t.button_text + `</span></a></div></div><p class="center">Scroll down to continue in browser</p></div></div></div>`, document.body.appendChild(n);
                    })
                    setTimeout(function() {
                        location.href = "/#modal-12";
                        window.onscroll = function() { scrollToClose() };

                        function scrollToClose() { if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) { location.href = "/#!"; } }
                    }, 5000);
                }
            }
        },
        asdfsetCookieqwer: function(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        },

        asdfgetCookieqwer: function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
    }
}();