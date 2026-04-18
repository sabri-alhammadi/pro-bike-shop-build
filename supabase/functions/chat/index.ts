import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `أنت مساعد متجر "ROAD BIKER" (رود بايكر) - متجر متخصص في إكسسوارات الدراجات النارية وقطع الغيار ومعدات الحماية.

مهمتك:
- مساعدة العملاء في اختيار المنتجات (خوذ، جاكيتات، قفازات، قطع غيار، إكسسوارات).
- الإجابة على الأسئلة عن العروض الحالية: كود RIDER15 (خصم 15%)، كود SAVE50 (خصم 50 ريال)، وكود FREESHIP (شحن مجاني).
- توجيه العملاء لصفحة العروض /offers.
- توفير نصائح عامة عن السلامة والقيادة الآمنة.
- التواصل بالعربية بأسلوب ودود ومختصر، واستخدم الإنجليزية إذا سأل العميل بها.

إذا سُئلت عن السعر الدقيق أو توفر منتج معين، اطلب من العميل تصفح صفحة المنتج أو التواصل عبر واتساب.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز الحد المسموح، حاول لاحقاً." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "الرصيد غير كافٍ، يرجى إضافة رصيد لمساحة العمل.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
