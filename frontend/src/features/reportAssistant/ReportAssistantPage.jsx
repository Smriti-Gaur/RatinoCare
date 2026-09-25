import { useState } from "react";
import { FileText, LoaderCircle, MessageCircleQuestion, ShieldAlert, Upload } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import DashboardLayout from "../dashboard/components/DashboardLayout";

const extractPdfText = async (file) => {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(" "));
  }
  return pages.join("\n").trim();
};

const answerFromReport = (question, reportText) => {
  const normalizedQuestion = question.toLowerCase();
  const lines = reportText.split(/\n|(?<=[.!?])\s+/).map((line) => line.trim()).filter(Boolean);
  const terms = normalizedQuestion.split(/\W+/).filter((term) => term.length > 3);
  const matches = lines.filter((line) => terms.some((term) => line.toLowerCase().includes(term))).slice(0, 3);

  if (matches.length) return `I found these matching report excerpts:\n\n${matches.join("\n")}`;
  return "I could not find that information in this report. Please ask your doctor to interpret results that are unclear or missing.";
};

const ReportAssistantPage = () => {
  const [reportText, setReportText] = useState("");
  const [fileName, setFileName] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setLoading(true);
    setMessages([]);
    try {
      if (file.type !== "application/pdf") throw new Error("Please upload a PDF report.");
      const text = await extractPdfText(file);
      if (!text) throw new Error("No readable text was found in this PDF.");
      setReportText(text);
      setFileName(file.name);
    } catch (requestError) {
      setReportText("");
      setFileName("");
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = (event) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || !reportText) return;
    setMessages((current) => [...current, { question: trimmedQuestion, answer: answerFromReport(trimmedQuestion, reportText) }]);
    setQuestion("");
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-3xl bg-slate-950 px-6 py-8 text-white sm:px-8">
          <div className="flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300"><MessageCircleQuestion size={25} /></div><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Supporting tool</p><h1 className="mt-3 text-3xl font-bold tracking-tight">AI Report Assistant</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Upload a text-based PDF and ask questions about what it says. Answers are grounded only in extracted report text.</p></div></div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-8 text-center hover:bg-blue-50">
            <Upload className="text-blue-600" size={28} /><span className="mt-3 font-bold text-slate-900">Upload PDF report</span><span className="mt-1 text-sm text-slate-500">Text-based PDFs are supported</span><input type="file" accept="application/pdf" onChange={handleUpload} className="sr-only" />
          </label>
          {loading && <p className="mt-4 flex items-center gap-2 text-sm text-slate-600"><LoaderCircle className="animate-spin" size={16} /> Extracting report text...</p>}
          {fileName && !loading && <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-700"><FileText size={16} /> {fileName} is ready for questions.</p>}
          {error && <p className="mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800"><ShieldAlert size={17} /> {error}</p>}
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleAsk} className="flex flex-col gap-3 sm:flex-row"><input value={question} onChange={(event) => setQuestion(event.target.value)} disabled={!reportText} placeholder="Ask about a value or section in the report" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" /><button type="submit" disabled={!reportText || !question.trim()} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">Ask assistant</button></form>
          <div className="mt-6 space-y-4">{messages.map((message, index) => <article key={`${message.question}-${index}`} className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="font-bold text-slate-900">{message.question}</p><p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{message.answer}</p></article>)}</div>
        </section>
        <p className="text-xs leading-5 text-slate-500">This assistant does not diagnose, prescribe, invent missing values, or replace a doctor. It performs local text extraction and matching because the current backend has no AI provider or report-analysis API.</p>
      </div>
    </DashboardLayout>
  );
};

export default ReportAssistantPage;