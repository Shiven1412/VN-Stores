// supabase/functions/razorpay-actions/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Razorpay from "npm:razorpay@2.9.2"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// ✅ Use the npm: specifier
import CryptoJS from "npm:crypto-js@4.2.0";

// Map them to variables so you don't have to rewrite your code
const hmacSHA256 = CryptoJS.HmacSHA256;
const Hex = CryptoJS.enc.Hex;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS (Browser Checks)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. CHECK SECRETS (Inside the function now, so it won't crash silently)
    const keyId = Deno.env.get('RAZORPAY_KEY_ID');
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!keyId || !keySecret || !supabaseUrl || !supabaseKey) {
      throw new Error("Missing Secrets! Run: npx supabase secrets set RAZORPAY_KEY_ID=... RAZORPAY_KEY_SECRET=...");
    }

    // 3. Initialize Clients
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 4. Parse Request
    const { action, ...data } = await req.json()

    // --- ACTION: CREATE ORDER ---
    if (action === 'create-order') {
      const { amount } = data
      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      })
      return new Response(JSON.stringify(order), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // --- ACTION: VERIFY PAYMENT ---
    if (action === 'verify-payment') {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user_id, template_id, amount } = data

      // A. Generate Signature using crypto-js (Stable & Simple)
      const generated_signature = hmacSHA256(
        razorpay_order_id + "|" + razorpay_payment_id,
        keySecret
      ).toString(Hex);

      // B. Compare Signatures
      if (generated_signature !== razorpay_signature) {
        throw new Error("Invalid Signature: Payment verification failed");
      }

      // C. Save to Database (include template_id for sales tracking)
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{ 
          user_id, 
          template_id,
          total_amount: amount, 
          status: 'paid', 
          payment_id: razorpay_payment_id 
        }])
        .select()
        .single();

      if (orderError) throw new Error("DB Error: " + orderError.message);

      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ error: 'Invalid Action' }), { status: 400, headers: corsHeaders })

  } catch (error) {
    // This catches ANY error (missing keys, db fail, signature fail) and sends it to your browser console
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})