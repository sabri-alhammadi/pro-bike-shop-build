import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SHOPIFY_DOMAIN = "pro-bike-shop-build-7rp8a.myshopify.com";
const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_STOREFRONT_TOKEN = "d3d53d1526c2f54bc4ce5982f724c4f4";
const SHOPIFY_ADMIN_TOKEN = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
const WHATSAPP_NUMBER = "966500123007";
const SITE_BASE = "https://roadbiker.sa";

const SYSTEM_PROMPT = `أنت "وكيل رود بايكر" — مساعد ذكاء اصطناعي يعمل وكيلاً متكاملاً لمتجر ROAD BIKER لإكسسوارات وقطع غيار الدراجات النارية.

دورك:
1) الرد على استفسارات العملاء بالعربية بأسلوب ودود واحترافي ومختصر.
2) اقتراح المنتجات المناسبة باستخدام أداة search_products، وأرفق دائماً الاسم، السعر، ورابط المنتج (/product/{handle}).
3) متابعة حالة الطلبات والشحن باستخدام أداة get_order_status (تحتاج رقم الطلب + بريد العميل).
4) الإجابة عن سياسات المتجر (شحن، إرجاع، دفع) باستخدام أداة get_store_policy.
5) إذا طلب العميل التحدث مع شخص بشري، أو كانت المسألة معقدة، استخدم أداة handoff_to_whatsapp وقدّم رابط واتساب.

قواعد:
- لا تخترع أسعاراً أو منتجات. استخدم الأدوات دائماً للحصول على بيانات حقيقية.
- اذكر أكواد الخصم عند الحاجة: RIDER15 (15%)، SAVE50 (50 ريال)، FREESHIP (شحن مجاني).
- اجعل ردودك قصيرة وعملية، استخدم تعداداً نقطياً عند عرض منتجات متعددة.`;

const tools = [
  {
    type: "function",
    function: {
      name: "search_products",
      description: "ابحث في كتالوج Shopify للمتجر واسترجع منتجات حقيقية بالأسعار والروابط.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "كلمة البحث: helmet, jacket, gloves..." },
          limit: { type: "number", description: "عدد المنتجات (افتراضي 5)" },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_order_status",
      description: "احصل على حالة طلب وشحن باستخدام رقم الطلب والبريد الإلكتروني للعميل.",
      parameters: {
        type: "object",
        properties: {
          order_number: { type: "string", description: "رقم الطلب مثل #1001 أو 1001" },
          email: { type: "string", description: "بريد العميل المستخدم في الطلب" },
        },
        required: ["order_number", "email"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_store_policy",
      description: "احصل على نص سياسة المتجر (شحن، إرجاع، دفع، ضمان).",
      parameters: {
        type: "object",
        properties: {
          policy: {
            type: "string",
            enum: ["shipping", "returns", "payment", "warranty"],
          },
        },
        required: ["policy"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "handoff_to_whatsapp",
      description: "حوّل المحادثة لفريق الدعم البشري عبر واتساب.",
      parameters: {
        type: "object",
        properties: {
          reason: { type: "string", description: "سبب التحويل (شكوى، استفسار خاص...)" },
        },
        required: ["reason"],
        additionalProperties: false,
      },
    },
  },
];

const POLICIES: Record<string, string> = {
  shipping:
    "🚚 الشحن: نشحن لجميع مدن المملكة. التوصيل خلال 2-5 أيام عمل. الشحن مجاني للطلبات فوق 300 ريال أو باستخدام كود FREESHIP.",
  returns:
    "↩️ الإرجاع: يمكنك إرجاع المنتج خلال 14 يوماً من الاستلام بشرط أن يكون بحالته الأصلية وغير مستخدم. لا تُرجَع منتجات النظافة الشخصية.",
  payment:
    "💳 الدفع: نقبل بطاقات مدى وفيزا وماستركارد، Apple Pay، تابي وتمارا للتقسيط، وكذلك الدفع عند الاستلام داخل الرياض.",
  warranty:
    "🛡️ الضمان: جميع منتجاتنا أصلية ومضمونة من الوكيل. مدة الضمان تختلف حسب المنتج (سنة على الخوذ المعتمدة DOT/ECE).",
};

async function searchShopifyProducts(query: string, limit = 5) {
  const gql = `query($first:Int!,$query:String){products(first:$first,query:$query){edges{node{title handle priceRange{minVariantPrice{amount currencyCode}}}}}}`;
  const r = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query: gql, variables: { first: limit, query } }),
    },
  );
  const data = await r.json();
  const items = (data?.data?.products?.edges || []).map((e: any) => ({
    title: e.node.title,
    handle: e.node.handle,
    url: `${SITE_BASE}/product/${e.node.handle}`,
    price: `${e.node.priceRange.minVariantPrice.amount} ${e.node.priceRange.minVariantPrice.currencyCode}`,
  }));
  return { count: items.length, items };
}

