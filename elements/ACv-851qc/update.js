function(instance, properties, context) {
   function checkMobile() {
	var b = /iPhone/i,
        c = /iPod/i,
        d = /iPad/i,
        e = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,
        f = /Android/i,
        g = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
        h = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
        i = /Windows Phone/i,
        j = /(?=.*\bWindows\b)(?=.*\bARM\b)/i,
        k = /BlackBerry/i,
        l = /BB10/i,
        m = /Opera Mini/i,
        n = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
        o = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,
        p = new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i"),
        q = function(a, b) {
            return a.test(b)
        };
	var r = window.navigator.userAgent,
		s = r.split("[FBAN");
    var obj ={};
	if ("undefined" != typeof s[1] && (r = s[0]), s = r.split("Twitter"), "undefined" != typeof s[1] && (r = s[0]), obj.apple = {
			phone: q(b, r),
			ipod: q(c, r),
			tablet: !q(b, r) && q(d, r),
			device: q(b, r) || q(c, r) || q(d, r)
		}, obj.amazon = {
			phone: q(g, r),
			tablet: !q(g, r) && q(h, r),
			device: q(g, r) || q(h, r)
		}, obj.android = {
			phone: q(g, r) || q(e, r),
			tablet: !q(g, r) && !q(e, r) && (q(h, r) || q(f, r)),
			device: q(g, r) || q(h, r) || q(e, r) || q(f, r)
		}, obj.windows = {
			phone: q(i, r),
			tablet: q(j, r),
			device: q(i, r) || q(j, r)
		}, obj.other = {
			blackberry: q(k, r),
			blackberry10: q(l, r),
			opera: q(m, r),
			firefox: q(o, r),
			chrome: q(n, r),
			device: q(k, r) || q(l, r) || q(m, r) || q(o, r) || q(n, r)
		}, obj.seven_inch = q(p, r), obj.any = obj.apple.device || obj.android.device || obj.windows.device || obj.other.device || obj.seven_inch, obj.phone = obj.apple.phone || obj.android.phone || obj.windows.phone, obj.tablet = obj.apple.tablet || obj.android.tablet || obj.windows.tablet, "undefined" == typeof window) 
        console.log(obj);
        return obj
}
    	 
	var device = checkMobile();
    instance.publishState("any_device", device.any); 
  

}