import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const { session_id, answers } = await req.json();
    if (typeof session_id !== "string" || !Array.isArray(answers) || answers.length !== 20) return json({ error: "Jawaban tes tidak lengkap." }, 400);
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
    const { data: session, error: sessionError } = await db.from("diagnostic_sessions").select("id,status,expires_at").eq("id",session_id).single();
    if (sessionError || !session) return json({ error: "Sesi tes tidak ditemukan." }, 404);
    if (session.status !== "in_progress") return json({ error: "Sesi tes sudah dikumpulkan atau tidak aktif." }, 409);
    if (new Date(session.expires_at).getTime() < Date.now()) {
      await db.from("diagnostic_sessions").update({ status: "expired" }).eq("id",session_id);
      return json({ error: "Waktu tes sudah habis. Silakan mulai tes kembali." }, 410);
    }
    const { data: links, error: linkError } = await db.from("diagnostic_session_questions").select("question_id,diagnostic_questions(id,answer_key,topic)").eq("session_id",session_id);
    if (linkError || !links || links.length !== 20) throw linkError || new Error("Question set invalid");
    const allowed = new Map(links.map((row: any) => [row.question_id,row.diagnostic_questions]));
    const submitted = answers.filter((a: any) => allowed.has(a.question_id) && ["A","B","C","D",""].includes(a.answer));
    if (submitted.length !== 20 || new Set(submitted.map((a: any) => a.question_id)).size !== 20) return json({ error: "Jawaban tidak sesuai dengan soal pada sesi ini." }, 400);
    let correct = 0;
    const topics: Record<string,{correct:number,total:number}> = {};
    const answerRows = submitted.map((a: any) => {
      const q: any = allowed.get(a.question_id);
      const isCorrect = q.answer_key === a.answer;
      if (isCorrect) correct++;
      const topic = q.topic || "Materi umum";
      topics[topic] ||= { correct: 0, total: 0 };
      topics[topic].total++;
      if (isCorrect) topics[topic].correct++;
      return { session_id, question_id: a.question_id, selected_answer: a.answer || null, is_correct: isCorrect };
    });
    const { error: saveError } = await db.from("diagnostic_answers").insert(answerRows);
    if (saveError) throw saveError;
    const score = Math.round(correct / 20 * 100);
    const { error: updateError } = await db.from("diagnostic_sessions").update({ status: "completed", completed_at: new Date().toISOString(), score, correct_count: correct }).eq("id",session_id);
    if (updateError) throw updateError;
    const topic_breakdown = Object.fromEntries(Object.entries(topics).map(([name,v]) => [name,{ correct:v.correct,total:v.total,score:Math.round(v.correct/v.total*100) }]));
    return json({ score, correct_count: correct, total_questions: 20, topic_breakdown });
  } catch (error) {
    console.error(error);
    return json({ error: "Hasil tes belum dapat disimpan. Silakan hubungi admin." }, 500);
  }
});