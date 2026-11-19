import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const body = await req.json();
    const { student_name, school_name, parent_name, parent_phone, level, grade, subject } = body;
    if (![student_name, school_name, parent_name, parent_phone, level, subject].every((v) => typeof v === "string" && v.trim().length > 0)) return json({ error: "Data peserta belum lengkap." }, 400);
    if (!["SD","SMP","SMA","SMK"].includes(level) || !Number.isInteger(grade) || grade < 1 || grade > 12 || !/^[0-9]{10,15}$/.test(parent_phone)) return json({ error: "Data jenjang, kelas, atau nomor WhatsApp tidak valid." }, 400);
    const url = Deno.env.get("SUPABASE_URL")!;
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const db = createClient(url, key, { auth: { persistSession: false } });
    const { data: questions, error: qError } = await db.from("diagnostic_questions").select("id,level,grade,subject,topic,question_text,options").eq("level",level).eq("grade",grade).eq("subject",subject).eq("is_active",true);
    if (qError) throw qError;
    if (!questions || questions.length < 20) return json({ error: "Bank soal untuk pilihan ini belum tersedia lengkap. Silakan pilih mata pelajaran lain atau hubungi admin." }, 409);
    const shuffled = questions.sort(() => Math.random() - 0.5).slice(0,20);
    const { data: student, error: sError } = await db.from("diagnostic_students").insert({ student_name: student_name.trim(), school_name: school_name.trim(), parent_name: parent_name.trim(), parent_phone, consent_at: new Date().toISOString() }).select("id").single();
    if (sError) throw sError;
    const started = new Date();
    const expires = new Date(started.getTime() + 20 * 60 * 1000);
    const { data: session, error: sessionError } = await db.from("diagnostic_sessions").insert({ student_id: student.id, level, grade, subject, expires_at: expires.toISOString(), total_questions: 20 }).select("id").single();
    if (sessionError) throw sessionError;
    const rows = shuffled.map((q: any, i: number) => ({ session_id: session.id, question_id: q.id, position: i + 1 }));
    const { error: linkError } = await db.from("diagnostic_session_questions").insert(rows);
    if (linkError) throw linkError;
    return json({ session_id: session.id, expires_at: expires.toISOString(), questions: shuffled.map((q: any) => ({ id: q.id, text: q.question_text, options: q.options, topic: q.topic })) });
  } catch (error) {
    console.error(error);
    return json({ error: "Tes belum dapat dimulai. Coba beberapa saat lagi." }, 500);
  }
});