async function getOrderStatus(orderNumber: string, email: string) {
  if (!SHOPIFY_ADMIN_TOKEN) {
    return { error: "خدمة تتبع الطلبات غير مفعّلة حالياً." };
  }
  const name = orderNumber.startsWith("#") ? orderNumber : `#${orderNumber}`;
  const r = await fetch(
    `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/orders.json?status=any&name=${encodeURIComponent(name)}`,
    {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
        "Content-Type": "application/json",
      },
    },
  );
  if (!r.ok) return { error: "تعذّر جلب الطلب." };
  const data = await r.json();
  const order = (data?.orders || []).find(
    (o: any) => (o.email || "").toLowerCase() === email.toLowerCase(),
  );
  if (!order) {
    return {
      error:
        "لم نجد طلباً مطابقاً. تأكد من رقم الطلب والبريد الإلكتروني المستخدم في الشراء.",
    };
  }
  const fulfillment = order.fulfillments?.[0];
  return {
    order_number: order.name,
    financial_status: order.financial_status,
    fulfillment_status: order.fulfillment_status || "قيد التجهيز",
    total: `${order.total_price} ${order.currency}`,
    tracking_company: fulfillment?.tracking_company || null,
    tracking_number: fulfillment?.tracking_number || null,
    tracking_url: fulfillment?.tracking_url || null,
    created_at: order.created_at,
  };
}

function whatsappHandoff(reason: string) {
  const text = encodeURIComponent(`مرحباً، أحتاج مساعدة بخصوص: ${reason}`);
  return {
    url: `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,
    message: "تم تجهيز رابط واتساب للتحدث مع فريق الدعم.",
  };
}

async function executeTool(name: string, args: any) {
  try {
    if (name === "search_products") return await searchShopifyProducts(args.query, args.limit || 5);
    if (name === "get_order_status") return await getOrderStatus(args.order_number, args.email);
    if (name === "get_store_policy") return { policy: args.policy, text: POLICIES[args.policy] || "غير متوفرة." };
    if (name === "handoff_to_whatsapp") return whatsappHandoff(args.reason);
    return { error: `أداة غير معروفة: ${name}` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "tool error" };
  }
}

async function callAI(messages: any[], stream = true) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  return await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages,
      tools,
      stream,
    }),
  });
}

async function logConversation(sessionId: string, userMsg: string, assistantMsg: string) {
  try {
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return;
    const supabase = createClient(url, key);
    await supabase.from("chat_conversations").insert({
      session_id: sessionId,
      user_message: userMsg,
      assistant_message: assistantMsg,
    });
  } catch (e) {
    console.error("log conversation failed", e);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, sessionId } = await req.json();
    const conversation: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    // Tool-calling loop (max 4 iterations)
    for (let i = 0; i < 4; i++) {
      const resp = await callAI(conversation, false);
      if (!resp.ok) {
        if (resp.status === 429)
          return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح، حاول لاحقاً." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (resp.status === 402)
          return new Response(JSON.stringify({ error: "الرصيد غير كافٍ." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        const t = await resp.text();
        console.error("AI error", resp.status, t);
        return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const data = await resp.json();
      const choice = data.choices?.[0];
      const msg = choice?.message;
      if (!msg) break;

      if (msg.tool_calls && msg.tool_calls.length > 0) {
        conversation.push(msg);
        for (const tc of msg.tool_calls) {
          const args = typeof tc.function.arguments === "string"
            ? JSON.parse(tc.function.arguments || "{}")
            : tc.function.arguments;
          const result = await executeTool(tc.function.name, args);
          conversation.push({
            role: "tool",
            tool_call_id: tc.id,
            content: JSON.stringify(result),
          });
        }
        continue; // next loop
      }

      const finalText = msg.content || "";
      const lastUser = [...messages].reverse().find((m: any) => m.role === "user")?.content || "";
      logConversation(sessionId || "anon", lastUser, finalText);

      return new Response(JSON.stringify({ message: finalText }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "تعذّر الرد، حاول مجدداً." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
